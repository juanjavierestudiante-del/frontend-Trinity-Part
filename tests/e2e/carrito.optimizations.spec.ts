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

const detalle = (cantidad: number) => ({
  idDetalle: 1,
  idVariante: 1,
  cantidad,
  precio: '10',
  stock: 10,
  sku: 'SKU-1',
  producto: { idProducto: 1, nombre: 'Producto de prueba', slug: 'producto-de-prueba', imagen: null },
});

async function prepararCarrito(page: Page, onPut: (cantidad: number) => Promise<void> | void) {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 1 } });
    if (path.endsWith('/carrito') && request.method() === 'GET') return route.fulfill({ json: { items: [detalle(1)] } });
    if (path.endsWith('/carrito/items/1') && request.method() === 'PUT') {
      const { cantidad } = request.postDataJSON();
      await onPut(cantidad);
      return route.fulfill({ json: { idDetalle: 1, idVariante: 1, cantidad } });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/carrito');
  await expect(page.getByText('Producto de prueba')).toBeVisible();
}

async function prepararCarritoConCantidad(page: Page, cantidadInicial: number, onPut: (cantidad: number) => Promise<void> | void) {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: cantidadInicial } });
    if (path.endsWith('/carrito') && request.method() === 'GET') return route.fulfill({ json: { items: [detalle(cantidadInicial)] } });
    if (path.endsWith('/carrito/items/1') && request.method() === 'PUT') {
      const { cantidad } = request.postDataJSON();
      await onPut(cantidad);
      return route.fulfill({ json: { idDetalle: 1, idVariante: 1, cantidad } });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/carrito');
  await expect(page.getByText('Producto de prueba')).toBeVisible();
}

test('serializa cinco incrementos rápidos y conserva UI y requests en orden', async ({ page }) => {
  const cantidades: number[] = [];
  let cantidadServidor = 1;
  await prepararCarrito(page, async (cantidad) => {
    cantidades.push(cantidad);
    await new Promise((resolve) => setTimeout(resolve, 40));
    cantidadServidor = cantidad;
  });

  const aumentar = page.getByLabel('Aumentar cantidad');
  for (let index = 0; index < 5; index += 1) await aumentar.click();

  await expect.poll(() => cantidades.length).toBe(5);
  await expect(page.getByRole('table').getByText('6', { exact: true })).toBeVisible();
  expect(cantidades).toEqual([2, 3, 4, 5, 6]);
  await expect.poll(() => cantidadServidor).toBe(6);
  await expect(page.getByLabel('Carrito de compras (6 artículos)')).toBeVisible();
});

test('un error al actualizar revierte cantidad y contador, y muestra feedback', async ({ page }) => {
  await prepararCarrito(page, async () => {
    throw new Error('intercepted request failure');
  });

  await page.unroute('**/api/**');
  await page.route('**/api/carrito/items/1', (route) => route.fulfill({ status: 500, json: { error: 'Error de prueba' } }));
  await page.getByLabel('Aumentar cantidad').click();

  await expect(page.getByText('No se pudo actualizar la cantidad')).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (1 artículos)')).toBeVisible();
});

test('serializa clics alternados + y - sin respuestas fuera de orden', async ({ page }) => {
  const cantidades: number[] = [];
  let cantidadServidor = 3;
  await prepararCarritoConCantidad(page, 3, async (cantidad) => {
    cantidades.push(cantidad);
    await new Promise((resolve) => setTimeout(resolve, 25));
    cantidadServidor = cantidad;
  });

  const aumentar = page.getByLabel('Aumentar cantidad');
  const disminuir = page.getByLabel('Disminuir cantidad');
  for (const accion of [aumentar, aumentar, disminuir, aumentar, disminuir, aumentar]) await accion.click();

  await expect.poll(() => cantidades.length).toBe(6);
  expect(cantidades).toEqual([4, 5, 4, 5, 4, 5]);
  await expect.poll(() => cantidadServidor).toBe(5);
  await expect(page.getByRole('table').getByText('5', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (5 artículos)')).toBeVisible();
});

test('agregar confirma y actualiza badge antes de que responda un POST lento', async ({ page }) => {
  const requests: string[] = [];
  const producto = {
    idProducto: 1,
    idAtributoPrincipal: null,
    atributoPrincipal: null,
    nombre: 'Producto de prueba',
    slug: 'producto-prueba',
    descripcionCorta: null,
    descripcion: null,
    destacado: false,
    imagenes: [],
    categoria: { idCategoria: 1, nombre: 'Fiesta', slug: 'fiesta', imagenUrl: null, subcategorias: [] },
    estado: 'Activo',
    rating: 4,
    variantes: [{
      idVariante: 1,
      sku: 'SKU-1',
      cantidadContenido: 1,
      estado: 'Activo',
      inventario: { stockActual: 10, stockMinimo: 0 },
      imagenes: [],
      varianteAtributo: [],
      marca: null,
      unidad: null,
    }],
  };
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    requests.push(`${request.method()} ${path}`);
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 0 } });
    if (path.endsWith('/productos/producto-prueba')) return route.fulfill({ json: producto });
    if (path.endsWith('/carrito/items') && request.method() === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      return route.fulfill({ status: 201, json: { idDetalle: 1, idVariante: 1, cantidad: 1 } });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });

  await page.goto('/productos/producto-prueba');
  await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();

  await expect(page.getByRole('button', { name: 'Producto agregado al carrito' }).first()).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (1 artículos)')).toBeVisible();
  await page.getByLabel('Carrito de compras (1 artículos)').click();
  await expect(page.getByRole('heading', { name: 'Producto de prueba' })).toBeVisible();
  expect(requests).toContain('POST /api/carrito/items');
  expect(requests).not.toContain('GET /api/carrito');
});

test('error al agregar revierte badge y botón después del feedback optimista', async ({ page }) => {
  const producto = {
    idProducto: 1, idAtributoPrincipal: null, atributoPrincipal: null, nombre: 'Producto de prueba', slug: 'producto-prueba', descripcionCorta: null, descripcion: null, destacado: false, imagenes: [], categoria: { idCategoria: 1, nombre: 'Fiesta', slug: 'fiesta', imagenUrl: null, subcategorias: [] }, estado: 'Activo', rating: 4,
    variantes: [{ idVariante: 1, sku: 'SKU-1', cantidadContenido: 1, estado: 'Activo', inventario: { stockActual: 10, stockMinimo: 0 }, imagenes: [], varianteAtributo: [], marca: null, unidad: null }],
  };
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 0 } });
    if (path.endsWith('/productos/producto-prueba')) return route.fulfill({ json: producto });
    if (path.endsWith('/carrito/items') && request.method() === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return route.fulfill({ status: 400, json: { error: 'Stock insuficiente' } });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/productos/producto-prueba');
  await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
  await expect(page.getByRole('button', { name: 'Producto agregado al carrito' }).first()).toBeVisible();
  await expect(page.getByText('Stock insuficiente')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Agregar al carrito' }).first()).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (0 artículos)')).toBeVisible();
});

test('un PUT lento no retrasa el cambio de cantidad', async ({ page }) => {
  await prepararCarrito(page, async () => {
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  });

  await page.getByLabel('Aumentar cantidad').click();
  await expect(page.getByRole('table').getByText('2', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (2 artículos)')).toBeVisible();
});

test('un DELETE lento oculta el item y actualiza badge inmediatamente', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 1 } });
    if (path.endsWith('/carrito') && request.method() === 'GET') return route.fulfill({ json: { items: [detalle(1)] } });
    if (path.endsWith('/carrito/items/1') && request.method() === 'DELETE') {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/carrito');
  await expect(page.getByText('Producto de prueba')).toBeVisible();
  await page.getByLabel('Eliminar Producto de prueba').click();
  await expect(page.getByText('Tu carrito está vacío')).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (0 artículos)')).toBeVisible();
});
