import { Mail, Lock, LogIn, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Alert from "../../components/ui/Alert/Alert";

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
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white shadow-2xl rounded-card">
          <h1 className="mb-2 text-3xl font-black text-center text-gray-800 font-display">
            INICIA SESIÓN
          </h1>
          <p className="mb-8 text-center text-gray-500">
            Bienvenido de nuevo
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                icon={<Mail size={18} />}
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock size={18} />}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Verificación de Seguridad
              </label>
              <div className="p-4 border border-primary-light bg-primary-light/20 rounded-card">
                <p className="mb-3 text-sm text-gray-600">
                  Ingresa el código mostrado abajo
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 py-4 text-center bg-white border-2 border-dashed border-primary/30 rounded-lg">
                    <span className="text-3xl font-black tracking-[8px] text-primary italic select-none font-display">
                      {captcha}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => { setCaptcha(generarCaptcha()); setCaptchaInput(""); }}
                    className="p-4"
                    variant="primary"
                    size="md"
                  >
                    <RefreshCw size={22} />
                  </Button>
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Escribe el código"
                  className="w-full px-4 py-3 mt-4 transition-all border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <Alert type="danger">{error}</Alert>
            )}

            <Button type="submit" className="w-full" variant="primary" size="lg">
              <span className="inline-flex items-center gap-2"><LogIn size={20} />Iniciar Sesión</span>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="font-bold text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
