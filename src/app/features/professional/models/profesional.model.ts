import { Matricula } from './matricula.model';
import { Persona } from './persona.model';
import { Especialidad } from './especialidad.model';
import { Titulo } from './titulo.model';
import { Curso } from './curso.model';
import { LugarTrabajo } from './lugar-trabajo.model';

export class Profesional extends Persona {
  matriculas!: Matricula[];
  titulos!: (number | Titulo)[];
  especialidades!: (number | Especialidad)[];
  cursos!: (number | Curso)[];
  lugares_trabajo!: (number | LugarTrabajo)[];
  user!: number;
  reempadronado?: boolean;
}

// export class ProfesionalView extends PersonaView {
//   matriculas!: Matricula[];
//   titulos!: Titulo[];
//   especialidades!: Especialidad[];
//   user!: number;
// }
