import { expect, test, type Page } from 'playwright/test';

const usuario = { id_usuario: 901, nombre: 'E2E', apellido: 'Pricing', email: 'pricing@example.test', telefono: '+59171234567', avatarUrl: null, rol: 'CLIENTE', estado: 'Activo', emailVerificado: true, telefonoVerificado: true };
const categoria = { idCategoria: 1, nombre: 'Pruebas', slug: 'pruebas', imagenUrl: null, subcategorias: [] };

const producto = {
  idProducto: 901,
  idAtributoPrincipal: null,
  atributoPrincipal: null,
  nombre: 'Producto E2E Pricing',
  slug: 'producto-e2e-pricing',
  descripcionCorta: 'Fixture aislada de pricing.',
  descripcion: null,
  destacado: false,
  imagenes: [],
  categoria,
  estado: 'Activo',
  rating: 5,
  precioDesde: '20.00',
  tieneVariacionPrecio: true,
  listaPrecios: [],
  variantes: [],
};

const item = (idDetalle: number, idVariante: number, nombre: string, cantidad: number, precio: string, subtotal: string) => ({
  idDetalle, idVariante, cantidad, stock: 15, sku: `E2E-${idVariante}`,
  producto: { idProducto: 901, nombre, slug: producto.slug, imagen: null },
  idListaPrecioEfectiva: idVariante === 3 ? 2 : 1,
  precioPorPresentacion: precio,
  subtotal,
});

const carrito = (verde = 2) => {
  const principalPrecio = verde === 2 ? '18.00' : '20.00';
  const principalUmbral = verde === 2 ? 5 : 1;
  const rojo = item(1, 1, 'Rojo', 3, principalPrecio, verde === 2 ? '54.00' : '60.00');
  const verdeItem = item(2, 2, 'Verde', verde, principalPrecio, verde === 2 ? '36.00' : '20.00');
  const turquesa = item(3, 3, 'Turquesa', 2, '25.00', '50.00');
  const items = [rojo, verdeItem, turquesa];
  return {
    idCarrito: 901,
    items,
    totalItems: 3,
    total: verde === 2 ? '140.00' : '130.00',
    gruposPrecio: [
      { idProducto: 901, idListaPrecioEfectiva: 1, cantidadTotalGrupo: 3 + verde, cantidadMinimaAplicada: principalUmbral, precioPorPresentacion: principalPrecio, subtotalGrupo: verde === 2 ? '90.00' : '80.00', idsVariantes: [1, 2], idsDetalles: [1, 2] },
      { idProducto: 901, idListaPrecioEfectiva: 2, cantidadTotalGrupo: 2, cantidadMinimaAplicada: 1, precioPorPresentacion: '25.00', subtotalGrupo: '50.00', idsVariantes: [3], idsDetalles: [3] },
    ],
  };
};

async function preparar(page: Page, onPedido?: (body: Record<string, unknown>) => void) {
  let verde = 2;
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/productos') && request.method() === 'GET') return route.fulfill({ json: { items: [producto, { ...producto, idProducto: 902, nombre: 'Producto E2E Uniforme', slug: 'producto-e2e-uniforme', precioDesde: '20.00', tieneVariacionPrecio: false }], total: 2, page: 1, limit: 20, totalPages: 1 } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 7 } });
    if (path.endsWith('/carrito') && request.method() === 'GET') return route.fulfill({ json: carrito(verde) });
    if (path.endsWith('/entrega/puntos')) return route.fulfill({ json: [{ idPuntoEntrega: 1, nombre: 'Punto E2E', descripcion: null, referencia: null, tipo: 'PUNTO_ENTREGA', orden: 1 }] });
    if (path.endsWith('/entrega/configuracion')) return route.fulfill({ json: { deliveryHabilitado: false, montoMinimoDelivery: '150.00', mensajeDelivery: null } });
    if (path.endsWith('/pedidos') && request.method() === 'POST') {
      onPedido?.(request.postDataJSON());
      return route.fulfill({ status: 201, json: { idPedido: 901, total: verde === 2 ? '140.00' : '130.00', estado: 'PENDIENTE' } });
    }
    if (path.endsWith('/carrito/items/2') && request.method() === 'PUT') {
      verde = request.postDataJSON().cantidad;
      return route.fulfill({ json: { idDetalle: 2, idVariante: 2, cantidad: verde } });
    }
    return route.fulfill({ status: 404, json: { error: 'Fixture E2E sin ruta' } });
  });
}

test('las cards muestran Desde solo cuando las variantes iniciales difieren', async ({ page }) => {
  await preparar(page);
  await page.goto('/catalogo');
  await expect(page.getByText('Desde Bs. 20.00')).toBeVisible();
  const uniforme = page.getByText('Producto E2E Uniforme').locator('xpath=ancestor::div[contains(@class, "group")][1]');
  await expect(uniforme.getByText('Bs. 20.00')).toBeVisible();
  await expect(uniforme.getByText('Desde Bs. 20.00')).toHaveCount(0);
});

test('el carrito explica el umbral compartido y lo recalcula para todas las líneas', async ({ page }) => {
  await preparar(page);
  await page.goto('/carrito');
  await expect(page.getByText('Precio por cantidad aplicado:')).toBeVisible();
  await expect(page.getByText(/5 presentaciones combinadas/)).toBeVisible();
  await expect(page.getByText('Bs. 18.00 por presentación')).toHaveCount(2);
  await expect(page.getByText('Bs. 25.00 por presentación')).toBeVisible();
  await expect(page.getByLabel('Carrito de compras (7 artículos)')).toBeVisible();

  await page.getByLabel('Disminuir cantidad').nth(1).click();
  await expect(page.getByText('Bs. 20.00 por presentación')).toHaveCount(2);
  await expect(page.getByText('Precio por cantidad aplicado:')).toHaveCount(0);
  await expect(page.getByText('Bs. 25.00 por presentación')).toBeVisible();
});

test('checkout conserva el precio aplicado por grupo en la confirmación', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await preparar(page, (recibido) => { body = recibido; });
  await page.goto('/checkout');
  await expect(page.getByText('Rojo x3')).toBeVisible();
  await expect(page.getByText('Bs. 54.00')).toBeVisible();
  await expect(page.getByText('Verde x2')).toBeVisible();
  await expect(page.getByText('Bs. 36.00')).toBeVisible();
  await expect(page.getByText('Turquesa x2')).toBeVisible();
  await expect(page.getByText('Bs. 50.00')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await page.waitForURL('**/checkout/confirmacion');
  expect(body).toMatchObject({ nombreContacto: 'E2E Pricing', metodoEntrega: 'PUNTO_ENTREGA', idPuntoEntrega: 1 });
  await expect(page.getByText('Total:')).toBeVisible();
  await expect(page.getByText('Bs. 140.00')).toBeVisible();
});

test('la PDP mantiene el precio normal y revela el precio por cantidad sin alterar colores', async ({ page }) => {
  const reglas = [
    { idReglaPrecio: 1, nombre: 'Normal', cantidadMinima: 1, precioPorPresentacion: '10.00', principal: true, orden: 0 },
    { idReglaPrecio: 2, nombre: 'Media docena', cantidadMinima: 6, precioPorPresentacion: '7.92', principal: false, orden: 1 },
    { idReglaPrecio: 3, nombre: 'Docena mayorista', cantidadMinima: 60, precioPorPresentacion: '6.83', principal: false, orden: 2 },
  ];
  const atributo = (idValor: number, valor: string, visualValue: string, idAtributo: number, nombre: string) => ({ idValor, valor, visualValue, atributo: { idAtributo, nombre, tipoVisualizacion: nombre === 'Color' ? 'color' : 'text' } });
  const variante = (idVariante: number, color: string, visualValue: string) => ({
    idVariante, sku: `PDP-${idVariante}`, cantidadContenido: 1, estado: 'Activo', inventario: { stockActual: 80, stockMinimo: 1 }, imagenes: [], marca: null, unidad: { nombre: 'unidad', abreviatura: 'u' }, idListaPrecio: null,
    varianteAtributo: [
      { valorAtributo: atributo(idVariante, color, visualValue, 1, 'Color') },
      { valorAtributo: atributo(10, 'Aluminio / Foil', null, 2, 'Material') },
      { valorAtributo: atributo(11, '2 m × 1 m', null, 3, 'Tamaño') },
    ],
  });
  const productoPdp = {
    ...producto,
    idProducto: 903,
    idAtributoPrincipal: 1,
    atributoPrincipal: { idAtributo: 1, nombre: 'Color', tipoVisualizacion: 'color' },
    nombre: 'Cortina E2E PDP',
    slug: 'cortina-e2e-pdp',
    listaPrecios: [{ idListaPrecio: 3, nombre: 'Principal', principal: true, reglas }],
    variantes: [variante(1, 'Rojo', '#e11d48'), variante(2, 'Verde', '#16a34a')],
  };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario } });
    if (path.endsWith('/categorias')) return route.fulfill({ json: [] });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 0 } });
    if (path.endsWith('/productos/cortina-e2e-pdp') && request.method() === 'GET') return route.fulfill({ json: productoPdp });
    if (path.endsWith('/productos/903/precio') && request.method() === 'POST') {
      const cantidad = request.postDataJSON().lineas[0].cantidad;
      const regla = [...reglas].reverse().find((item) => item.cantidadMinima <= cantidad) ?? reglas[0];
      return route.fulfill({ json: { lineas: [{ idVariante: request.postDataJSON().lineas[0].idVariante, cantidad, idListaPrecioEfectiva: 3, cantidadMinimaAplicada: regla.cantidadMinima, precioPorPresentacion: regla.precioPorPresentacion, subtotal: (cantidad * Number(regla.precioPorPresentacion)).toFixed(2) }], total: (cantidad * Number(regla.precioPorPresentacion)).toFixed(2) } });
    }
    return route.fulfill({ status: 404, json: { error: 'Fixture PDP sin ruta' } });
  });

  await page.goto('/productos/cortina-e2e-pdp');
  const buyBox = page.locator('main > div > div > div.grid > aside');
  await expect(buyBox.getByText('Bs. 10.00', { exact: true })).toBeVisible();
  await expect(buyBox.getByText('Precio por cantidad · desde 6')).toHaveCount(0);
  await expect(buyBox.locator('details')).not.toHaveAttribute('open', '');
  await expect(buyBox.getByRole('button', { name: 'Color: Verde' })).toBeVisible();

  for (let indice = 0; indice < 6; indice += 1) await buyBox.getByLabel('Aumentar cantidad').click();
  await expect(buyBox.getByText('Precio por cantidad · desde 6')).toBeVisible();
  await expect(buyBox.getByText('Bs. 10.00', { exact: true })).toHaveClass(/line-through/);
  await expect(buyBox.getByText('Bs. 7.92', { exact: true })).toBeVisible();
  await expect(buyBox.getByText('Total: Bs. 55.44')).toBeVisible();
  await expect(buyBox.getByRole('button', { name: 'Agregar 7 · Bs. 55.44' })).toBeVisible();

  await buyBox.getByText('Ver precios por cantidad').click();
  await expect(buyBox.getByText('1+ · Bs. 10.00')).toBeVisible();
  await expect(buyBox.getByText('6+ · Bs. 7.92')).toBeVisible();
  await expect(buyBox.getByText('60+ · Bs. 6.83', { exact: true })).toBeVisible();
  await buyBox.getByRole('button', { name: 'Color: Verde' }).click();
  await expect(buyBox.getByText('Color: Verde')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel('Compra rápida')).toBeVisible();
  await expect(page.getByLabel('Compra rápida').getByText('Agregar 7 · Bs. 55.44')).toBeVisible();
  expect(await page.locator('body').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBeTruthy();
});
