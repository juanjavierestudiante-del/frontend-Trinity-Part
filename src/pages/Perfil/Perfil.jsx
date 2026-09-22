import { Navigate, Link } from 'react-router-dom';
import { Check, LogOut, Mail, Pencil, Phone, ShieldCheck, User, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { obtenerPedidos } from '../../services/public/carrito.api';
import Alert from '../../components/ui/Alert/Alert';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';

const nombreCompleto = (user) => [user?.nombre, user?.apellido].filter(Boolean).join(' ').trim();

const iniciales = (nombre) => nombre
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((parte) => parte[0]?.toUpperCase())
  .join('') || 'U';

const valoresFormulario = (user) => ({
  nombre: user?.nombre || '',
  apellido: user?.apellido || '',
  telefono: user?.telefono || '',
});

function Dato({ icon, label, value, detail }) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <span className="mt-0.5 text-primary" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <dt className="text-sm font-medium text-muted">{label}</dt>
        <dd className="break-words font-semibold text-ink">{value}</dd>
        {detail ? <p className="mt-0.5 text-xs text-muted">{detail}</p> : null}
      </div>
    </div>
  );
}

export default function Perfil() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => valoresFormulario(user));
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fullName = useMemo(() => nombreCompleto(user), [user]);

  useEffect(() => {
    setForm(valoresFormulario(user));
    setAvatarError(false);
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    const load = async () => {
      setLoadingOrders(true);
      try {
        const data = await obtenerPedidos();
        if (active) setOrders(data || []);
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoadingOrders(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [user?.id_usuario]);

  if (!user) return <Navigate to="/login" replace />;

  const cancelarEdicion = () => {
    setForm(valoresFormulario(user));
    setErrors({});
    setSubmitError('');
    setIsEditing(false);
  };

  const validar = () => {
    const nextErrors = {};
    const telefonoLimpio = form.telefono.trim().replace(/[\s-]/g, '');
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length > 150) nextErrors.nombre = 'El nombre no puede superar 150 caracteres.';
    if (form.apellido.trim().length > 150) nextErrors.apellido = 'El apellido no puede superar 150 caracteres.';
    if (!telefonoLimpio) nextErrors.telefono = 'El teléfono es obligatorio.';
    else if (!/^(?:\+?591)?[67]\d{7}$/.test(telefonoLimpio)) nextErrors.telefono = 'Ingresá un teléfono boliviano válido.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const guardar = async (event) => {
    event.preventDefault();
    if (isSubmitting || !validar()) return;
    setIsSubmitting(true);
    setSubmitError('');
    setFeedback('');
    try {
      await updateProfile({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim() || null,
        telefono: form.telefono.trim(),
      });
      setIsEditing(false);
      setFeedback('Tus datos fueron actualizados.');
    } catch (error) {
      if (error?.response?.status === 409) {
        setErrors((current) => ({ ...current, telefono: 'Este número de teléfono ya está registrado.' }));
      } else {
        setSubmitError(error?.response?.data?.error || 'No se pudieron guardar los cambios. Intentá nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">Mi cuenta</p>
            <h1 className="mt-1 font-display text-4xl font-black text-ink sm:text-5xl">MI PERFIL</h1>
          </div>
          <p className="text-sm text-muted">Tus datos de contacto para futuras compras.</p>
        </div>

        {feedback ? <Alert type="success" className="mb-6" onDismiss={() => setFeedback('')}><Check aria-hidden="true" /> {feedback}</Alert> : null}

        <Card variant="elevated" padding="lg" className="mb-7 overflow-hidden sm:p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            {user.avatarUrl && !avatarError ? (
              <img src={user.avatarUrl} alt={`Avatar de ${fullName || 'usuario'}`} className="h-24 w-24 rounded-full border-4 border-white/70 object-cover shadow-brand" onError={() => setAvatarError(true)} />
            ) : (
              <div aria-label={`Iniciales de ${fullName || 'usuario'}`} className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70 bg-gradient-to-br from-primary to-secondary font-display text-3xl font-black text-white shadow-brand">{iniciales(fullName)}</div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="break-words font-display text-2xl font-bold text-ink sm:text-3xl">{fullName || 'Usuario'}</h2>
              <p className="mt-1 break-all text-muted">{user.email}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">{user.rol}</span>
                {user.emailVerificado ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Correo verificado</span> : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Correo no verificado</span>}
                {user.telefonoVerificado ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Teléfono verificado</span> : <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Teléfono no verificado</span>}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-7">
            <Card variant="default" padding="lg" className="sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Información personal</h2>
                  <p className="mt-1 text-sm text-muted">Actualizá los datos que usamos para contactarte.</p>
                </div>
                {!isEditing ? <Button variant="outline" onClick={() => { setFeedback(''); setIsEditing(true); }}><Pencil size={16} aria-hidden="true" />Editar información</Button> : null}
              </div>

              {submitError ? <Alert type="danger" className="mb-5">{submitError}</Alert> : null}

              {isEditing ? (
                <form className="space-y-5" onSubmit={guardar} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Nombre" name="nombre" value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} error={errors.nombre} autoComplete="given-name" maxLength={150} required />
                    <Input label="Apellido" name="apellido" value={form.apellido} onChange={(event) => setForm((current) => ({ ...current, apellido: event.target.value }))} error={errors.apellido} autoComplete="family-name" maxLength={150} />
                  </div>
                  <Input label="Teléfono" name="telefono" type="tel" value={form.telefono} onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))} error={errors.telefono} autoComplete="tel" inputMode="tel" maxLength={20} required />
                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                    <Button type="button" variant="ghost" onClick={cancelarEdicion} disabled={isSubmitting}><X size={17} aria-hidden="true" />Cancelar</Button>
                    <Button type="submit" loading={isSubmitting}><Check size={17} aria-hidden="true" />Guardar cambios</Button>
                  </div>
                </form>
              ) : (
                <dl className="divide-y divide-white/50">
                  <Dato icon={<User size={20} />} label="Nombre" value={user.nombre} />
                  <Dato icon={<User size={20} />} label="Apellido" value={user.apellido || 'No registrado'} />
                  <Dato icon={<Phone size={20} />} label="Teléfono" value={user.telefono || 'No registrado'} />
                  <Dato icon={<Mail size={20} />} label="Correo electrónico" value={user.email} detail="No se puede cambiar todavía." />
                </dl>
              )}
            </Card>

            <Card variant="default" padding="lg" className="sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink">Mis compras</h2>
              <div className="py-5">
                {loadingOrders ? <p className="text-center text-muted">Cargando compras...</p> : orders.length === 0 ? <div className="py-7 text-center text-muted"><p className="mb-4">No hay compras realizadas</p><Link to="/catalogo" className="font-bold text-primary hover:underline">Ir a la tienda</Link></div> : <div className="space-y-4">{orders.map((pedido) => <Card key={pedido.idPedido} variant="subtle" padding="md"><div className="flex justify-between gap-4"><div><p className="font-bold text-ink">Pedido #{pedido.idPedido}</p><p className="text-sm text-muted">Estado: {pedido.estado}</p></div><div className="text-right"><p className="font-bold text-ink">Bs. {Number(pedido.total).toFixed(2)}</p><p className="text-sm text-muted">{new Date(pedido.fechaCreacion).toLocaleDateString('es-BO')}</p></div></div>{pedido.items?.length > 0 ? <div className="mt-2 space-y-1 border-t border-white/50 pt-2">{pedido.items.map((detalle) => <div key={detalle.idDetalle} className="flex justify-between gap-3 text-sm"><span className="text-muted">{detalle.variante?.producto?.nombre || detalle.variante?.sku} x{detalle.cantidad}</span><span className="font-medium text-ink">Bs. {(Number(detalle.precioUnitario) * detalle.cantidad).toFixed(2)}</span></div>)}</div> : null}</Card>)}</div>}
              </div>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card variant="subtle" padding="lg"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-primary" size={22} aria-hidden="true" /><div><h2 className="font-display text-lg font-bold text-ink">Estado de cuenta</h2><p className="mt-1 text-sm text-muted">Tu correo no se puede editar hasta que exista un flujo de verificación.</p></div></div></Card>
            <Button onClick={() => void logout()} variant="danger" className="flex w-full justify-center"><LogOut size={19} aria-hidden="true" />Cerrar sesión</Button>
          </aside>
        </div>
      </div>
    </main>
  );
}
