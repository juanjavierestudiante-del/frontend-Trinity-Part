import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import Alert from "../../components/ui/Alert/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import AuthShell from "../../components/ui/AuthShell/AuthShell";
import GoogleButton from "../../components/ui/GoogleButton/GoogleButton";

export default function Registro() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState({ password: false, confirm: false });

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
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "Ingresa tu nombre.";
    if (!formData.apellido.trim()) errors.apellido = "Ingresa tu apellido.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) errors.email = "Ingresa un correo válido.";
    if (!/^(?:\+?591)?[67]\d{7}$/.test(formData.telefono.replace(/[\s-]/g, ""))) errors.telefono = "Usa un número boliviano válido.";
    if (formData.password.length < 8) errors.password = "Usa al menos 8 caracteres.";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }
    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      requestAnimationFrame(() => document.getElementById(`register-${firstError}`)?.focus());
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await register({ nombre: formData.nombre, apellido: formData.apellido, email: formData.email, telefono: formData.telefono, password: formData.password });
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
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogle = async (credential) => { try { const user = await googleLogin(credential); navigate(user.telefono ? '/perfil' : '/completar-cuenta'); } catch { setError('No se pudo iniciar sesión con Google.'); } };

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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nombre"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          icon={<User size={18} />}
          tone="glass"
          id="register-nombre" required autoComplete="given-name" error={fieldErrors.nombre}
        />
        <Input label="Apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Tu apellido" icon={<User size={18} />} tone="glass" id="register-apellido" required autoComplete="family-name" error={fieldErrors.apellido} />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          tone="glass"
          id="register-email" required autoComplete="email" error={fieldErrors.email}
        />
        <Input label="Teléfono" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="71234567" icon={<Phone size={18} />} tone="glass" id="register-telefono" required autoComplete="tel" inputMode="tel" error={fieldErrors.telefono} />

        <div>
          <Input
            label="Contraseña"
            type={visible.password ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={<Lock size={18} />}
            tone="glass"
            id="register-password" required autoComplete="new-password" error={fieldErrors.password}
            endAdornment={<button type="button" onClick={() => setVisible((state) => ({ ...state, password: !state.password }))} aria-label={visible.password ? "Ocultar contraseña" : "Mostrar contraseña"} title={visible.password ? "Ocultar contraseña" : "Mostrar contraseña"} className="flex h-10 w-10 items-center justify-center rounded-md text-primary-dark hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{visible.password ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
          />
          {formData.password && (
            <div className="mt-3 rounded-2xl border border-white/35 bg-white/15 p-4 shadow-sm backdrop-blur-md">
              <p className={`text-sm font-semibold ${seguridadPassword.colorTexto}`}>
                Seguridad: {seguridadPassword.texto}. Mínimo 8 caracteres.
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
          type={visible.confirm ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          icon={<Lock size={18} />}
          tone="glass"
          id="register-confirmPassword" required autoComplete="new-password" error={fieldErrors.confirmPassword}
          endAdornment={<button type="button" onClick={() => setVisible((state) => ({ ...state, confirm: !state.confirm }))} aria-label={visible.confirm ? "Ocultar confirmación" : "Mostrar confirmación"} title={visible.confirm ? "Ocultar confirmación" : "Mostrar confirmación"} className="flex h-10 w-10 items-center justify-center rounded-md text-primary-dark hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{visible.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />

        {error && (
          <Alert
            type="danger"
            className="border-rose-200/70 bg-rose-50/80 text-rose-900 backdrop-blur-md"
          >
            {error}
          </Alert>
        )}

        <div className="space-y-3"><div className="flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-white/40 after:h-px after:flex-1 after:bg-white/40">o</div><GoogleButton onCredential={handleGoogle} disabled={isSubmitting} /></div>

        <Button type="submit" loading={isSubmitting} disabled={isSubmitting} variant="primary" size="lg" className="flex w-full items-center justify-center gap-2 shadow-brand-lg">
          <UserPlus size={20} />
          Registrarse
        </Button>
      </form>
    </AuthShell>
  );
}
