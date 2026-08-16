import { Mail, Lock, User, UserPlus } from "lucide-react";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Alert from "../../components/ui/Alert/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const evaluarPassword = (password) => {
    let fuerza = 0;
    if (password.length >= 8) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[^A-Za-z0-9]/.test(password)) fuerza++;

    if (fuerza <= 2) {
      return { texto: "Débil", colorTexto: "text-red-600", colorBarra: "bg-red-500", ancho: "33%" };
    }
    if (fuerza <= 4) {
      return { texto: "Media", colorTexto: "text-yellow-600", colorBarra: "bg-yellow-500", ancho: "66%" };
    }
    return { texto: "Fuerte", colorTexto: "text-green-600", colorBarra: "bg-green-500", ancho: "100%" };
  };

  const seguridadPassword = evaluarPassword(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.nombre || !formData.correo || !formData.password || !formData.confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const res = await register({ name: formData.nombre, email: formData.correo, password: formData.password });
      if (res?.error) {
        setError(res.error);
        return;
      }
      navigate("/perfil");
    } catch (error) {
      if (error.response?.data?.errores) {
        setError(error.response.data.errores[0].msg);
        return;
      }
      if (error.response?.data?.error) {
        setError(error.response.data.error);
        return;
      }
      setError("Error al registrar usuario.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white shadow-2xl rounded-card">
          <h1 className="mb-2 text-3xl font-black text-center text-gray-800 font-display">
            REGÍSTRATE
          </h1>
          <p className="mb-8 text-center text-gray-500">Crea tu cuenta ahora</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nombre Completo"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              icon={<User size={18} />}
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="tu@email.com"
              icon={<Mail size={18} />}
            />

            <div>
              <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={<Lock size={18} />}
              />
              {formData.password && (
                <div className="mt-3">
                  <p className={`text-sm font-semibold ${seguridadPassword.colorTexto}`}>
                    Seguridad: {seguridadPassword.texto}
                  </p>
                  <div className="w-full h-2 mt-2 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className={`h-full transition-all duration-300 ${seguridadPassword.colorBarra}`}
                      style={{ width: seguridadPassword.ancho }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock size={18} />}
            />

            {error && (
              <Alert type="danger">{error}</Alert>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
              <UserPlus size={20} />
              Registrarse
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
