import { Trash2, Plus, Minus } from "lucide-react";
import Button from "../ui/Button/Button";

export default function CartItem({ item, onRemove, onQuantityChange, pending = false }) {
  return (
    <tr className="transition-colors border-b hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover w-16 h-16 rounded-md"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">Bs. {Number(item.price).toFixed(2)} por presentación</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => onQuantityChange(item.id, item.quantity - 1)} disabled={pending} variant="ghost" size="icon-sm" aria-label="Disminuir cantidad" title="Disminuir cantidad">
            <Minus size={16} />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button onClick={() => onQuantityChange(item.id, item.quantity + 1)} disabled={pending} variant="ghost" size="icon-sm" aria-label="Aumentar cantidad" title="Aumentar cantidad">
            <Plus size={16} />
          </Button>
        </div>
      </td>
      <td className="px-6 py-4 font-bold text-right text-primary">
        Bs. {Number(item.subtotal).toFixed(2)}
      </td>
      <td className="px-6 py-4 text-center">
        <Button onClick={() => onRemove(item.id)} disabled={pending} variant="ghost" size="icon" className="text-red-500" aria-label={`Eliminar ${item.name}`} title="Eliminar artículo">
          <Trash2 size={20} />
        </Button>
      </td>
    </tr>
  );
}
