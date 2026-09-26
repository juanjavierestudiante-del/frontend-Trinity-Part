import { Trash2, Plus, Minus } from "lucide-react";
import Button from "../ui/Button/Button";

function ImagenProducto({ item, className }) {
  if (!item.image) return <div aria-hidden="true" className={`shrink-0 rounded-md bg-primary-light/35 ${className}`} />;
  return <img src={item.image} alt={item.name} className={`shrink-0 rounded-md object-cover ${className}`} loading="lazy" />;
}

function ControlesCantidad({ item, onQuantityChange, pending, mobile = false }) {
  return (
    <div className="flex items-center justify-start gap-1.5">
      <Button onClick={() => onQuantityChange(item.id, -1)} disabled={pending} variant="ghost" size="icon-sm" className={mobile ? "min-h-11 min-w-11 max-[374px]:min-h-10 max-[374px]:min-w-10 sm:min-h-9 sm:min-w-9" : ""} aria-label="Disminuir cantidad" title="Disminuir cantidad"><Minus size={16} aria-hidden="true" /></Button>
      <output aria-label={`Cantidad de ${item.name}`} className="w-8 text-center font-semibold text-ink">{item.quantity}</output>
      <Button onClick={() => onQuantityChange(item.id, 1)} disabled={pending} variant="ghost" size="icon-sm" className={mobile ? "min-h-11 min-w-11 max-[374px]:min-h-10 max-[374px]:min-w-10 sm:min-h-9 sm:min-w-9" : ""} aria-label="Aumentar cantidad" title="Aumentar cantidad"><Plus size={16} aria-hidden="true" /></Button>
    </div>
  );
}

export default function CartItem({ item, onRemove, onQuantityChange, pending = false, mobile = false }) {
  if (mobile) {
    return (
      <article className="rounded-card border border-white/45 bg-white/30 p-3 shadow-sm backdrop-blur-lg">
        <div className="flex min-w-0 gap-3">
          <ImagenProducto item={item} className="h-20 w-20" />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0"><h2 className="line-clamp-2 break-words font-display text-base font-bold leading-tight text-ink">{item.name}</h2><p className="mt-1 text-xs text-muted">Bs. {Number(item.price).toFixed(2)} por presentación</p></div>
              <Button onClick={() => onRemove(item.id)} disabled={pending} variant="ghost" size="icon" className="min-h-11 min-w-11 shrink-0 text-red-600 hover:bg-red-50" aria-label={`Eliminar ${item.name}`} title="Eliminar artículo"><Trash2 size={19} aria-hidden="true" /></Button>
            </div>
            <div className="mt-3 flex flex-col items-stretch gap-2 border-t border-primary/10 pt-2.5 min-[375px]:flex-row min-[375px]:items-center min-[375px]:justify-between min-[375px]:gap-3">
              <ControlesCantidad item={item} onQuantityChange={onQuantityChange} pending={pending} mobile />
              <div className="min-w-0 text-left min-[375px]:text-right"><p className="text-xs text-muted">Subtotal</p><p className="whitespace-nowrap font-display text-lg font-black text-primary-dark">Bs. {Number(item.subtotal).toFixed(2)}</p></div>
            </div>
          </div>
        </div>
        {pending ? <p role="status" className="mt-2 text-xs font-medium text-muted">Sincronizando artículo…</p> : null}
      </article>
    );
  }

  return (
    <tr className="transition-colors border-b hover:bg-gray-50">
      <td className="px-6 py-4"><div className="flex items-center gap-4"><ImagenProducto item={item} className="h-16 w-16" /><div><h4 className="font-semibold text-gray-800">{item.name}</h4><p className="text-sm text-gray-600">Bs. {Number(item.price).toFixed(2)} por presentación</p></div></div></td>
      <td className="px-6 py-4 text-center"><ControlesCantidad item={item} onQuantityChange={onQuantityChange} pending={pending} /></td>
      <td className="px-6 py-4 font-bold text-right text-primary">Bs. {Number(item.subtotal).toFixed(2)}</td>
      <td className="px-6 py-4 text-center"><Button onClick={() => onRemove(item.id)} disabled={pending} variant="ghost" size="icon" className="text-red-500" aria-label={`Eliminar ${item.name}`} title="Eliminar artículo"><Trash2 size={20} aria-hidden="true" /></Button></td>
    </tr>
  );
}
