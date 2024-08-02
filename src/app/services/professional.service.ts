import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Institucion } from '../features/professional/models/institucion.model';
import { Profesional } from '../features/professional/models/profesional.model';
import { Titulo } from '../features/professional/models/titulo.model';
import { Direccion } from '../features/professional/models/direccion.model';
import { Especialidad } from '../features/professional/models/especialidad.model';
import { Curso } from '../features/professional/models/curso.model';
import { Pais } from '../features/professional/models/pais.model';
import { Provincia } from '../features/professional/models/provincia.model';
import { environment } from 'src/environments/environment';
import { TipoEspecialidad } from '../features/professional/models/tipo-especialidad.model';
import { LugarTrabajo } from '../features/professional/models/lugar-trabajo.model';
import { Departamento } from '../features/professional/models/departamento.model';

const urlApi = environment.apiUrl;
const version = environment.version;

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  constructor(private _httpClient: HttpClient) {}
  //Instituciones
  getInstitucion(): Observable<Institucion[]> {
    return this._httpClient.get<Institucion[]>(urlApi + version + '/instituciones');
  }

  //Profesionales
  postProfesional(profesional: Profesional): Observable<Profesional> {
    return this._httpClient.post<Profesional>(urlApi + version + '/profesionales/', profesional);
  }
  putProfesional(profesional: Profesional, id: number): Observable<Profesional> {
    return this._httpClient.put<Profesional>(urlApi + version + '/profesionales/' + id + '/', profesional);
  }
  getProfesional(id: number): Observable<any> {
    return this._httpClient.get<Profesional[]>(urlApi + version + `/profesionales/${id}`);
  }

  //Titulos
  postTitulo(titulo: Titulo): Observable<Titulo> {
    return this._httpClient.post<Titulo>(urlApi + version + '/titulos/', titulo);
  }
  putTitulo(titulo: Titulo, id: number): Observable<Titulo> {
    return this._httpClient.put<Titulo>(urlApi + version + '/titulos/' + id + '/', titulo);
  }
  getTitulo(id: number): Observable<Titulo> {
    return this._httpClient.get<Titulo>(urlApi + version + '/titulos/' + id);
  }
  //Direcciones
  postDireccion(direccion: Direccion): Observable<Direccion> {
    return this._httpClient.post<Direccion>(urlApi + version + '/direcciones/', direccion);
  }
  putDireccion(direccion: Direccion, id: number): Observable<Direccion> {
    return this._httpClient.put<Direccion>(urlApi + version + '/direcciones/' + id + '/', direccion);
  }
  getDireccion(id: number): Observable<Direccion> {
    return this._httpClient.get<Direccion>(urlApi + version + '/direcciones/' + id);
  }

  //Departamentos
  getDepartamento(): Observable<Departamento[]> {
    return this._httpClient.get<Departamento[]>(urlApi + version + '/departamentos/');
  }

  //Paises
  getPais(): Observable<Pais[]> {
    return this._httpClient.get<Pais[]>(urlApi + version + '/paises');
  }

  //Provincias
  getProvincia(): Observable<Provincia[]> {
    return this._httpClient.get<Provincia[]>(urlApi + version + '/provincias');
  }

  //Especialidades
  postEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this._httpClient.post<Especialidad>(urlApi + version + '/especialidades/', especialidad);
  }
  putEspecialidad(especialidad: Especialidad, id: number): Observable<Especialidad> {
    return this._httpClient.put<Especialidad>(urlApi + version + '/especialidades/' + id + '/', especialidad);
  }
  getEspecialidad(id: number): Observable<Especialidad> {
    return this._httpClient.get<Especialidad>(urlApi + version + '/especialidades/' + id);
  }

  //Cursos
  postCurso(curso: Curso): Observable<Curso> {
    return this._httpClient.post<Curso>(urlApi + version + '/cursos/', curso);
  }
  putCurso(curso: Curso, id: number): Observable<Curso> {
    return this._httpClient.put<Curso>(urlApi + version + '/cursos/' + id + '/', curso);
  }
  getCurso(id: number): Observable<Curso> {
    return this._httpClient.get<Curso>(urlApi + version + '/cursos/' + id);
  }

  //TipoEspecialidades
  getTipoEspecialidad(): Observable<TipoEspecialidad[]> {
    return this._httpClient.get<TipoEspecialidad[]>(urlApi + version + '/tipo-especialidades/');
  }

  //LugarTrabajo
  postLugarTrabajo(lugarTrabajo: LugarTrabajo): Observable<LugarTrabajo> {
    return this._httpClient.post<LugarTrabajo>(urlApi + version + '/lugar-trabajo/', lugarTrabajo);
  }
  putLugarTrabajo(lugarTrabajo: LugarTrabajo, id: number): Observable<LugarTrabajo> {
    return this._httpClient.put<LugarTrabajo>(urlApi + version + '/lugar-trabajo/' + id + '/', lugarTrabajo);
  }
  getLugarTrabajo(id: number): Observable<LugarTrabajo> {
    return this._httpClient.get<LugarTrabajo>(urlApi + version + '/lugar-trabajo/' + id);
  }

  //Reportes
  postCertificadoMatricula() {
    return this._httpClient.post(urlApi + version + '/reportes/certificado-matricula/profesional/', {}, { responseType: 'blob' });
  }

  postCertificadoEtica() {
    return this._httpClient.post(urlApi + version + '/reportes/certificado-etica/profesional/', {}, { responseType: 'blob' });
  }

  postLibreDeuda() {
    return this._httpClient.post(urlApi + version + '/reportes/certificado-libre-deuda/profesional/', {}, { responseType: 'blob' });
  }
}
