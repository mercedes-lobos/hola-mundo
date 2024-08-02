import { Especialidad } from './../../models/especialidad.model';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDireccionComponent } from '../../components/dialog-direccion/dialog-direccion.component';
import { DialogTituloComponent } from '../../components/dialog-titulo/dialog-titulo.component';
import { Profesional } from '../../models/profesional.model';
import { Direccion } from '../../models/direccion.model';
import { Titulo } from '../../models/titulo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessionalService } from 'src/app/services/professional.service';
import { DialogEspecialidadComponent } from '../../components/dialog-especialidad/dialog-especialidad.component';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Institucion } from '../../models/institucion.model';
import { StorageService } from 'src/app/services/storage.service';
import { Curso } from '../../models/curso.model';
import { DialogCursoComponent } from '../../components/dialog-curso/dialog-curso.component';
import { Pais } from '../../models/pais.model';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TipoEspecialidad } from '../../models/tipo-especialidad.model';
import { LugarTrabajo } from '../../models/lugar-trabajo.model';
import { DialogLugarTrabajoComponent } from '../../components/dialog-lugar-trabajo/dialog-lugar-trabajo.component';

@Component({
  selector: 'app-edit-professional',
  templateUrl: './edit-professional.component.html',
  styleUrls: ['./edit-professional.component.scss'],
})
export class EditProfessionalComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private profesionalService: ProfessionalService,
    private storageService: StorageService
  ) {}
  direccionesColumns: string[] = ['calle', 'numero', 'localidad', 'action'];
  titulosColumns: string[] = ['nombre', 'institucion', 'fechaEgreso', 'action'];
  especialidadesColumns: string[] = ['tipoEspecialidad', 'centro', 'fechaEgreso', 'action'];
  cursosColumns: string[] = ['nombre', 'centro', 'fechaRealizacion', 'action'];
  lugaresTrabajoColumns: string[] = ['nombre', 'sector', 'action'];

  fechaNacimiento = new Date();

  direccionesDataSource!: MatTableDataSource<Direccion>;
  titulosDataSource!: MatTableDataSource<Titulo>;
  especialidadesDataSource!: MatTableDataSource<Especialidad>;
  cursosDataSource!: MatTableDataSource<Curso>;
  lugaresTrabajoDataSource!: MatTableDataSource<LugarTrabajo>;

  id!: number;
  profesional!: Profesional;
  direcciones: Direccion[] = [];
  titulos: Titulo[] = [];
  especialidades: Especialidad[] = [];
  instituciones: Institucion[] = [];
  cursos: Curso[] = [];
  paises: Pais[] = [];
  filteredPais: Observable<Pais[]> | undefined;
  paisNacimiento!: number;
  tiposEspecialidades: TipoEspecialidad[] = [];
  lugares_trabajo: LugarTrabajo[] = [];

  //Forms
  profesionalForm!: FormGroup;
  direccionForm!: FormGroup;
  tituloForm!: FormGroup; //TODO: Borrar
  especialidadForm!: FormGroup;
  cursoForm!: FormGroup;
  lugarTrabajoForm!: FormGroup;

  idTitulos: number[] = [];
  idDirecciones: number[] = [];
  idEspecialidades: number[] = [];
  idCursos: number[] = [];

  hasDirecciones: boolean = false;
  hasTitulos: boolean = false;
  hasEspecialidades: boolean = false;
  hasCursos: boolean = false;
  haslugarTrabajo: boolean = false;
  isAdmin: boolean = false;

  //Patterns
  nombre = '^\\S[a-zA-Z\\u00C0-\\u017F\\s]+$';
  dni = '^[0-9]{3,8}$';
  cuit = '^[0-9]{11}$';
  telefono = '^[0-9]{4,10}$';
  email = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'] || 0;
    this.profesionalForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      documento: ['', Validators.required],
      cuit: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarNacimiento: [''],
      paisNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      fotoPerfil: [''],
    });

    const instituciones$ = this.profesionalService.getInstitucion();
    const paises$ = this.profesionalService.getPais();
    const tiposEspecialidades$ = this.profesionalService.getTipoEspecialidad();
    forkJoin([instituciones$, paises$, tiposEspecialidades$]).subscribe({
      next: (res) => {
        this.instituciones = res[0];
        this.paises = res[1];
        this.tiposEspecialidades = res[2];
      },
      error: (e) => {
        console.error(e);
        if (e.status !== 401)
          this.notification('Error', 'No se pudo obtener los datos necesarios', 'error');
      },
      complete: () => {
        this.filteredPais = this.profesionalForm.get('paisNacimiento')?.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterPais(value || ''))
        );
      },
    });

    if (this.id) {
      this.profesionalService.getProfesional(this.id).subscribe({
        next: (resProfesional) => {
          this.profesional = resProfesional;
        },
        error: (e) => {
          console.error(e);
          if (e.status !== 401)
            this.notification('Error', 'No se pudo obtener el profesional', 'error');
        },
        complete: () => {
          this.updateProfesionalForm();
          this.filteredPais = this.profesionalForm.get('paisNacimiento')?.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterPais(value || ''))
          );
        },
      });
    }
  }

  private filterPais(value: string): Pais[] {
    const filterValue = value.toLowerCase();
    return this.paises.filter((pais) => pais.nombre.toLowerCase().includes(filterValue));
  }

  updatePaisId(event: MatAutocompleteSelectedEvent): void {
    const pais = this.paises.find((pais) => pais.nombre === event.option.value);
    this.paisNacimiento = pais?.id || 0;
  }

  onSave() {
    this.profesionalForm.markAllAsTouched();
    this.setProfesionalForm(this.profesionalForm);
  }

  setProfesionalForm(profesionalForm: FormGroup) {
    this.profesional = new Profesional();
    this.profesional.direcciones = [];
    this.profesional.titulos = [];
    this.profesional.especialidades = [];
    this.profesional.cursos = [];
    this.profesional.lugares_trabajo = [];

    this.profesional.id = this.id;
    this.profesional.nombre = profesionalForm.value.nombre;
    this.profesional.apellido = profesionalForm.value.apellido;
    this.profesional.email = profesionalForm.value.email;
    this.profesional.telefono = profesionalForm.value.telefono;
    this.profesional.documento = profesionalForm.value.documento;
    this.profesional.cuit = profesionalForm.value.cuit;
    this.profesional.fecha_nacimiento = formatDate(profesionalForm.value.fechaNacimiento, 'yyyy-MM-dd', 'en-US');
    this.profesional.lugar_nacimiento = profesionalForm.value.lugarNacimiento;
    this.profesional.pais_nacimiento = this.paisNacimiento;
    this.profesional.sexo = profesionalForm.value.sexo;
    this.profesional.user = this.storageService.getUser().user.id;
    this.profesional.foto_perfil = profesionalForm.value.fotoPerfil;
    this.profesional.reempadronado = true;

    Promise.all([
      this.guardarDirecciones(),
      this.guardarTitulos(),
      this.guardarEspecialidades(),
      this.guardarCursos(),
      this.guardarLugarTrabajo(),
    ]).then((res) => {
      this.guardarProfesional(this.profesional);
    });
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

  openDialogDireccion(data?: any): void {
    const dialogRef = this.dialog.open(DialogDireccionComponent, {
      panelClass: '.modal-responsive',
      minWidth:'40%',
      data: data || {},
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.updateDataSource('direcciones');
        this.notification('Direcciones', 'Guardadas temporalmente', 'success');
      }
    });
  }

  openDialogTitulo(data?: any): void {
    const dialogRef = this.dialog.open(DialogTituloComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      data: data || {},
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.updateDataSource('titulos');
        this.notification('Títulos', 'Guardadas temporalmente', 'success');
      }
    });
  }

  openDialogEspecialidad(data?: any): void {
    const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      data: data || {},
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.updateDataSource('especialidades');
        this.notification('Especialidades', 'Guardadas temporalmente', 'success');
      }
    });
  }

  openDialogCurso(data?: any): void {
    const dialogRef = this.dialog.open(DialogCursoComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      data: data || {},
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.updateDataSource('cursos');
        this.notification('Cursos', 'Guardadas temporalmente', 'success');
      }
    });
  }

  openDialogLugarTrabajo(data?: any): void {
    const dialogRef = this.dialog.open(DialogLugarTrabajoComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      data: data || {},
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.updateDataSource('lugarTrabajo');
        this.notification('Lugar de Trabajo', 'Guardado temporalmente', 'success');
      }
    });
  }

  cleanLocalStorage(): void {
    localStorage.removeItem('direcciones');
    localStorage.removeItem('titulos');
    localStorage.removeItem('especialidades');
    localStorage.removeItem('cursos');
    localStorage.removeItem('lugarTrabajo');
  }

  guardarProfesional(profesional: Profesional): void {
    let errorMsg = '';
    if (this.id == 0) {
      this.profesionalService.postProfesional(profesional).subscribe({
        next: (res) => {
          this.notification('Profesional', 'Guardado correctamente', 'success');
          this.cleanLocalStorage();
          this.storageService.updateProfesionalId(res.id);
          this.router.navigate(['profesional/view' + `/${res.id}`]).then((res) => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error(err);
          let errCampos = err.error.cuit || err.error.telefono || err.error.email;

          console.log(errCampos);
          if (err.error.direcciones && err.error.titulos && errCampos) {
            this.notification('Error', 'No se pudo guardar el Profesional.<br> Debe completar los datos obligatorios del formulario y agregar al menos una dirección y un título.', 'error');
          } else if (err.error.direcciones && err.error.titulos) {
            this.notification('Error', 'No se pudo guardar el Profesional.<br> Debe agregar al menos una dirección y un título.', 'error');
          } else if (errCampos) {
            this.notification('Error', 'No se pudo guardar el Profesional.<br> Debe completar los datos obligatorios del formulario.', 'error')
          } else if (err.error.direcciones) {
            this.notification('Error', 'No se pudo guardar el Profesional ya que debe agregar una dirección.', 'error');
          } else if (err.error.titulos){
            this.notification('Error', 'No se pudo guardar el Profesional ya que debe agregar un título.', 'error');
          }
        },
      });
    } else {
      this.profesionalService.putProfesional(profesional, this.id).subscribe({
        next: (res) => {
          this.notification('Profesional', 'Actualizado correctamente', 'success');
          this.cleanLocalStorage();
          // this.storageService.updateProfesionalId(res.id); //TODO: Verificar si es necesario
          this.router.navigate(['profesional/view' + `/${res.id}`]).then((res) => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error(err);
          errorMsg = 'No se pudo actualizar el Profesional.<br>';
          if (err.error.direcciones) errorMsg += 'Debe tener al menos una dirección.<br>';
          if (err.error.titulos) errorMsg += 'Debe tener al menos un título.<br>';
          if (err.error.cuit) errorMsg += 'CUIT: ' + err.error.cuit + '<br>';
          if (err.error.telefono) errorMsg += 'Teléfono: '+ err.error.telefono + '<br>';
          if (err.error.documento) errorMsg += 'Documento: ' + err.error.documento + '<br>';
          if (err.error.email) errorMsg += 'Email: ' + err.error.email + '<br>';

          if (err.status !== 401)
            this.notification('Error', errorMsg, 'error');
        },
      });
    }
  }
  //Guardar Direcciones en base de datos
  async guardarDirecciones() {
    for (let i = 0; i < this.direcciones.length; i++) {
      if (this.direcciones[i].id === 0) {
        await new Promise((resolve) => {
          this.profesionalService.postDireccion(this.direcciones[i]).subscribe({
            next: (res) => {
              this.profesional.direcciones = [...this.profesional.direcciones, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al guardar Direcciones', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      } else {
        await new Promise((resolve) => {
          this.profesionalService.putDireccion(this.direcciones[i], this.direcciones[i].id).subscribe({
            next: (res) => {
              this.profesional.direcciones = [...this.profesional.direcciones, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al actualizar Direcciones', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      }
    }
  }

  //Guardar Titulos en base de datos
  async guardarTitulos() {
    for (let i = 0; i < this.titulos.length; i++) {
      if (this.titulos[i].id === 0) {
        await new Promise((resolve) => {
          this.profesionalService.postTitulo(this.titulos[i]).subscribe({
            next: (res) => {
              this.profesional.titulos = [...this.profesional.titulos, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al guardar Títulos', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      } else {
        await new Promise((resolve) => {
          this.profesionalService.putTitulo(this.titulos[i], this.titulos[i].id).subscribe({
            next: (res) => {
              this.profesional.titulos = [...this.profesional.titulos, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al actualizar Títulos', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      }
    }
  }

  //Guardar Especialidades en base de datos
  async guardarEspecialidades() {
    for (let i = 0; i < this.especialidades.length; i++) {
      if (this.especialidades[i].id === 0) {
        await new Promise((resolve) => {
          this.profesionalService.postEspecialidad(this.especialidades[i]).subscribe({
            next: (res) => {
              this.profesional.especialidades = [...this.profesional.especialidades, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al guardar Especialidades', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      } else {
        await new Promise((resolve) => {
          this.profesionalService.putEspecialidad(this.especialidades[i], this.especialidades[i].id).subscribe({
            next: (res) => {
              this.profesional.especialidades = [...this.profesional.especialidades, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al actualizar Especialidades', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      }
    }
  }

  //Guardar Cursos en base de datos
  async guardarCursos() {
    for (let i = 0; i < this.cursos.length; i++) {
      if (this.cursos[i].id === 0) {
        await new Promise((resolve) => {
          this.profesionalService.postCurso(this.cursos[i]).subscribe({
            next: (res) => {
              this.profesional.cursos = [...this.profesional.cursos, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al guardar Cursos', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      } else {
        await new Promise((resolve) => {
          this.profesionalService.putCurso(this.cursos[i], this.cursos[i].id).subscribe({
            next: (res) => {
              this.profesional.cursos = [...this.profesional.cursos, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al actualizar Cursos', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      }
    }
  }

  //Guardar Lugar de Trabajo en base de datos
  async guardarLugarTrabajo() {
    for (let i = 0; i < this.lugares_trabajo.length; i++) {
      if (this.lugares_trabajo[i].id === 0) {
        await new Promise((resolve) => {
          this.profesionalService.postLugarTrabajo(this.lugares_trabajo[i]).subscribe({
            next: (res) => {
              this.profesional.lugares_trabajo = [...this.profesional.lugares_trabajo, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al guardar Lugar de Trabajo', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      } else {
        await new Promise((resolve) => {
          this.profesionalService.putLugarTrabajo(this.lugares_trabajo[i], this.lugares_trabajo[i].id).subscribe({
            next: (res) => {
              this.profesional.lugares_trabajo = [...this.profesional.lugares_trabajo, res.id];
            },
            error: (err) => {
              console.error(err);
              if (err.status !== 401)
                this.notification('Error', 'Error al actualizar Lugar de Trabajo', 'error');
            },
            complete: () => {
              resolve(true);
            },
          });
        });
      }
    }
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }



  deleteRow(key: string, id: number) {
    Swal.fire({
      title: 'Está seguro/a?',
      text: "Para conservar estos cambios antes de salir, debe actualizar o guardar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        data.splice(id, 1);
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(data));
        this.updateDataSource(key);

        Swal.fire({
          title: 'Eliminado!',
          text: 'El registro ha sido eliminado de la memoria.',
          icon: 'success',
        });
      }
    });

  }

  editRow(key: string, row: any, id: number) {
    let data: any;
    switch (key) {
      case 'direcciones':
        this.setDataDireccion(data, row, id);
        break;
      case 'titulos':
        this.setDataTitulo(data, row, id);
        break;
      case 'especialidades':
        this.setDataEspecialidad(data, row, id);
        break;
      case 'cursos':
        this.setDataCurso(data, row, id);
        break;
      case 'lugarTrabajo':
        this.setDataLugarTrabajo(data, row, id);
        break;
    }
  }

  setDataDireccion(data: any, row: any, id: number) {
    data = {
      rowId: id,
      id: row?.id,
      tipo_direccion: row?.tipo_direccion,
      calle: row?.calle,
      numero: row?.numero,
      piso: row?.piso,
      numero_departamento: row?.numero_departamento,
      codigo_postal: row?.codigo_postal,
      localidad: row?.localidad,
      departamento: row?.departamento,
      pais: row?.pais,
      provincia: row?.provincia,
    };
    this.openDialogDireccion(data);
  }
  setDataTitulo(data: any, row: any, id: number) {
    data = {
      rowId: id,
      id: row?.id,
      nombre: row?.nombre,
      institucion: row?.institucion,
      fecha_egreso: row?.fecha_egreso,
      descripcion: row?.descripcion,
      url_image_front: row?.url_image_front,
      image_front: row?.image_front,
      url_image_back: row?.url_image_back,
      image_back: row?.image_back,
    };
    this.openDialogTitulo(data);
  }
  setDataEspecialidad(data: any, row: any, id: number) {
    data = {
      rowId: id,
      id: row?.id,
      // nombre: row?.nombre,
      tipo_especialidad: row?.tipo_especialidad,
      institucion: row?.institucion,
      fecha_egreso: row?.fecha_egreso,
      centro_formador: row?.centro_formador,
      imagen_certificado_front_name: row?.imagen_certificado_front_name,
      imagen_certificado_front: row?.imagen_certificado_front,
      imagen_certificado_back_name: row?.imagen_certificado_back_name,
      imagen_certificado_back: row?.imagen_certificado_back,
      descripcion: row?.descripcion,
    };
    this.openDialogEspecialidad(data);
  }
  setDataCurso(data: any, row: any, id: number) {
    data = {
      rowId: id,
      id: row?.id,
      nombre_capacitacion: row?.nombre_capacitacion,
      fecha_realizacion: row?.fecha_realizacion,
      centro_formador: row?.centro_formador,
      url_imagen_certificado: row?.url_imagen_certificado,
      imagen_certificado: row?.imagen_certificado,
      descripcion: row?.descripcion,
    };
    this.openDialogCurso(data);
  }
  setDataLugarTrabajo(data: any, row: any, id: number) {
    data = {
      rowId: id,
      id: row?.id,
      nombre: row?.nombre,
      sector: row?.sector,
    };
    this.openDialogLugarTrabajo(data);
  }

  updateDataSource(key: string) {
    switch (key) {
      case 'direcciones':
        this.direcciones = JSON.parse(localStorage.getItem('direcciones') || '{}');
        this.direccionesDataSource = new MatTableDataSource<Direccion>(this.direcciones);
        break;
      case 'titulos':
        this.titulos = JSON.parse(localStorage.getItem('titulos') || '{}');
        this.titulosDataSource = new MatTableDataSource<Titulo>(this.titulos);
        break;
      case 'especialidades':
        this.especialidades = JSON.parse(localStorage.getItem('especialidades') || '{}');
        this.especialidadesDataSource = new MatTableDataSource<Especialidad>(this.especialidades);
        break;
      case 'cursos':
        this.cursos = JSON.parse(localStorage.getItem('cursos') || '{}');
        this.cursosDataSource = new MatTableDataSource<Curso>(this.cursos);
        break;
      case 'lugarTrabajo':
        this.lugares_trabajo = JSON.parse(localStorage.getItem('lugarTrabajo') || '{}');
        this.lugaresTrabajoDataSource = new MatTableDataSource<LugarTrabajo>(this.lugares_trabajo);
        break;
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
    });
    if (this.profesional.url_foto_perfil) {
      let fotoPerfilB64: any;
      this.getBase64ImageFromUrl(this.profesional.url_foto_perfil as string)
        .then((result) => (fotoPerfilB64 = result))
        .catch((err) => console.error(err))
        .finally(() => {
          this.profesionalForm.patchValue({
            fotoPerfil: fotoPerfilB64,
          });
        });
    }
    if (this.profesional.direcciones.length > 0) {
      this.direcciones = this.profesional.direcciones as Direccion[];
      localStorage.setItem('direcciones', JSON.stringify(this.direcciones));
      this.updateDataSource('direcciones');
    }
    if (this.profesional.titulos.length > 0) {
      this.titulos = this.profesional.titulos as Titulo[];
      if (this.titulos.length > 0) {
        this.titulos.forEach((titulo, index) => {
          if (titulo.url_image_front != null) {
            let imageFrontB64: any;
            this.getBase64ImageFromUrl(titulo.url_image_front as string)
              .then((result) => (imageFrontB64 = result))
              .catch((err) => console.error(err))
              .finally(() => {
                this.titulos[index].url_image_front = titulo.image_front;
                this.titulos[index].image_front = imageFrontB64;
                localStorage.setItem('titulos', JSON.stringify(this.titulos));
                this.updateDataSource('titulos');
              });
          } else {
            this.titulos[index].url_image_front = '';
            this.titulos[index].image_front = '';
            localStorage.setItem('titulos', JSON.stringify(this.titulos));
            this.updateDataSource('titulos');
          }
          if (titulo.url_image_back != null) {
            let imageBackB64: any;
            this.getBase64ImageFromUrl(titulo.url_image_back as string)
              .then((result) => (imageBackB64 = result))
              .catch((err) => console.error(err))
              .finally(() => {
                this.titulos[index].url_image_back = titulo.image_back;
                this.titulos[index].image_back = imageBackB64;
                localStorage.setItem('titulos', JSON.stringify(this.titulos));
                this.updateDataSource('titulos');
              });
          } else {
            this.titulos[index].url_image_back = '';
            this.titulos[index].image_back = '';
            localStorage.setItem('titulos', JSON.stringify(this.titulos));
            this.updateDataSource('titulos');
          }
        });
        localStorage.setItem('titulos', JSON.stringify(this.titulos));
        this.updateDataSource('titulos');
      }
    }
    if (this.profesional.especialidades.length > 0) {
      this.especialidades = this.profesional.especialidades as Especialidad[];
      if (this.especialidades.length > 0) {
        this.especialidades.forEach((especialidad, index) => {
          if (especialidad.imagen_certificado_front == null) {
            this.especialidades[index].imagen_certificado_front = '';
          } else {
            let imgFileFront: any;
            this.getBase64ImageFromUrl(especialidad.imagen_certificado_front as string)
              .then((result) => (imgFileFront = result))
              .catch((err) => console.error(err))
              .finally(() => {
                this.especialidades[index].imagen_certificado_front_name =
                  especialidad.imagen_certificado_front as string;
                this.especialidades[index].imagen_certificado_front = imgFileFront;
                localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
                this.updateDataSource('especialidades');
              });
          }
          if (especialidad.imagen_certificado_back == null) {
            this.especialidades[index].imagen_certificado_back = '';
          } else {
            let imgFileBack: any;
            this.getBase64ImageFromUrl(especialidad.imagen_certificado_back as string)
              .then((result) => (imgFileBack = result))
              .catch((err) => console.error(err))
              .finally(() => {
                this.especialidades[index].imagen_certificado_back_name =
                  especialidad.imagen_certificado_back as string;
                this.especialidades[index].imagen_certificado_back = imgFileBack;
                localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
                this.updateDataSource('especialidades');
              });
          }
        });
        localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
        this.updateDataSource('especialidades');
      }
    }
    if (this.profesional.cursos.length > 0) {
      this.cursos = this.profesional.cursos as Curso[];
      if (this.cursos.length > 0) {
        this.cursos.forEach((curso, index) => {
          if (curso.url_imagen_certificado != null) {
            let imagenCertificadoB64: any;
              this.getBase64ImageFromUrl(curso.url_imagen_certificado as string)
                .then((result) => (imagenCertificadoB64 = result))
                .catch((err) => console.error(err))
                .finally(() => {
                  this.cursos[index].url_imagen_certificado = curso.imagen_certificado;
                  this.cursos[index].imagen_certificado = imagenCertificadoB64;
                  localStorage.setItem('cursos', JSON.stringify(this.cursos));
                  this.updateDataSource('cursos');
                });
          } else {
            this.cursos[index].url_imagen_certificado = '';
            this.cursos[index].imagen_certificado = '';
            localStorage.setItem('cursos', JSON.stringify(this.cursos));
            this.updateDataSource('cursos');
          }

        });
        localStorage.setItem('cursos', JSON.stringify(this.cursos));
        this.updateDataSource('cursos');
      }
    }
    if (this.profesional.lugares_trabajo.length > 0) {
      this.lugares_trabajo = this.profesional.lugares_trabajo as LugarTrabajo[];
      localStorage.setItem('lugarTrabajo', JSON.stringify(this.lugares_trabajo));
      this.updateDataSource('lugarTrabajo');
    }
  }

  private async getBase64ImageFromUrl(imageUrl: RequestInfo | URL) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
}
