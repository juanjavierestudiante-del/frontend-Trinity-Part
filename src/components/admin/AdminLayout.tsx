import { useEffect, useState } from 'react'
import Sidebar from '../ui/Sidebar/Sidebar'
import SidebarItem from '../ui/Sidebar/SidebarItem'
import SidebarItems from '../ui/Sidebar/SidebarItems'
import SidebarItemGroup from '../ui/Sidebar/SidebarItemGroup'
import SidebarLogo from '../ui/Sidebar/SidebarLogo'
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom'
import {
  HiChartPie,
  HiShoppingBag,
  HiTag,
  HiCube,
  HiClipboardList,
  HiTruck,
  HiLogout,
  HiMenu,
} from 'react-icons/hi'
import { useAuthStore } from '../../store/auth.store'

interface Props {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string) => location.pathname.startsWith(path)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  const handleLogout = () => {
    void logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-gray-900">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-gray-800 focus:px-4 focus:py-3 focus:text-white focus:shadow-lg">Saltar al contenido principal</a>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SidebarLogo
          as={Link}
          to="/admin/dashboard"
          img="https://res.cloudinary.com/dslh6rwix/image/upload/q_auto/f_auto/v1780528934/logo_eolnrp.png"
          imgAlt="Trinity Party"
        >
          Trinity Party
        </SidebarLogo>

        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              as={Link}
              to="/admin/dashboard"
              icon={HiChartPie}
              active={isActive('/admin/dashboard')}
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </SidebarItem>

            <SidebarItem
              as={Link}
              to="/admin/productos"
              icon={HiShoppingBag}
              active={isActive('/admin/productos')}
              onClick={() => setSidebarOpen(false)}
            >
              Productos
            </SidebarItem>

            <SidebarItem
              as={Link}
              to="/admin/categorias"
              icon={HiTag}
              active={isActive('/admin/categorias')}
              onClick={() => setSidebarOpen(false)}
            >
              Categorías
            </SidebarItem>

            <SidebarItem
              as={Link}
              to="/admin/inventario"
              icon={HiCube}
              active={isActive('/admin/inventario')}
              onClick={() => setSidebarOpen(false)}
            >
              Inventario
            </SidebarItem>

            <SidebarItem
              as={Link}
              to="/admin/pedidos"
              icon={HiClipboardList}
              active={isActive('/admin/pedidos')}
              onClick={() => setSidebarOpen(false)}
            >
              Pedidos
            </SidebarItem>

            <SidebarItem
              as={Link}
              to="/admin/entregas"
              icon={HiTruck}
              active={isActive('/admin/entregas')}
              onClick={() => setSidebarOpen(false)}
            >
              Entregas
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <div className="px-3 py-2 text-sm text-gray-400">
              <p className="font-medium text-gray-200">{user?.nombre}</p>
              <p className="text-xs">{user?.rol}</p>
            </div>
            <SidebarItem
              icon={HiLogout}
              onClick={handleLogout}
              className="text-red-400 cursor-pointer hover:text-red-300"
            >
              Cerrar sesión
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <div className="flex min-w-0 items-center gap-3 border-b border-gray-700 px-3 py-2.5 sm:px-4 lg:hidden">
          <button
            type="button"
            aria-label="Abrir menú de administración"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <span className="min-w-0 truncate text-sm font-medium text-gray-200">Administración</span>
        </div>

        <main id="admin-main" className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6" tabIndex={-1}>
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
