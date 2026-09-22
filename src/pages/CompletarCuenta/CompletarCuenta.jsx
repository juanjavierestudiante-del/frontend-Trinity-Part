import { Phone } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthShell from '../../components/ui/AuthShell/AuthShell';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { useAuthStore } from '../../store/auth.store';

export default function CompletarCuenta() {
  const user = useAuthStore((s) => s.user); const completeProfile = useAuthStore((s) => s.completeProfile); const navigate = useNavigate();
  const [telefono, setTelefono] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (!user) return <Navigate to="/login" replace />; if (user.telefono) return <Navigate to="/perfil" replace />;
  const submit = async (e) => { e.preventDefault(); if (!/^(?:\+?591)?[67]\d{7}$/.test(telefono.replace(/[\s-]/g, ''))) { setError('Usa un número boliviano válido.'); return; } setLoading(true); setError(''); try { await completeProfile(telefono); navigate('/perfil'); } catch (err) { setError(err.response?.data?.error || 'No se pudo guardar el teléfono.'); } finally { setLoading(false); } };
  return <AuthShell badge="Cuenta incompleta" title="Completa tu cuenta" description="Para continuar necesitamos un número de contacto." highlights={["Tu número no se verificará todavía."]}><form onSubmit={submit} className="space-y-5" noValidate><Input label="Teléfono" name="telefono" id="complete-phone" type="tel" required autoComplete="tel" inputMode="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="71234567" icon={<Phone size={18} />} tone="glass" error={error} /><Button type="submit" loading={loading} disabled={loading} size="lg" className="w-full">Guardar y continuar</Button></form></AuthShell>;
}
