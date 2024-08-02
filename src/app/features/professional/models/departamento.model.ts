import { Provincia } from "./provincia.model";

export class Departamento {
  id!: number;
  nombre!: string;
  distrito!: string;
  provincia!: Provincia | number | null;
}
