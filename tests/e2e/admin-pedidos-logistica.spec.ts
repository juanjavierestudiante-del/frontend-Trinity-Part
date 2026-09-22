import { expect, test, type Page } from 'playwright/test';

const admin = {
  id_usuario: 1,
  nombre: 'Administradora',
  apellido: null,
  email: 'admin@example.test',
  telefono: '+59170000000',
  avatarUrl: null,
  rol: 'ADMIN',
  estado: 'Activo',
  emailVerificado: true,
  telefonoVerificado: false,
};

const pedidos = [
  {
    idPedido: 1,
    estado: 'PENDIENTE',
    total: '120',
    fechaCreacion: '2026-09-18T12:00:00.000Z',
    nombreContacto: 'Cliente Punto',
    telefonoContacto: '+59171234567',
    metodoEntrega: 'PUNTO_ENTREGA',
    puntoEntregaNombre: 'Plaza Bolivia',
    puntoEntregaReferencia: 'Frente a la fuente',
    items: [],
  },
  {
    idPedido: 2,
    estado: 'PENDIENTE',
    total: '160',
    fechaCreacion: '2026-09-18T12:00:00.000Z',
    nombreContacto: 'Cliente Recojo',
    telefonoContacto: '+59172345678',
    metodoEntrega: 'RECOJO_TIENDA',
    puntoEntregaNombre: 'Recojo en tienda',
    puntoEntregaReferencia: null,
    items: [],
  },
  {
    idPedido: 3,
    estado: 'PENDIENTE',
    total: '200',
    fechaCreacion: '2026-09-18T12:00:00.000Z',
    nombreContacto: 'Cliente Delivery',
    telefonoContacto: '+59173456789',
    metodoEntrega: 'DELIVERY',
    deliveryZona: 'Sopocachi',
    deliveryDireccion: 'Av. 6 de Agosto 100',
    deliveryReferencia: 'Puerta azul',
    items: [],
  },
  {
    idPedido: 4,
    estado: 'PENDIENTE',
    total: '80',
    fechaCreacion: '2026-09-18T12:00:00.000Z',
    nombreContacto: 'Cliente Histórico',
    telefonoContacto: '+59174567890',
    metodoEntrega: null,
    direccionEntrega: 'Dirección histórica',
    items: [],
  },
  {
    idPedido: 5,
    estado: 'PENDIENTE',
    total: '80',
    fechaCreacion: '2026-09-18T12:00:00.000Z',
    nombreContacto: 'Cliente Histórico sin dirección',
    telefonoContacto: '+59175678901',
    metodoEntrega: null,
    direccionEntrega: null,
    items: [],
  },
];

async function prepararPedidosAdmin(page: Page) {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario: admin } });
    if (path.endsWith('/admin/pedidos')) {
      return route.fulfill({ json: { items: pedidos, total: pedidos.length, page: 1, limit: 20, totalPages: 1 } });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/admin/pedidos');
  await expect(page.getByText('Cliente Punto')).toBeVisible();
}

async function abrirDetalle(page: Page, idPedido: number) {
  const fila = page.locator('tr').filter({ hasText: `#${idPedido}` });
  await fila.getByTitle('Ver detalle').click();
}

test('muestra snapshots de punto, recojo y delivery sin inferir pedidos históricos', async ({ page }) => {
  await prepararPedidosAdmin(page);

  await expect(page.getByText('Punto de entrega', { exact: true })).toBeVisible();
  await expect(page.getByText('Recojo en tienda', { exact: true })).toBeVisible();
  await expect(page.getByText('Delivery', { exact: true })).toBeVisible();
  await expect(page.getByText('Anterior', { exact: true })).toHaveCount(2);

  await abrirDetalle(page, 1);
  await expect(page.getByText('Plaza Bolivia')).toBeVisible();
  await expect(page.getByText('Frente a la fuente')).toBeVisible();

  await abrirDetalle(page, 2);
  await expect(page.getByText('Punto: Recojo en tienda')).toBeVisible();

  await abrirDetalle(page, 3);
  await expect(page.getByText('Zona: Sopocachi')).toBeVisible();
  await expect(page.getByText('Dirección: Av. 6 de Agosto 100')).toBeVisible();
  await expect(page.getByText('Referencia: Puerta azul')).toBeVisible();
  await expect(page.getByText('Teléfono: +59173456789')).toBeVisible();

  await abrirDetalle(page, 4);
  await expect(page.getByText('Entrega anterior / método no registrado')).toBeVisible();
  await expect(page.getByText('Dirección registrada anteriormente: Dirección histórica')).toBeVisible();

  await abrirDetalle(page, 5);
  await expect(page.getByText('Entrega anterior / método no registrado')).toHaveCount(2);
  await expect(page.getByText('Retiro en tienda', { exact: true })).toHaveCount(0);
});

test('mantiene el detalle logístico usable sin desborde en los tamaños objetivo', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await prepararPedidosAdmin(page);
    await abrirDetalle(page, 3);

    await expect(page.getByText('Dirección: Av. 6 de Agosto 100')).toBeVisible();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  }
});
