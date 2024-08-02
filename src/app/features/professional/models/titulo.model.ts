import { Institucion } from "./institucion.model";

export class Titulo {
  id!: number;
  nombre!: string;
  institucion!: Institucion | number;
  fecha_egreso!: string;
  descripcion!: string;
  image_front!: string;
  url_image_front?: string;
  image_back!: string;
  url_image_back?: string;
}
