import { Mail, Lock, LogIn, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Alert from "../../components/ui/Alert/Alert";
import AuthShell from "../../components/ui/AuthShell/AuthShell";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generarCaptcha = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaGenerado = "";
    for (let i = 0; i < 6; i++) {
      captchaGenerado += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return captchaGenerado;
  };

  const [captcha, setCaptcha] = useState(() => generarCaptcha());

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa email y contraseña.");
      return;
    }

    (async () => {
      const success = await login(email, password);
      if (success) {
        navigate("/perfil");
        return;
      }
      setError("Email o contraseña incorrectos.");
      setCaptcha(generarCaptcha());
      setCaptchaInput("");
    })();
  };

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
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          tone="glass"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock size={18} />}
          tone="glass"
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            Verificación de seguridad
          </label>
          <div className="rounded-2xl border border-white/35 bg-white/15 p-4 shadow-sm backdrop-blur-md">
            <p className="mb-3 text-sm text-muted">
              Ingresa el código mostrado abajo.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-2xl border border-dashed border-primary/25 bg-white/20 px-4 py-5 text-center shadow-inner">
                <span className="select-none font-display text-3xl font-black tracking-[0.35em] text-primary-dark">
                  {captcha}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setCaptcha(generarCaptcha());
                  setCaptchaInput("");
                }}
                variant="glass"
                size="icon"
                icon={RefreshCw}
                className="self-center sm:self-auto"
                aria-label="Generar nuevo código"
                title="Generar nuevo código"
              />
            </div>
            <Input
              className="mt-4"
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Escribe el código"
              tone="glass"
            />
          </div>
        </div>

        {error && (
          <Alert
            type="danger"
            className="border-rose-200/70 bg-rose-50/80 text-rose-900 backdrop-blur-md"
          >
            {error}
          </Alert>
        )}

        <Button type="submit" className="w-full shadow-brand-lg" variant="primary" size="lg">
          <span className="inline-flex items-center gap-2">
            <LogIn size={20} />
            Iniciar sesión
          </span>
        </Button>
      </form>
    </AuthShell>
  );
}
