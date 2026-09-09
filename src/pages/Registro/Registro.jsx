import { Mail, Lock, User, UserPlus } from "lucide-react";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Alert from "../../components/ui/Alert/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/ui/AuthShell/AuthShell";

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
      return { texto: "Baja", colorTexto: "text-secondary", colorBarra: "bg-secondary", ancho: "33%" };
    }
    if (fuerza <= 4) {
      return { texto: "Media", colorTexto: "text-primary", colorBarra: "bg-primary", ancho: "66%" };
    }
    return { texto: "Alta", colorTexto: "text-primary-dark", colorBarra: "bg-gradient-to-r from-primary to-secondary", ancho: "100%" };
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
    <AuthShell
      badge="Nuevo cliente"
      title="Crea tu cuenta"
      description="Registrarte te permite guardar tus datos, seguir pedidos y volver a comprar sin repetir pasos."
      highlights={[
        "Guarda tu información de envío y acelera el checkout futuro.",
        "Sigue el estado de tus compras desde un perfil unificado.",
        "Recibe una experiencia visual coherente con el resto de la tienda.",
      ]}
      footer={
        <p className="text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre completo"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          icon={<User size={18} />}
          tone="glass"
        />

        <Input
          label="Correo electrónico"
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          tone="glass"
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
            tone="glass"
          />
          {formData.password && (
            <div className="mt-3 rounded-2xl border border-white/35 bg-white/15 p-4 shadow-sm backdrop-blur-md">
              <p className={`text-sm font-semibold ${seguridadPassword.colorTexto}`}>
                Seguridad: {seguridadPassword.texto}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/35">
                <div
                  className={`h-full transition-all duration-300 ${seguridadPassword.colorBarra}`}
                  style={{ width: seguridadPassword.ancho }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          icon={<Lock size={18} />}
          tone="glass"
        />

        {error && (
          <Alert
            type="danger"
            className="border-rose-200/70 bg-rose-50/80 text-rose-900 backdrop-blur-md"
          >
            {error}
          </Alert>
        )}

        <Button type="submit" variant="primary" size="lg" className="flex w-full items-center justify-center gap-2 shadow-brand-lg">
          <UserPlus size={20} />
          Registrarse
        </Button>
      </form>
    </AuthShell>
  );
}
