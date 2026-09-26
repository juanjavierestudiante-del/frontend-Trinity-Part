import { expect, test, type Page } from 'playwright/test'

const admin = { id_usuario: 1, nombre: 'Admin', apellido: null, email: 'admin@example.test', telefono: '+59170000000', avatarUrl: null, rol: 'ADMIN', estado: 'Activo', emailVerificado: true, telefonoVerificado: false }
const regla = { idReglaPrecio: 10, nombre: 'Normal', cantidadMinima: 1, precioPorPresentacion: '18.00', principal: true, activo: true, orden: 0 }
const configuracion = { producto: { idProducto: 3, nombre: 'Globo Normal 9"' }, listasPrecio: [{ idListaPrecio: 1, nombre: 'Principal', principal: true, activo: true, reglas: [regla] }], variantes: [{ idVariante: 7, sku: 'globo-normal-001', nombreVisible: 'Color: Rojo', idListaPrecio: null, listaEfectiva: 1 }] }

async function preparar(page: Page) {
  const guardados: unknown[] = []
  await page.route('**/api/**', async (route) => {
    const request = route.request(); const path = new URL(request.url()).pathname
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario: admin } })
    if (path.endsWith('/admin/productos/3') && request.method() === 'GET') return route.fulfill({ json: { idProducto: 3, nombre: 'Globo Normal 9"', slug: 'globo-normal-9', imagenes: [], categoria: { idCategoria: 1, nombre: 'Globos' }, descripcionCorta: null, descripcion: null, destacado: false, estado: 'Activo', rating: '4.0' } })
    if (path.endsWith('/admin/categorias') && request.method() === 'GET') return route.fulfill({ json: [{ idCategoria: 1, nombre: 'Globos', estado: 'Activo' }] })
    if (path.endsWith('/admin/productos/3/precios-cantidad') && request.method() === 'GET') return route.fulfill({ json: configuracion })
    if (path.endsWith('/precios-cantidad/previsualizar') && request.method() === 'POST') return route.fulfill({ json: { cantidad: 7, idReglaPrecio: 10, cantidadMinimaAplicada: 1, precioPorPresentacion: '18.00', subtotal: '126.00' } })
    if (request.method() === 'POST' || request.method() === 'PUT') { guardados.push(request.postDataJSON()); return route.fulfill({ status: request.method() === 'POST' ? 201 : 204, json: {} }) }
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } })
  })
  await page.goto('/admin/productos/3'); await page.getByRole('tab', { name: 'Precios por cantidad' }).click(); await expect(page.getByRole('heading', { name: 'Listas de precios' })).toBeVisible(); return guardados
}

test('admin edita una lista compartida y asigna variantes en bloque', async ({ page }) => {
  const guardados = await preparar(page)
  await page.getByRole('button', { name: /Editar/ }).click(); await page.getByLabel('Bs / presentación').fill('17.50'); await page.getByRole('button', { name: 'Guardar lista' }).click(); await expect.poll(() => guardados.length).toBe(1)
  await page.getByRole('checkbox').last().check(); await page.getByRole('button', { name: 'Aplicar a seleccionadas' }).click(); await expect.poll(() => guardados.length).toBe(2)
})

test('preview usa un umbral y no guarda la lista', async ({ page }) => {
  const guardados = await preparar(page); await page.getByRole('button', { name: /Editar/ }).click(); await page.getByLabel('Presentaciones').fill('7'); await page.getByRole('button', { name: 'Calcular' }).click(); await expect(page.getByText(/Total Bs 126.00/)).toBeVisible(); expect(guardados).toHaveLength(0)
})
