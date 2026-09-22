import { expect, test, type Page } from 'playwright/test';

const admin = { id_usuario: 1, nombre: 'Admin', apellido: null, email: 'admin@example.test', telefono: '+59170000000', avatarUrl: null, rol: 'ADMIN', estado: 'Activo', emailVerificado: true, telefonoVerificado: false };
const puntos = [
  { idPuntoEntrega: 1, nombre: 'Plaza Bolivia', descripcion: null, referencia: 'Frente a la plaza', tipo: 'PUNTO_ENTREGA', activo: true, orden: 1 },
  { idPuntoEntrega: 2, nombre: 'Recojo en tienda', descripcion: null, referencia: null, tipo: 'RECOJO_TIENDA', activo: true, orden: 2 },
  { idPuntoEntrega: 3, nombre: 'Punto inactivo', descripcion: null, referencia: null, tipo: 'PUNTO_ENTREGA', activo: false, orden: 3 },
];

async function preparar(page: Page) {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario: admin } });
    if (path.endsWith('/admin/puntos-entrega') && route.request().method() === 'GET') return route.fulfill({ json: puntos });
    if (path.endsWith('/admin/configuracion-entrega') && route.request().method() === 'GET') return route.fulfill({ json: { id: 1, deliveryHabilitado: true, montoMinimoDelivery: '150', mensajeDelivery: null } });
    if (path.endsWith('/admin/puntos-entrega') && route.request().method() === 'POST') return route.fulfill({ status: 201, json: { ...puntos[0], idPuntoEntrega: 4, nombre: 'Nuevo punto' } });
    if (/\/admin\/puntos-entrega\/\d+$/.test(path) && route.request().method() === 'PATCH') return route.fulfill({ json: puntos[0] });
    if (path.endsWith('/admin/configuracion-entrega') && route.request().method() === 'PATCH') return route.fulfill({ json: { id: 1, deliveryHabilitado: false, montoMinimoDelivery: '200', mensajeDelivery: 'Pausado' } });
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/admin/entregas');
  await expect(page.getByRole('heading', { name: 'Entregas' })).toBeVisible();
}

test('admin gestiona puntos y configuración de delivery', async ({ page }) => {
  await preparar(page);
  await expect(page.getByText('Punto de entrega', { exact: true })).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'Recojo en tienda' })).toBeVisible();
  await expect(page.getByText('Inactivo', { exact: true })).toBeVisible();
  await expect(page.getByText('Eliminar', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Agregar punto' }).click();
  await page.getByLabel('Nombre').fill('Nuevo punto');
  await page.getByLabel('Orden').fill('4');
  await page.getByRole('button', { name: 'Guardar punto' }).click();
  await expect(page.getByText('Punto de entrega creado.')).toBeVisible();

  await page.getByTitle('Editar Plaza Bolivia').click();
  await page.getByLabel('Orden').fill('8');
  await page.getByRole('button', { name: 'Guardar punto' }).click();
  await expect(page.getByText('Punto de entrega actualizado.')).toBeVisible();

  await page.getByLabel('Delivery habilitado').uncheck();
  await page.getByLabel('Monto mínimo para delivery').fill('200');
  await page.getByLabel('Mensaje de delivery (opcional)').fill('Pausado');
  await page.getByRole('button', { name: 'Guardar configuración' }).click();
  await expect(page.getByText('Configuración de delivery guardada.')).toBeVisible();
});

test('mantiene la gestión de entregas sin desborde en tamaños objetivo', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    await preparar(page);
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  }
});
