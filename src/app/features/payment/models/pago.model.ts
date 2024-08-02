import { User } from "src/app/models/user.model";
import { Profesional } from "../../professional/models/profesional.model";
import { Periodo } from "./periodo.model";
import { DetallePago } from "./detalle-pago.model";

export class Pago {
  id?: number;
  user!: User | number;
  profesional!: Profesional | number;
  fecha_pago!: string;
  monto_total_pago?: number;
  numbero_recibo?: string;
  observacion!: string;
  tipo_pago!: string;
  estado_pago!: string;
  periodo!: Periodo | number;
  items!: DetallePago[];
  fecha_vencimiento?: string;
  nombre_mes_cuota?: string;
}
