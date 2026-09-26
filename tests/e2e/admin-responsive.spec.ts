import { expect, test, type Page } from 'playwright/test'

const admin = { id_usuario: 1, nombre: 'Admin', apellido: null, email: 'admin@example.test', telefono: '+59170000000', avatarUrl: null, rol: 'ADMIN', estado: 'Activo', emailVerificado: true, telefonoVerificado: false }

async function preparar(page: Page) {
  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario: admin } })
    if (path.endsWith('/admin/productos')) return route.fulfill({ json: [{ idProducto: 1, nombre: 'Producto de prueba con nombre largo', slug: 'producto-prueba', estado: 'Activo', categoria: { idCategoria: 1, nombre: 'Globos' }, variantes: [{ idVariante: 1 }], imagenes: [] }] })
    if (path.endsWith('/admin/inventario')) return route.fulfill({ json: { items: [{ idVariante: 1, producto: 'Producto de prueba con nombre largo', sku: 'SKU-PRUEBA-001', marca: 'Marca', stockActual: 5, stockMinimo: 2, stockMaximo: 10, estado: 'Activo' }], total: 1, page: 1, totalPages: 1 } })
    if (path.endsWith('/admin/categorias')) return route.fulfill({ json: [{ idCategoria: 1, nombre: 'Categoría de prueba', slug: 'categoria-prueba', estado: 'Activo', subcategorias: [] }] })
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } })
  })
}

for (const viewport of [{ width: 320, height: 800 }, { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1366, height: 768 }]) {
  test(`admin conserva un viewport usable en ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await preparar(page)
    for (const route of ['/admin/productos', '/admin/productos/nuevo', '/admin/inventario', '/admin/categorias', '/admin/categorias/nueva']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('#admin-main')).toBeVisible()
      await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true)
    }
  })
}

test('el menú admin abre, se cierra al navegar y responde a Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await preparar(page)
  await page.goto('/admin/productos', { waitUntil: 'domcontentloaded' })
  const menu = page.getByRole('button', { name: 'Abrir menú de administración' })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await page.getByRole('link', { name: /Inventario/i }).click()
  await expect(page).toHaveURL(/\/admin\/inventario$/)
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})
