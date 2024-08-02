import { ProfessionalService } from 'src/app/services/professional.service';
import { Component } from '@angular/core';
import { Profesional } from '../../models/profesional.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Institucion } from '../../models/institucion.model';
import { Titulo } from '../../models/titulo.model';
import { Especialidad } from '../../models/especialidad.model';
import { Direccion } from '../../models/direccion.model';
import { MatTableDataSource } from '@angular/material/table';
import { Curso } from '../../models/curso.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Pais } from '../../models/pais.model';
import { forkJoin } from 'rxjs';
import { TipoEspecialidad } from '../../models/tipo-especialidad.model';
import { LugarTrabajo } from '../../models/lugar-trabajo.model';

@Component({
  selector: 'app-view-professional',
  templateUrl: './view-professional.component.html',
  styleUrls: ['./view-professional.component.scss'],
})
export class ViewProfessionalComponent {
  id!: number;
  profesional!: Profesional;
  instituciones: Institucion[] = [];
  paises: Pais[] = [];
  tiposEspecialidades: TipoEspecialidad[] = [];

  hasDirecciones: boolean = false;
  hasTitulos: boolean = false;
  hasEspecialidades: boolean = false;
  hasCursos: boolean = false;
  hasLugaresTrabajo: boolean = false;

  //Forms
  profesionalForm!: FormGroup;
  direccionForm!: FormGroup;
  tituloForm!: FormGroup; //TODO: Borrar
  especialidadForm!: FormGroup;
  cursosForm!: FormGroup;

  direccionesColumns: string[] = ['calle', 'numero', 'localidad'];
  titulosColumns: string[] = ['nombre', 'institucion', 'fechaEgreso'];
  especialidadesColumns: string[] = ['tipoEspecialidad', 'fechaEgreso'];
  cursosColumns: string[] = ['nombre', 'fechaRealizacion'];
  lugaresTrabajoColumns: string[] = ['nombre', 'sector'];

  direccionesDataSource!: MatTableDataSource<Direccion>;
  titulosDataSource!: MatTableDataSource<Titulo>;
  especialidadesDataSource!: MatTableDataSource<Especialidad>;
  cursosDataSource!: MatTableDataSource<Curso>;
  lugaresTrabajoDataSource!: MatTableDataSource<LugarTrabajo>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private profesionalService: ProfessionalService
  ) {}

  ngOnInit() {
    this.profesional = new Profesional();

    this.id = this.route.snapshot.params['id'];
    this.profesionalForm = this.fb.group({
      nombre: [''],
      apellido: [''],
      email: [''],
      telefono: [''],
      documento: [''],
      cuit: [''],
      fechaNacimiento: [''],
      lugarNacimiento: [''],
      paisNacimiento: [''],
      sexo: [''],
      fotoPerfil: [''],
    });
    if (this.id) {
      const instituciones$ = this.profesionalService.getInstitucion();
      const paises$ = this.profesionalService.getPais();
      const profesional$ = this.profesionalService.getProfesional(this.id);
      const tiposEspecialidades$ = this.profesionalService.getTipoEspecialidad();

      forkJoin([instituciones$, paises$, profesional$, tiposEspecialidades$]).subscribe({
        next: (res) => {
          this.instituciones = res[0];
          this.paises = res[1];
          this.profesional = res[2];
          this.tiposEspecialidades = res[3];
        },
        error: (e) => {
          if (e.status !== 401)
            this.notification('Error', 'No se pudo obtener el profesional', 'error');
          console.error(e);
        },
        complete: () => {
          this.updateProfesionalForm();
        },
      });
    }
  }

  updateProfesionalForm() {
    this.profesionalForm.patchValue({
      nombre: this.profesional.nombre,
      apellido: this.profesional.apellido,
      email: this.profesional.email,
      telefono: this.profesional.telefono,
      documento: this.profesional.documento,
      cuit: this.profesional.cuit,
      fechaNacimiento: this.profesional.fecha_nacimiento,
      lugarNacimiento: this.profesional.lugar_nacimiento,
      paisNacimiento: (this.profesional.pais_nacimiento as Pais).nombre,
      sexo: this.profesional.sexo,
      fotoPerfil: this.profesional.url_foto_perfil,
    });
    if (this.profesional.direcciones.length > 0) {
      this.hasDirecciones = true;
      this.direccionesDataSource = new MatTableDataSource<Direccion>(this.profesional.direcciones as Direccion[]);
    } else {
      this.hasDirecciones = false;
    }
    if (this.profesional.titulos.length > 0) {
      this.hasTitulos = true;
      this.titulosDataSource = new MatTableDataSource<Titulo>(this.profesional.titulos as Titulo[]);
    } else {
      this.hasTitulos = false;
    }
    if (this.profesional.especialidades.length > 0) {
      this.hasEspecialidades = true;
      this.especialidadesDataSource = new MatTableDataSource<Especialidad>(
        this.profesional.especialidades as Especialidad[]
      );
    } else {
      this.hasEspecialidades = false;
    }
    if (this.profesional.cursos.length > 0) {
      this.hasCursos = true;
      this.cursosDataSource = new MatTableDataSource<Curso>(this.profesional.cursos as Curso[]);
    } else {
      this.hasCursos = false;
    }
    if (this.profesional.lugares_trabajo.length > 0) {
      this.hasLugaresTrabajo = true;
      this.lugaresTrabajoDataSource = new MatTableDataSource<LugarTrabajo>(this.profesional.lugares_trabajo as LugarTrabajo[]);
    } else {
      this.hasLugaresTrabajo = false;
    }
  }

  getInstitucionNombre(id: number): any {
    if (this.instituciones) {
      const institucion = this.instituciones.find((institucion) => institucion.id === id);
      return institucion?.nombre;
    }
  }

  getTipoEspecialidadNombre(id: number): any {
    if (this.tiposEspecialidades) {
      const tipoEspecialidad = this.tiposEspecialidades.find((tipoEspecialidad) => tipoEspecialidad.id === id);
      return tipoEspecialidad?.nombre;
    }
  }

  edit() {
    this.router.navigate(['/profesional/edit/' + `${this.id}`]);
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
