import { useState } from 'react'
import Sidebar from '../ui/Sidebar/Sidebar'
import SidebarItem from '../ui/Sidebar/SidebarItem'
import SidebarItems from '../ui/Sidebar/SidebarItems'
import SidebarItemGroup from '../ui/Sidebar/SidebarItemGroup'
import SidebarLogo from '../ui/Sidebar/SidebarLogo'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  HiChartPie,
  HiShoppingBag,
  HiTag,
  HiCube,
  HiLogout,
  HiMenu,
} from 'react-icons/hi'
import { useAuthStore } from '../../store/auth.store'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, logout } = useAuthStore()
  const { clearPublicSession } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    clearPublicSession()
    navigate('/admin/login')
  }

  const handleNav = (path: string) => {
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SidebarLogo
          href="/admin/dashboard"
          img="https://res.cloudinary.com/dslh6rwix/image/upload/q_auto/f_auto/v1780528934/logo_eolnrp.png"
          imgAlt="Trinity Party"
        >
          Trinity Party
        </SidebarLogo>

        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              icon={HiChartPie}
              active={isActive('/admin/dashboard')}
              onClick={() => handleNav('/admin/dashboard')}
              className="cursor-pointer"
            >
              Dashboard
            </SidebarItem>

            <SidebarItem
              icon={HiShoppingBag}
              active={isActive('/admin/productos')}
              onClick={() => handleNav('/admin/productos')}
              className="cursor-pointer"
            >
              Productos
            </SidebarItem>

            <SidebarItem
              icon={HiTag}
              active={isActive('/admin/categorias')}
              onClick={() => handleNav('/admin/categorias')}
              className="cursor-pointer"
            >
              Categorías
            </SidebarItem>

            <SidebarItem
              icon={HiCube}
              active={isActive('/admin/inventario')}
              onClick={() => handleNav('/admin/inventario')}
              className="cursor-pointer"
            >
              Inventario
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <div className="px-3 py-2 text-sm text-gray-400">
              <p className="font-medium text-gray-200">{usuario?.nombre}</p>
              <p className="text-xs">{usuario?.rol}</p>
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
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-200">Trinity Party</span>
        </div>

        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
