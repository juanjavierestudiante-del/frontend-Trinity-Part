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
} from 'react-icons/hi'
import { useAuthStore } from '../../store/auth.store'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, logout } = useAuthStore()

  const isActive = (path: string) => location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar className="sticky top-0 h-screen">
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
              onClick={() => navigate('/admin/dashboard')}
              className="cursor-pointer"
            >
              Dashboard
            </SidebarItem>

            <SidebarItem
              icon={HiShoppingBag}
              active={isActive('/admin/productos')}
              onClick={() => navigate('/admin/productos')}
              className="cursor-pointer"
            >
              Productos
            </SidebarItem>

            <SidebarItem
              icon={HiTag}
              active={isActive('/admin/categorias')}
              onClick={() => navigate('/admin/categorias')}
              className="cursor-pointer"
            >
              Categorías
            </SidebarItem>

            <SidebarItem
              icon={HiCube}
              active={isActive('/admin/inventario')}
              onClick={() => navigate('/admin/inventario')}
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

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
