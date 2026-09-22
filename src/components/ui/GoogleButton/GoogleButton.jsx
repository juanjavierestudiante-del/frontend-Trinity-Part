import { useEffect, useRef, useState } from 'react';

export default function GoogleButton({ onCredential, disabled = false }) {
  const container = useRef(null);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const script = document.createElement('script'); script.src = 'https://accounts.google.com/gsi/client'; script.async = true;
    script.onload = () => { window.google.accounts.id.initialize({ client_id: clientId, callback: ({ credential }) => onCredential(credential) }); window.google.accounts.id.renderButton(container.current, { theme: 'outline', size: 'large', text: 'continue_with', width: container.current.offsetWidth }); setAvailable(true); };
    document.head.appendChild(script); return () => script.remove();
  }, [onCredential]);
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;
  return <div aria-label="Continuar con Google" className={disabled ? 'pointer-events-none opacity-50' : ''}><div ref={container} className="min-h-11 w-full" />{!available && <span className="sr-only">Cargando Google</span>}</div>;
}
