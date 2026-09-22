// Tipos que representan exactamente lo que devuelve tu backend.
// Si cambiás algo en el backend, lo reflejás acá.

export interface ResultadoPaginado<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  slug: string;
  imagenUrl: string | null;
  subcategorias: Categoria[]; // árbol anidado (viene de GET /api/categorias)
}

export interface ImagenProducto {
  idImagen: number;
  url: string;
  principal: boolean;
  ordenImagen: number;
}

export interface ValorAtributo {
  idValor: number;
  valor: string;
  visualValue: string | null;
  atributo: {
    idAtributo: number;
    nombre: string;
    tipoVisualizacion: TipoVisualizacionAtributo;
  };
}

export type TipoVisualizacionAtributo = 'text' | 'color' | 'image';

export interface VarianteAtributo {
  valorAtributo: ValorAtributo;
}

export interface ImagenVariante {
  idImagen: number;
  url: string;
  principal: boolean;
  ordenImagen: number;
}

export interface Inventario {
  stockActual: number;
  stockMinimo: number;
}

export interface Variante {
  idVariante: number;
  sku: string;
  cantidadContenido: number;     // ej: 50, 100
  estado: 'Activo' | 'Inactivo';
  inventario: Inventario | null;
  imagenes: ImagenVariante[];
  varianteAtributo: VarianteAtributo[]; // atributos de esta variante (Color, Tamaño, etc.)
  marca: { nombre: string } | null;
  unidad: { nombre: string; abreviatura: string } | null;
  idListaPrecio: number | null;
}

export interface ReglaPrecioPublica {
  idReglaPrecio: number;
  nombre: string;
  cantidadMinima: number;
  precioPorPresentacion: string;
  principal: boolean;
  orden: number;
}

export interface ListaPrecioPublica {
  idListaPrecio: number;
  nombre: string;
  principal: boolean;
  reglas: ReglaPrecioPublica[];
}

export interface Producto {
  idProducto: number;
  idAtributoPrincipal: number | null;
  atributoPrincipal: {
    idAtributo: number;
    nombre: string;
    tipoVisualizacion: TipoVisualizacionAtributo;
  } | null;
  nombre: string;
  slug: string;
  descripcionCorta: string | null;
  descripcion: string | null;
  destacado: boolean;
  imagenes: ImagenProducto[];
  variantes: Variante[];
  listaPrecios: ListaPrecioPublica[];
  categoria: Categoria;
  estado: 'Activo' | 'Inactivo' | 'Borrador' | 'Descontinuado';
  rating:number // agregamos rating
  precioDesde: string | null;
  tieneVariacionPrecio: boolean;
}
