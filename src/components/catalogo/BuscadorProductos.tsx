import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Button from '../ui/Button/Button';

interface BuscadorProductosProps {
  onBuscar: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export default function BuscadorProductos({
  onBuscar,
  initialValue = '',
  placeholder = 'Buscar productos...',
}: BuscadorProductosProps) {
  const [texto, setTexto] = useState(initialValue);

  const buscarAhora = () => onBuscar(texto.trim());

  const limpiar = () => {
    setTexto('');
    onBuscar('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') buscarAhora();
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search size={18} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark/50" />
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Buscar productos"
          className="w-full rounded-md border border-white/30 bg-white/20 py-2 pl-10 pr-10 text-sm text-ink transition placeholder:text-primary-dark/40 backdrop-blur-md focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {texto && (
          <button
            type="button"
            onClick={limpiar}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary-dark/50 transition-colors hover:bg-primary-light/50 hover:text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <Button onClick={buscarAhora} variant="primary" size="md" className="min-h-10 shrink-0">
        Buscar
      </Button>
    </div>
  );
}
