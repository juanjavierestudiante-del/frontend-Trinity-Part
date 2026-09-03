# AGENTS.md — Frontend (Trinity Party)

## Propósito

SPA pública + panel de administración para la tienda Trinity Party. Sirve catálogo, producto individual, carrito y admin de productos/categorías/inventario.

## Stack

- React 19 + TypeScript (migración en progreso: componentes públicos en `.jsx`, admin en `.tsx`)
- Vite 8 (config minimal, sin proxy ni path aliases)
- Tailwind CSS 3 (colores custom: primary purple, secondary pink)
- TanStack React Query 5 (retry: 1, refetchOnWindowFocus: false)
- Zustand (solo auth admin)
- React Router DOM v7 (BrowserRouter)
- Axios (dos instancias separadas)

## Estructura

```
src/
├── components/
│   ├── admin/         # Componentes panel admin (.tsx)
│   ├── catalogo/      # Catálogo público (.tsx)
│   ├── home/          # Secciones homepage (.jsx)
│   ├── layout/        # Navbar, Footer, Container (.jsx)
│   ├── producto/      # Detalle producto (.jsx/.tsx)
│   ├── seo/           # Seo.tsx (title/meta/JSON-LD por ruta)
│   ├── tienda/        # Carrito (.jsx)
│   └── ui/            # Componentes reutilizables (Alert, Button, Card, Modal, Table, etc.)
├── context/           # AuthContext (usuarios públicos)
├── data/              # products.js (LEGACY/NO USADO — dataset hardcodeado sin importar)
├── hooks/
│   ├── useCatalogo.ts           # Queries catálogo público
│   └── admin/                   # Hooks admin (CRUD productos, categorías, variantes, imágenes, inventario)
├── pages/             # Páginas/rutas
├── services/
│   ├── axios.ts       # Instancia pública (VITE_API_URL + token de la sesión pública)
│   ├── axios.admin.ts # Instancia admin (VITE_API_URL + Bearer token admin)
│   ├── auth.sync.ts   # Sync bidireccional de sesión público <-> admin (localStorage)
│   ├── admin/         # Servicios admin (auth, productos, categorías, variantes, imágenes, inventario)
│   └── public/        # Servicios públicos (catálogo, carrito, auth)
├── store/             # Zustand auth store (admin)
└── types/             # catalogo.types.ts
```

## Variables de entorno

| Variable | Uso | Descripción |
|----------|-----|-------------|
| `VITE_API_URL` | `services/axios.ts`, `services/axios.admin.ts` | URL base del backend API |

No existe `.env.example` para el frontend.

## Autenticación

La sesión es **única y bidireccional** (Opción A): el mismo usuario se persiste tanto en el storage público como en el admin, sin importar por qué login entró. Toda la lógica vive en `services/auth.sync.ts`.

### Usuarios públicos (AuthContext)
- `AuthContext.jsx` usa `loginPublico`/`registrarUsuario` (`services/public/auth.api.ts`).
- Persiste en localStorage key: `party-store-current-user` (shape `{ id, name, email, role, token }`, camelCase).
- Al login/register llama `syncPublicAuth` (escribe storage público) + `syncAdminAuth` (escribe storage admin si `rol === 'ADMIN'`).
- Expone `applyPublicSession` / `clearPublicSession` para que el panel admin sincronice la sesión pública (login/logout admin → web).

### Admin (Zustand + Axios interceptor)
- `auth.store.ts` gestiona estado (usuario, token, isAuthenticated).
- Persiste en localStorage: `admin_token`, `admin_usuario`.
- `axios.admin.ts` inyecta Bearer token automáticamente.
- En 401 (excepto login): limpia storage y redirige a `/admin/login`.
- `LoginPage` (admin) llama `applyPublicSession` tras `setAuth`; `AdminLayout.handleLogout` llama `clearPublicSession` para cerrar también la sesión pública.

### Instancias Axios
- `publicApi` (`axios.ts`) inyecta el token de `party-store-current-user` si existe (permite carrito/pedidos del storefront sin instancia aparte).
- `adminApi` (`axios.admin.ts`) inyecta el token admin.
- No hay más instancias (se eliminó `axios.cart.ts`).

## Rutas principales

| Ruta | Componente | Notas |
|------|-----------|-------|
| `/` | Home | |
| `/catalogo` | PaginaCatalogo | Catálogo público |
| `/categoria/:slug` | PaginaCatalogo | Filtrado por categoría |
| `/productos/:slug` | PaginaProducto | Detalle producto |
| `/carrito` | Carrito | |
| `/admin/login` | LoginPage | Fuera de ProtectedRoute |
| `/admin/dashboard` | DashboardPage | Protegido |
| `/admin/productos` | ProductosPage | Protegido |
| `/admin/categorias` | CategoriasPage | Protegido |
| `/admin/inventario` | InventarioPage | Protegido |

**Rutas legacy** (sin AdminLayout) — **YA NO EXISTEN** en `App.tsx`. Todas las rutas admin
están dentro de `AdminLayout` + `ProtectedRoute` (ver `App.tsx`).

## SEO y Accesibilidad (tienda pública)

- **SEO:** `index.html` (meta/OG/Twitter/canonical), `public/robots.txt`, `public/sitemap.xml`
  y el componente `components/seo/Seo.tsx` (title/meta description/JSON-LD por ruta).
  - `Product` en `PaginaProducto.tsx`, `ItemList` en `PaginaCatalogo.tsx`.
  - **Limitación:** SPA sin SSR → SEO dinámico no garantizado para crawlers estáticos
    (ver `docs/seo.md`).
- **Accesibilidad (WCAG 2.2):** mejoras aplicadas en `Navbar`, `Footer`, `ProductoCard`,
  `BuscadorProductos`, `Carousel` (aria-live manual, roles de carrusel), `focus-visible`
  global y `prefers-reduced-motion` (ver `docs/accessibility.md`).
- **Diseño:** estética "glass lilac"; tipografía Bricolage Grotesque (display) + DM Sans (body)
  (ver `docs/ui-guide.md`).

## Convenciones

- **Components:** Un componente por archivo. Admin en `.tsx`, públicos pueden ser `.jsx`.
- **Services:** Una instancia Axios por contexto (`publicApi`, `adminApi`). No importar axios directamente.
- **Hooks:** Separados por dominio (`useCatalogo.ts`, `admin/useProductosAdmin.ts`, etc.).
- **Query keys:** Prefijo `['admin', ...]` para admin, sin prefijo para público.
- **Mutations:** Siempre invalidar queries relacionadas con `invalidateQueries()` en `onSuccess`.
- **Tailwind:** Usar clases del theme custom (colors: primary, secondary, background, surface, ink, muted).

## Comandos

```bash
npm run dev          # Desarrollo (puerto 5173)
npm run build        # tsc --noEmit && vite build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Restricciones

1. No importar axios directamente — usar `publicApi` o `adminApi` de `services/` (o crear instancias en `axios.ts`/`axios.admin.ts`).
2. No agregar comentarios al código a menos que se pida explícitamente.
3. Usar la sincronización de sesión vía `services/auth.sync.ts` para flows de login/logout que toquen la sesión activa.
4. Las rutas admin deben estar dentro del `<Route>` de `AdminLayout` y ser envueltas por `ProtectedRoute`.
5. No inventar componentes o funcionalidades que no existan actualmente.

## Inconsistencias conocidas

- `data/products.js` es código muerto (dataset legacy, no se importa en ningún lugar).
- Código mixto JS/TS — la migración no está completa.
- `App.css` está vacío — todo el styling es vía Tailwind.
