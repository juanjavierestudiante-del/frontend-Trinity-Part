import { expect, test, type Page } from 'playwright/test';

const usuario = {
  id_usuario: 12,
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

async function prepararPerfil(page: Page, user = usuario) {
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/auth/me')) return route.fulfill({ json: { usuario: user } });
    if (path.endsWith('/pedidos')) return route.fulfill({ json: [] });
    return route.fulfill({ status: 404, json: { error: 'No encontrado' } });
  });
  await page.goto('/perfil');
  await expect(page.getByRole('heading', { name: 'MI PERFIL' })).toBeVisible();
}

test('muestra datos reales, avatar Google y fallback de iniciales sin campos legacy', async ({ page }) => {
  await prepararPerfil(page, { ...usuario, avatarUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E' });

  await expect(page.getByAltText('Avatar de Ana Pérez')).toBeVisible();
  await expect(page.locator('dd').filter({ hasText: 'ana@example.test' })).toBeVisible();
  await expect(page.locator('dd').filter({ hasText: '+59171234567' })).toBeVisible();
  await expect(page.getByText('Dirección', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Miembro desde/)).toHaveCount(0);

  await prepararPerfil(page, { ...usuario, apellido: null, avatarUrl: null });
  await expect(page.getByLabel('Iniciales de Ana')).toHaveText('A');
  await expect(page.getByText(/undefined|null/)).toHaveCount(0);
});

test('edita, cancela y actualiza Zustand mediante PATCH sin recargar', async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await prepararPerfil(page);
  await page.route('**/api/auth/profile', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ json: { usuario: { ...usuario, nombre: 'Ana María', apellido: 'López', telefono: '+59171234568' } } });
  });

  await page.getByRole('button', { name: 'Editar información' }).click();
  await page.getByLabel('Nombre').fill('Cambio temporal');
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page.locator('dd').filter({ hasText: 'Ana' }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Editar información' }).click();
  await page.getByLabel('Nombre').fill('Ana María');
  await page.getByLabel('Apellido').fill('López');
  await page.getByLabel('Teléfono').fill('71234568');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();

  expect(body).toEqual({ nombre: 'Ana María', apellido: 'López', telefono: '71234568' });
  await expect(page.getByText('Tus datos fueron actualizados.')).toBeVisible();
  await expect(page.getByText('Ana María López')).toBeVisible();
  await expect(page.locator('dd').filter({ hasText: '+59171234568' })).toBeVisible();
});

test('muestra el conflicto de teléfono y evita doble envío durante la carga', async ({ page }) => {
  let resolver: (() => void) | undefined;
  let requests = 0;
  await prepararPerfil(page);
  await page.route('**/api/auth/profile', async (route) => {
    requests += 1;
    if (requests === 1) {
      await new Promise((resolve) => { resolver = resolve; });
      await route.fulfill({ status: 409, json: { error: 'El teléfono ya está registrado' } });
      return;
    }
    await route.fulfill({ status: 409, json: { error: 'El teléfono ya está registrado' } });
  });

  await page.getByRole('button', { name: 'Editar información' }).click();
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByRole('button', { name: 'Guardar cambios' })).toBeDisabled();
  await page.getByRole('button', { name: 'Guardar cambios' }).click({ force: true });
  expect(requests).toBe(1);
  resolver?.();
  await expect(page.getByText('Este número de teléfono ya está registrado.')).toBeVisible();
});

test('mantiene el perfil sin desborde en los tamaños objetivo', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await prepararPerfil(page);
    await page.getByRole('button', { name: 'Editar información' }).click();
    await expect(page.getByLabel('Teléfono')).toBeVisible();
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  }
});
