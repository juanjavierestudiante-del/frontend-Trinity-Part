# Trinity Party — Frontend

Tienda pública y panel administrativo en React 19, React Router DOM 7, Vite 8 y Tailwind CSS 3. Mezcla TypeScript/TSX con JavaScript/JSX; React Query 5 para consultas, Context para auth pública y Zustand para auth admin.

Revisión: 2026-09-07, código local incluidos cambios sin commit.

## Desarrollo

Desde `frontend/`, instalar dependencias con `npm install` y configurar `VITE_API_URL` con la base del backend incluyendo `/api` (ejemplo local: `http://localhost:4000/api`). No existe `.env.example` ni proxy Vite configurado.

```bash
npm run dev         # Vite, puerto predeterminado 5173
npm run type-check  # tsc --noEmit
npm run lint        # eslint .
npm run build       # tsc --noEmit && vite build
npm run preview     # vista local del build
```

## Funcionalidades

- Catálogo paginado, filtro por categoría, detalle con variantes e imágenes.
- Login/registro, carrito autenticado, checkout con contacto, confirmación e historial propio.
- Admin de productos, categorías, variantes, imágenes, inventario y pedidos.
- Axios `publicApi`/`adminApi`; hooks de carrito en `src/hooks/useCarrito.ts`.
- UI pública glass lilac, Bricolage Grotesque y DM Sans. Card admin usa variante solid donde se indica.

Las rutas de gestión admin usan AdminLayout y ProtectedRoute; este acepta roles pero App no los configura. La API aplica permisos. Los helpers de auth sincronizan persistencia parcialmente; no garantizan actualización reactiva completa de Zustand y Context. El contador tiene una discrepancia de invalidación documentada en [carrito y pedidos](../docs/carrito-pedidos.md).

## Build y documentación

Docker compila con Node 22 Alpine y sirve mediante Nginx con fallback SPA. VITE_API_URL se incorpora en build, por lo que cambiarla requiere reconstrucción. No hay SSR/SSG configurado.

- [Instrucciones del módulo](AGENTS.md)
- [Arquitectura](../docs/architecture.md)
- [API](../docs/api.md)
- [UI](../docs/ui-guide.md)
- [SEO](../docs/seo.md)
- [Accesibilidad](../docs/accessibility.md)
- [Deployment](../docs/deployment.md)

Este directorio tiene repositorio Git propio y está ignorado por el repositorio padre.
