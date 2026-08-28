import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HiMail, HiLockClosed, HiInformationCircle } from "react-icons/hi"
import { loginAdmin } from "../../services/admin/auth.api"
import { useAuthStore } from "../../store/auth.store"
import { useAuth } from "../../context/AuthContext"
import Button from "../../components/ui/Button/Button"
import Card from "../../components/ui/Card/Card"
import Input from "../../components/ui/Input/Input"
import Label from "../../components/ui/Label/Label"
import Alert from "../../components/ui/Alert/Alert"
import Loader from "../../components/ui/Loader/Loader"

export default function LoginPage() {
  const logo = "https://res.cloudinary.com/dslh6rwix/image/upload/q_auto/f_auto/v1780528934/logo_eolnrp.png"
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { applyPublicSession } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { usuario, token } = await loginAdmin(email, password)
      setAuth(usuario, token)
      applyPublicSession(usuario, token)
      navigate("/admin/dashboard")
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string } } })?.response?.data
      setError(data?.error || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-ink py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink" />

      <div className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/40 blur-[100px]" />
      <div className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full bg-primary-dark/40 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] rounded-full bg-secondary/10 blur-[90px]" />

      <Card
        className="relative z-10 w-full max-w-md rounded-card border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(134,59,255,0.45)]"
        hover={false}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-card bg-primary blur-xl opacity-40" />
            <div className="relative flex items-center justify-center w-32 h-32 overflow-hidden border shadow-inner rounded-card bg-white/10 border-white/20">
              <img
                src={logo}
                alt="Logo de Trinity Party"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Trinity Party
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary-light/80">
            Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label htmlFor="email" dark>Email</Label>
            <Input
              id="email"
              type="email"
              icon={<HiMail className="w-4 h-4 text-primary-light" />}
              placeholder="admin@trinityparty.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              dark
              className="border-white/15 bg-white/[0.07] text-white placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div>
            <Label htmlFor="password" dark>Contraseña</Label>
            <Input
              id="password"
              type="password"
              icon={<HiLockClosed className="w-4 h-4 text-primary-light" />}
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              dark
              className="border-white/15 bg-white/[0.07] text-white placeholder:text-white/30 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>

          {error && (
            <Alert type="danger" icon={<HiInformationCircle className="w-5 h-5" />}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 border-0 bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-[0_8px_20px_-6px_rgba(134,59,255,0.6)] transition-all hover:shadow-[0_8px_25px_-4px_rgba(134,59,255,0.8)] hover:brightness-110 disabled:opacity-60 disabled:hover:brightness-100"
          >
            {loading && <Loader size="xs" showText={false} className="mr-2" />}
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
