import { Direccion } from './direccion.model';
import { Pais } from './pais.model';

export class Persona {
  id!: number;
  nombre!: string;
  apellido!: string;
  email!: string;
  telefono!: string;
  documento!: string;
  cuit!: string;
  direcciones!: (number | Direccion)[];
  fecha_nacimiento!: string;
  lugar_nacimiento!: string;
  pais_nacimiento!: number | Pais;
  sexo!: string;
  foto_perfil!: string;
  url_foto_perfil!: string;
}

