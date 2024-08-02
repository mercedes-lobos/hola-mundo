import { User } from "src/app/models/user.model";
import { Profesional } from "../../professional/models/profesional.model";

export class Cuenta {
  id?: number;
  user!: number | User;
  profesional!: number | Profesional;
  saldo!: number;
  numero_cuenta!: string;
  estado_cuenta!: string;
}
