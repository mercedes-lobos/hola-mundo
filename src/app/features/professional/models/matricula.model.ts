import { Resolucion } from "./resolucion.model";
import { Titulo } from "./titulo.model";

export class Matricula {
  id!: number;
  numero!: string;
  titulo!: Titulo[];
  descripcion!: string;
  resolucion!: Resolucion;

}
