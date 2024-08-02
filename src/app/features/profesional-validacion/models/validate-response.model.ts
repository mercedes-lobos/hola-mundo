export class ValidateResponse {
  valid!: boolean;
  profesional!: IProfesional;
}

export interface IProfesional {
  nombre_completo: string;
  matricula: string;
  documento: string;
}
