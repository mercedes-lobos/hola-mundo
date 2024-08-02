import { Periodo } from "./periodo.model";
import { Concepto } from "./concepto.model";
import { Profesional } from "../../professional/models/profesional.model";
import { User } from "src/app/models/user.model";


export class RegistroPago {
  id?: number;
  fecha_registro!: string;
  periodo!: Periodo | number;
  monto!: number;
  observacion!: string;
  concepto!: Concepto | number;
  comprobante!: string;
  url_comprobante?: string;
  mes_pago!: number;
  user!: User | number;
  profesional!: Profesional | number;
  estado_pago?: string;
}
