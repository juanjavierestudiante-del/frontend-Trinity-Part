import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from '../ui/Input/Input';
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
        <Search size={18} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 transition bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {texto && (
          <button
            onClick={limpiar}
            className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 transition-colors"
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
