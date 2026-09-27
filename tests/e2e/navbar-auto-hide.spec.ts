import { expect, test } from 'playwright/test';

async function mockHome(page: import('playwright/test').Page) {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ status: 401, json: { error: 'Sin sesión' } });
    if (path.endsWith('/carrito/count')) return route.fulfill({ json: { items: 0 } });
    if (path.endsWith('/categorias')) return route.fulfill({ json: [{ idCategoria: 1, nombre: 'Globos', slug: 'globos', imagenUrl: null, subcategorias: [] }] });
    if (path.endsWith('/productos')) return route.fulfill({ json: { items: [{ idProducto: 1, nombre: 'Producto de prueba', slug: 'producto-prueba', imagenes: [], variantes: [], precioDesde: '12.00', tieneVariacionPrecio: false, estado: 'Activo' }], total: 1, page: 1, limit: 20, totalPages: 1 } });
    return route.fulfill({ status: 404, json: { error: 'Fixture sin ruta' } });
  });
}

test('Navbar público se oculta sólo en móvil y reaparece al subir, abrir el menú o navegar', async ({ page }) => {
  await mockHome(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const nav = page.locator('nav').filter({ has: page.locator('img[alt="Trinity Party & Events"]') });
  for (const width of [320, 375, 414, 767, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const navHeight = await nav.evaluate((element) => element.getBoundingClientRect().height);
    const expectedHeight = width < 768 ? 73 : 86;
    expect(navHeight).toBeGreaterThan(expectedHeight - 1);
    expect(navHeight).toBeLessThan(expectedHeight + 1);
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  const menu = page.getByRole('button', { name: 'Abrir menú' });
  const closeMenu = page.getByRole('button', { name: 'Cerrar menú' });
  await expect(nav).toHaveClass(/translate-y-0/);

  await page.evaluate(() => window.scrollTo(0, 160));
  await expect.poll(() => nav.getByRole("img", { name: "Trinity Party & Events" }).evaluate((image) => image.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
  await expect(nav).toHaveClass(/-translate-y-\[calc\(100%\+3rem\)\]/);

  await page.evaluate(() => window.scrollTo(0, 80));
  await expect(nav).toHaveClass(/translate-y-0/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(nav).toHaveClass(/translate-y-0/);

  await menu.click();
  await expect(closeMenu).toHaveAttribute('aria-expanded', 'true');
  await page.evaluate(() => window.scrollTo(0, 180));
  await expect(nav).toHaveClass(/translate-y-0/);
  await closeMenu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');

  await page.evaluate(() => window.scrollTo(0, 220));
  await expect(nav).toHaveClass(/-translate-y-\[calc\(100%\+3rem\)\]/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await menu.click();
  await page.locator('#menu-movil').getByRole('link', { name: 'Tienda', exact: true }).click();
  await expect(page).toHaveURL(/\/catalogo/);
  await expect(nav).toHaveClass(/translate-y-0/);

  await page.keyboard.press('Tab');
  await page.getByRole('link', { name: 'Trinity Party & Events' }).focus();
  await page.evaluate(() => window.scrollTo(0, 240));
  await expect(nav).toHaveClass(/translate-y-0/);

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.evaluate(() => window.scrollTo(0, 480));
  await expect(nav).not.toHaveClass(/-translate-y-\[calc\(100%\+3rem\)\]/);

  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});
