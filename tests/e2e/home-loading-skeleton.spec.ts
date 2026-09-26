import { expect, test } from 'playwright/test';

const categorias = [
  { idCategoria: 1, nombre: 'Globos', slug: 'globos', imagenUrl: null, subcategorias: [] },
  { idCategoria: 2, nombre: 'Cotillón', slug: 'cotillon', imagenUrl: null, subcategorias: [] },
];

const productos = {
  items: [
    {
      idProducto: 1,
      nombre: 'Producto destacado',
      slug: 'producto-destacado',
      descripcionCorta: 'Producto para fixture de Home.',
      imagenes: [],
      variantes: [],
      precioDesde: '12.00',
      tieneVariacionPrecio: false,
      estado: 'Activo',
    },
  ],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

test('Home reserva skeletons y resuelve categorías y destacados de forma independiente', async ({ page }) => {
  let liberarCategorias!: () => void;
  let liberarProductos!: () => void;
  let categoriasSolicitadas!: () => void;
  let productosSolicitados!: () => void;

  const categoriasPendientes = new Promise<void>((resolve) => { liberarCategorias = resolve; });
  const productosPendientes = new Promise<void>((resolve) => { liberarProductos = resolve; });
  const categoriasIniciadas = new Promise<void>((resolve) => { categoriasSolicitadas = resolve; });
  const productosIniciados = new Promise<void>((resolve) => { productosSolicitados = resolve; });

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path.endsWith('/auth/me')) return route.fulfill({ status: 401, json: { error: 'Sin sesión' } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 0 } });
    if (path.endsWith('/categorias')) {
      categoriasSolicitadas();
      await categoriasPendientes;
      return route.fulfill({ json: categorias });
    }
    if (path.endsWith('/productos') && request.method() === 'GET') {
      productosSolicitados();
      await productosPendientes;
      return route.fulfill({ json: productos });
    }

    return route.fulfill({ status: 404, json: { error: 'Fixture sin ruta' } });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'TODO PARA TU FIESTA' })).toBeVisible();
  await categoriasIniciadas;
  await productosIniciados;

  const seccionCategorias = page.locator('section').filter({ has: page.getByRole('heading', { name: 'CATEGORÍAS' }) });
  const seccionProductos = page.locator('section').filter({ has: page.getByRole('heading', { name: 'PRODUCTOS DESTACADOS' }) });

  await expect(seccionCategorias).toHaveAttribute('aria-busy', 'true');
  await expect(seccionProductos).toHaveAttribute('aria-busy', 'true');
  await expect(seccionCategorias.locator('div[aria-hidden="true"]')).toHaveCount(6);
  await expect(seccionProductos.locator('div[aria-hidden="true"]')).toHaveCount(3);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

  liberarCategorias();
  await expect(seccionCategorias.getByText('Globos', { exact: true })).toBeVisible();
  await expect(seccionCategorias).toHaveAttribute('aria-busy', 'false');
  await expect(seccionProductos).toHaveAttribute('aria-busy', 'true');


  liberarProductos();
  await expect(seccionProductos.getByRole("heading", { name: "Producto destacado", level: 3 })).toBeVisible();
  await expect(seccionProductos).toHaveAttribute("aria-busy", "false");
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});
