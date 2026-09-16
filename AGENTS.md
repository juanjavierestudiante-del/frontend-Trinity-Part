# AGENTS.md — Frontend (Trinity Party)

## Propósito

SPA pública + panel de administración para la tienda Trinity Party. Sirve catálogo, producto individual, carrito, checkout, historial y admin de productos/categorías/inventario/pedidos.

Revisado el 2026-09-07 contra código local, incluidos cambios sin commit.

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
│   ├── home/          # Secciones homepage (.jsx/.tsx)
│   ├── layout/        # Navbar, Footer, Container (.jsx)
│   ├── producto/      # Detalle producto (.jsx/.tsx)
│   ├── seo/           # Seo.tsx (title/meta/JSON-LD por ruta)
│   ├── tienda/        # Carrito (.jsx)
│   └── ui/            # Componentes reutilizables (Alert, Button, Card, Modal, Table, etc.)
├── data/              # products.js (LEGACY/NO USADO — dataset hardcodeado sin importar)
├── hooks/
│   ├── useCatalogo.ts           # Queries catálogo público
│   ├── useCarrito.ts            # Carrito, contador y mutaciones React Query
│   └── admin/                   # Hooks admin (CRUD productos, categorías, variantes, imágenes, inventario, pedidos)
├── pages/             # Páginas/rutas
├── services/
│   ├── axios.ts       # Cliente Axios con cookies/credentials
│   ├── axios.admin.ts # Reexport del mismo cliente para servicios admin
│   ├── admin/         # Servicios admin (auth, productos, categorías, variantes, imágenes, inventario, pedidos)
│   └── public/        # Servicios públicos (catálogo, carrito/pedidos, auth)
├── store/             # Zustand auth store (admin)
└── types/             # catalogo.types.ts
```

## Variables de entorno

| Variable | Uso | Descripción |
|----------|-----|-------------|
| `VITE_API_URL` | `services/axios.ts`, `services/axios.admin.ts` | URL base del backend API |

No existe `.env.example` para el frontend.

## Autenticación

### Sesión única (Zustand + cookie HttpOnly)
- `auth.store.ts` gestiona `user`, `isAuthenticated` e `isLoading` para todos los roles, solo en memoria.
- `App.tsx` consulta `/auth/me` antes de renderizar rutas y restaura la sesión desde cookie.
- `access_token` no se almacena ni se lee desde JavaScript; se limpia cualquier key legacy de localStorage al inicializar.
- Login y logout actualizan el único store; un 401 lo limpia sin redirección global.

### Instancias Axios
- `publicApi` y `adminApi` usan `withCredentials` y comparten la misma configuración de sesión.

## Rutas principales

| Ruta | Componente | Notas |
|------|-----------|-------|
| `/` | Home | |
| `/catalogo` | PaginaCatalogo | Catálogo público |
| `/categoria/:slug` | PaginaCatalogo | Filtrado por categoría |
| `/productos/:slug` | PaginaProducto | Detalle producto |
| `/carrito` | Carrito | |
| `/checkout` | Checkout | Contacto y creación de pedido |
| `/checkout/confirmacion` | Confirmacion | Resultado por estado de navegación |
| `/perfil` | Perfil | Cuenta e historial propio |
| `/login`, `/registro` | Login, Registro | Auth pública |
| `/nosotros`, `/contactos` | Nosotros, Contacto | Información |
| `/admin/unauthorized` | UnauthorizedPage | Fuera de ProtectedRoute |
| `/admin/pedidos` | PedidosPage | API exige ADMIN |
| `/admin/login` | LoginPage | Fuera de ProtectedRoute |
| `/admin/dashboard` | DashboardPage | Protegido |
| `/admin/productos` | ProductosPage | Protegido |
| `/admin/categorias` | CategoriasPage | Protegido |
| `/admin/inventario` | InventarioPage | Protegido |

**Rutas legacy** (sin AdminLayout) — **YA NO EXISTEN** en `App.tsx`. Todas las rutas admin
de gestión están dentro de `AdminLayout` + `ProtectedRoute`; login y unauthorized quedan fuera. `App.tsx` no pasa la prop roles al guard. El login admin tampoco filtra rol; los permisos se aplican en API.

## SEO y Accesibilidad (tienda pública)

- **SEO:** `index.html` (meta/OG/Twitter/canonical), `public/robots.txt`, `public/sitemap.xml`
  y el componente `components/seo/Seo.tsx` (title/meta description/JSON-LD por ruta).
  - `Product` en `PaginaProducto.tsx`, `ItemList` en `PaginaCatalogo.tsx`.
  - **Limitación:** SPA sin SSR → SEO dinámico no garantizado para crawlers estáticos
    (ver `../docs/seo.md`).
- **Accesibilidad (WCAG 2.2):** mejoras aplicadas en `Navbar`, `Footer`, `ProductoCard`,
  `BuscadorProductos`, `Carousel` (aria-live manual, roles de carrusel), `focus-visible`
  global y `prefers-reduced-motion` (ver `../docs/accessibility.md`).
- **Diseño:** estética "glass lilac"; tipografía Bricolage Grotesque (display) + DM Sans (body)
  (ver `../docs/ui-guide.md`).

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
3. Usar `auth.store.ts` para todos los flows que toquen la sesión activa.
4. Las rutas admin de gestión deben estar dentro de AdminLayout y ProtectedRoute; login y unauthorized son externas.
5. No inventar componentes o funcionalidades que no existan actualmente.

## Inconsistencias conocidas

- `data/products.js` es código muerto (dataset legacy, no se importa en ningún lugar).
- Código mixto JS/TS — la migración no está completa.
- `App.css` está vacío; estilos en Tailwind e `index.css`.
- Carrito y contador usan claves distintas; invalidar `[carrito, id]` no alcanza `[carrito, count, id]`. Pendiente de código.
- Este módulo tiene Git propio y está ignorado por el padre.
