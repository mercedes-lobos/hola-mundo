import { Concepto } from "./concepto.model";

export class DetallePago {
  id?: number;
  concepto!: Concepto | number;
  mes_pago!: number;
}
