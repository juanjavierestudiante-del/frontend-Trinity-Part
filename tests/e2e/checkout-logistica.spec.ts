import { expect, test, type Page } from 'playwright/test';

const usuario = {
  id_usuario: 1,
  nombre: 'Ana',
  apellido: 'Pérez',
  email: 'ana@example.test',
  telefono: '+59171234567',
  avatarUrl: null,
  rol: 'CLIENTE',
  estado: 'Activo',
  emailVerificado: false,
  telefonoVerificado: false,
};

const puntos = [
  { idPuntoEntrega: 1, nombre: 'Plaza Bolivia', descripcion: null, referencia: 'Referencia', tipo: 'PUNTO_ENTREGA', orden: 1 },
  { idPuntoEntrega: 2, nombre: 'Recojo en tienda', descripcion: null, referencia: null, tipo: 'RECOJO_TIENDA', orden: 2 },
];

const prepararCheckout = async (
  page: Page,
  { total = 200, configuracion = { deliveryHabilitado: true, montoMinimoDelivery: '150', mensajeDelivery: null }, pedido = { idPedido: 42, total: '200', estado: 'PENDIENTE' } } = {},
) => {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito')) return route.fulfill({ json: { items: [{ idDetalle: 1, idVariante: 1, cantidad: 1, variante: { idVariante: 1, sku: 'SKU-1', producto: { nombre: 'Producto de prueba' }, imagenes: [] } }] } });
    if (path.endsWith('/entrega/puntos')) return route.fulfill({ json: puntos });
    if (path.endsWith('/entrega/configuracion')) return route.fulfill({ json: configuracion });
    if (path.endsWith('/pedidos')) return route.fulfill({ status: 201, json: pedido });
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/checkout');
  await page.locator('input[name="metodoEntrega"][value="PUNTO_ENTREGA"]').waitFor();
};

test('precarga contacto y envía un body limpio para punto de entrega', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await prepararCheckout(page);
  await page.route('**/api/pedidos', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { idPedido: 42, total: '200', estado: 'PENDIENTE' } });
  });

  await expect(page.getByLabel('Nombre de contacto')).toHaveValue('Ana Pérez');
  await expect(page.getByLabel('Celular (WhatsApp)')).toHaveValue('+59171234567');
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await page.waitForURL('**/checkout/confirmacion');

  expect(body).toEqual({ nombreContacto: 'Ana Pérez', telefonoContacto: '+59171234567', notas: null, metodoEntrega: 'PUNTO_ENTREGA', idPuntoEntrega: 1 });
});

test('envía RECOJO_TIENDA sin dirección legacy ni campos de delivery', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await prepararCheckout(page);
  await page.route('**/api/pedidos', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { idPedido: 43, total: '200', estado: 'PENDIENTE' } });
  });

  await page.locator('input[name="metodoEntrega"][value="RECOJO_TIENDA"]').check({ force: true });
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await page.waitForURL('**/checkout/confirmacion');

  expect(body).toEqual({ nombreContacto: 'Ana Pérez', telefonoContacto: '+59171234567', notas: null, metodoEntrega: 'RECOJO_TIENDA', idPuntoEntrega: 2 });
});

test('explica delivery deshabilitado o bajo el mínimo', async ({ page }) => {
  await prepararCheckout(page, { total: 120 });
  await expect(page.getByText('Disponible desde Bs. 150.00. Te faltan Bs. 30.00.')).toBeVisible();
  await expect(page.locator('input[name="metodoEntrega"][value="DELIVERY"]')).toBeDisabled();

  await prepararCheckout(page, { configuracion: { deliveryHabilitado: false, montoMinimoDelivery: '150', mensajeDelivery: 'Delivery pausado hoy' } });
  await expect(page.getByText('Delivery pausado hoy')).toBeVisible();
  await expect(page.locator('input[name="metodoEntrega"][value="DELIVERY"]')).toBeDisabled();
});

test('valida delivery y envía solamente los campos del método', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await prepararCheckout(page);
  await page.route('**/api/pedidos', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { idPedido: 44, total: '200', estado: 'PENDIENTE' } });
  });
  await page.locator('input[name="metodoEntrega"][value="DELIVERY"]').check({ force: true });
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('La zona es obligatoria')).toBeVisible();
  await expect(page.getByText('La dirección es obligatoria')).toBeVisible();
  await page.getByLabel('Zona').fill('Sopocachi');
  await page.getByLabel('Dirección').fill('Av. 6 de Agosto 100');
  await page.getByLabel('Referencia (opcional)').fill('Puerta azul');
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await page.waitForURL('**/checkout/confirmacion');

  expect(body).toEqual({ nombreContacto: 'Ana Pérez', telefonoContacto: '+59171234567', notas: null, metodoEntrega: 'DELIVERY', deliveryZona: 'Sopocachi', deliveryDireccion: 'Av. 6 de Agosto 100', deliveryReferencia: 'Puerta azul' });
  expect(body).not.toHaveProperty('idPuntoEntrega');
  expect(body).not.toHaveProperty('total');
  expect(body).not.toHaveProperty('puntoEntregaNombre');
});

test('muestra un error 409 de delivery sin filtrar detalles técnicos', async ({ page }) => {
  await prepararCheckout(page);
  await page.route('**/api/pedidos', async (route) => route.fulfill({ status: 409, json: { error: 'Delivery disponible desde Bs 150' } }));
  await page.locator('input[name="metodoEntrega"][value="DELIVERY"]').check({ force: true });
  await page.getByLabel('Zona').fill('Centro');
  await page.getByLabel('Dirección').fill('Calle 1');
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await expect(page.getByText('El monto mínimo para delivery es Bs 150.')).toBeVisible();
});

test('mantiene el checkout logístico usable sin desborde en los viewports objetivo', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await prepararCheckout(page);

    await expect(page.getByLabel('Nombre de contacto')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar pedido' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
