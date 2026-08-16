import { Navigate, Link } from "react-router-dom";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import * as api from "../../services/api";
import Button from "../../components/ui/Button/Button";
import Card from "../../components/ui/Card/Card";

export default function Perfil() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.obtenerPedidosPorUsuario(user.id);
        setOrders(data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl px-4 py-12 mx-auto">
        <h1 className="mb-8 text-4xl font-black text-gray-800 font-display">MI PERFIL</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Card hover={false} className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 font-display">
                Información Personal
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <User className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-bold text-gray-800">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b">
                  <Mail className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-bold text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b">
                  <Phone className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-bold text-gray-800">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-bold text-gray-800">{user.address}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" variant="outline">
                Editar Información
              </Button>
            </Card>

            <Card hover={false} className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 font-display">
                Mis Compras
              </h2>
              <div className="py-4">
                {loading ? (
                  <p className="text-center text-gray-600">Cargando compras...</p>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">
                    <p className="mb-4">No hay compras realizadas</p>
                    <Link to="/catalogo" className="font-bold text-primary hover:underline">
                      Ir a la tienda
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((p) => (
                      <Card key={p.id_pedido || p.id} className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold">Pedido #{p.id_pedido || p.id}</p>
                            <p className="text-sm text-gray-500">Estado: {p.estado}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{p.total ? `$${p.total}` : ""}</p>
                            <p className="text-sm text-gray-500">{p.fecha_creacion}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card hover={false} className="p-6">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary">
                  <User className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-display">{user.name}</h3>
                <p className="text-sm text-gray-600">
                  Miembro desde {user.joinDate}
                </p>
              </div>

              <Button onClick={logout} variant="danger" className="flex items-center justify-center w-full gap-2">
                <LogOut size={20} />
                Cerrar Sesión
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
