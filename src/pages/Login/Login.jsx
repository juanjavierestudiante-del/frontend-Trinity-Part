import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Alert from "../../components/ui/Alert/Alert";
import AuthShell from "../../components/ui/AuthShell/AuthShell";
import GoogleButton from "../../components/ui/GoogleButton/GoogleButton";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa email y contraseña.");
      return;
    }

    setLoading(true);
    (async () => {
      const success = await login(email, password);
      if (success) {
        navigate("/perfil");
        return;
      }
      setError("Email o contraseña incorrectos.");
    })().catch(() => setError("Email o contraseña incorrectos.")).finally(() => setLoading(false));
  };
  const handleGoogle = async (credential) => { try { const user = await googleLogin(credential); navigate(user.telefono ? '/perfil' : '/completar-cuenta'); } catch { setError('No se pudo iniciar sesión con Google.'); } };

  return (
    <AuthShell
      badge="Acceso de clientes"
      title="Inicia sesión"
      description="Entra a tu cuenta para revisar pedidos, retomar carritos y comprar más rápido."
      highlights={[
        "Consulta tus pedidos y direcciones guardadas sin perder el contexto.",
        "Recupera el carrito y continúa la compra en una superficie glass consistente.",
        "Aprovecha promociones y novedades desde tu cuenta personal.",
      ]}
      footer={
        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary hover:text-primary-dark hover:underline">
            Regístrate aquí
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          tone="glass"
          id="login-email"
          name="email"
          required
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={18} />}
          tone="glass"
          id="login-password"
          name="password"
          required
          autoComplete="current-password"
          endAdornment={<button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="flex h-10 w-10 items-center justify-center rounded-md text-primary-dark hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
        />

        {error && (
          <Alert
            type="danger"
            className="border-rose-200/70 bg-rose-50/80 text-rose-900 backdrop-blur-md"
          >
            {error}
          </Alert>
        )}

        <div className="space-y-3"><div className="flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-white/40 after:h-px after:flex-1 after:bg-white/40">o</div><GoogleButton onCredential={handleGoogle} disabled={loading} /></div>

        <Button type="submit" loading={loading} disabled={loading} className="w-full shadow-brand-lg" variant="primary" size="lg">
          <span className="inline-flex items-center gap-2">
            <LogIn size={20} />
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </span>
        </Button>
      </form>
    </AuthShell>
  );
}
