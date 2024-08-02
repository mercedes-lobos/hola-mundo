import { Departamento } from "./departamento.model";
import { Pais } from "./pais.model";
import { Provincia } from "./provincia.model";

export class Direccion {
  id!: number;
  calle!: string;
  numero!: number;
  piso!: string;
  numero_departamento!: string;
  codigo_postal!: string;
  localidad!: string;
  departamento!: Departamento | number;
  tipo_direccion!: string;
  pais!: Pais | number;
  provincia!: Provincia | number | null;
}
