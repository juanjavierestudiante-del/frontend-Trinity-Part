import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Button from '../ui/Button/Button';

interface BuscadorProductosProps {
  onBuscar: (query: string) => void;
  placeholder?: string;
}

export default function BuscadorProductos({ onBuscar, placeholder = 'Buscar productos...' }: BuscadorProductosProps) {
  const [texto, setTexto] = useState('');

  const buscarAhora = () => {
    onBuscar(texto.trim());
  };

  const limpiar = () => {
    setTexto('');
    onBuscar('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarAhora();
    }
  };

  return (
    <div className="flex items-center w-full gap-2">
      <div className="relative flex-1">
        <Search size={18} className="absolute text-primary-dark/50 -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-sm text-ink placeholder:text-primary-dark/40 transition bg-white/20 border border-white/30 backdrop-blur-md rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-white/50"
        />
        {texto && (
          <button
            onClick={limpiar}
            className="absolute text-primary-dark/50 -translate-y-1/2 right-3 top-1/2 hover:text-primary-dark transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Button onClick={buscarAhora} variant="primary" size="md">
        Buscar
      </Button>
    </div>
  );
}
