import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtImagenesPorProducto, insertarImagen, borrarImagen } from "../../../services/api";
import Button from "../../../components/ui/Button/Button";
import StatusMessage from "../../../components/ui/StatusMessage/StatusMessage";

export default function AdminImagenes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);

  const cargarImagenes = async () => {
    setCargando(true);
    try {
      const data = await obtImagenesPorProducto(id);
      setImagenes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarImagenes(); }, [id]);

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubir = async () => {
    if (!archivo) return;
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("imagen", archivo);
      await insertarImagen(id, formData);
      setArchivo(null);
      setPreview(null);
      await cargarImagenes();
    } catch (error) {
      console.error(error);
      alert("Error al subir la imagen");
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (idImagen) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    setEliminando(idImagen);
    try {
      await borrarImagen(idImagen);
      setImagenes(prev => prev.filter(img => img.id_imagen !== idImagen));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la imagen");
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-background font-body">

      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <button
          onClick={() => navigate("/admin/mostrar-productos")}
          className="bg-transparent border-none cursor-pointer text-2xl text-primary hover:text-primary-dark transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="m-0 text-2xl font-bold text-ink tracking-tight">
            Administrar imágenes
          </h1>
          <p className="mt-1 text-xs text-primary">
            Producto ID: {id} · {imagenes.length} imagen{imagenes.length !== 1 ? "es" : ""}
          </p>
        </div>
      </div>

      {/* Subir imagen */}
      <div className="bg-ink rounded-card border border-primary/20 shadow-lg p-6 mb-6">
        <p className="m-0 mb-4 text-sm font-bold text-primary-light/70 uppercase tracking-wider">
          Subir nueva imagen
        </p>

        <div className="flex gap-4 items-start flex-wrap">

          {/* Preview */}
          <div className="w-[100px] h-[100px] rounded-card border-2 border-dashed border-primary/35 bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-3xl">🖼️</span>
            }
          </div>

          {/* Controles */}
          <div className="flex flex-col gap-2.5">
            <label className="inline-block px-4 py-2 bg-primary/20 text-primary-light rounded-lg border border-primary/25 text-[13px] font-semibold cursor-pointer">
              Elegir archivo
              <input type="file" accept="image/*" onChange={handleArchivo} className="hidden" />
            </label>

            {archivo && (
              <span className="text-xs text-primary/60">{archivo.name}</span>
            )}

            <Button
              onClick={handleSubir}
              disabled={!archivo || subiendo}
              className={!archivo || subiendo ? "opacity-50 cursor-not-allowed" : ""}
            >
              {subiendo ? "Subiendo..." : "⬆️ Subir imagen"}
            </Button>
          </div>
        </div>
      </div>

      {/* Galería */}
      <div className="bg-ink rounded-card border border-primary/20 shadow-lg p-6">
        <p className="m-0 mb-5 text-sm font-bold text-primary-light/70 uppercase tracking-wider">
          Imágenes actuales
        </p>

        {cargando ? (
          <StatusMessage status="loading" message="Cargando imágenes..." />
        ) : imagenes.length === 0 ? (
          <StatusMessage status="empty" message="Este producto no tiene imágenes todavía" />
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
            {imagenes.map((img) => (
              <div key={img.id_imagen} className="rounded-card overflow-hidden border border-primary/20 bg-primary/10 relative">
                <img
                  src={img.url}
                  alt={`imagen-${img.id_imagen}`}
                  className="w-full h-[130px] object-cover block"
                />
                <div className="p-2 flex justify-center">
                  <button
                    onClick={() => handleEliminar(img.id_imagen)}
                    disabled={eliminando === img.id_imagen}
                    className="bg-red-500/15 border border-red-500/30 text-red-300 rounded-md px-3.5 py-1 text-xs font-semibold cursor-pointer hover:bg-red-500/25 transition-colors disabled:opacity-50"
                  >
                    {eliminando === img.id_imagen ? "Eliminando..." : "🗑️ Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
