import { Institucion } from "./institucion.model";
import { TipoEspecialidad } from "./tipo-especialidad.model";

export class Especialidad {
  id!: number;
  tipo_especialidad!: TipoEspecialidad | number;
  institucion!: Institucion;
  fecha_egreso!: string;
  centro_formador!: string;
  url_imagen_certificado_front?: string;
  imagen_certificado_front!: File | string;
  imagen_certificado_front_name?: string;
  url_imagen_certificado_back?: string;
  imagen_certificado_back!: File | string;
  imagen_certificado_back_name?: string;
  descripcion!: string;
}
