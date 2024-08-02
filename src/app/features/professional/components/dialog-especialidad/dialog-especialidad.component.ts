import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfessionalService } from 'src/app/services/professional.service';
import { Institucion } from '../../models/institucion.model';
import { Observable, ReplaySubject, map, startWith } from 'rxjs';
import { Especialidad } from '../../models/especialidad.model';
import { formatDate } from '@angular/common';
import { TipoEspecialidad } from '../../models/tipo-especialidad.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-especialidad',
  templateUrl: './dialog-especialidad.component.html',
  styleUrls: ['./dialog-especialidad.component.scss'],
})
export class DialogEspecialidadComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogEspecialidadComponent>,
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  instituciones: Institucion[] = [];

  //Variables
  especialidad!: Especialidad;
  especialidades: Especialidad[] = [];
  idEspecialidades: number[] = [];
  tiposEspecialidades: TipoEspecialidad[] = [];
  filteredTipoEspecialidad: (Observable<TipoEspecialidad[]> | undefined)[] = [];

  //Form
  especialidadForm!: FormGroup;

  ngOnInit() {
    this.professionalService.getTipoEspecialidad().subscribe({
      next: (data) => {
        this.tiposEspecialidades = data;
      },
      error: (err) => {
        if (err.status !== 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener los tipos de especialidades.',
          });
        }
        console.error(err);
      },
      complete: () => {
        this.especialidadForm = this.fb.group({
          especialidad: this.fb.array([
            // cargo primera fila al comenzar
            this.getEspecialidad(),
          ]),
        });

        this.filteredTipoEspecialidad[0] = this.especialidadesArray.controls[0]
          .get('tipoEspecialidad')
          ?.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterTipoEspecialidad(value || ''))
          );
      },
    });
  }

  get especialidadesArray(): FormArray {
    return this.especialidadForm.get('especialidad') as FormArray;
  }
  private getEspecialidad() {
    const tipoEspecialidad = this.tiposEspecialidades.find(
      (tipoEspecialidad) => tipoEspecialidad.id == this.data.tipo_especialidad
    );
    return this.fb.group({
      // nombre: [this.data.nombre || '', Validators.required],
      tipoEspecialidad: [tipoEspecialidad?.nombre || '', Validators.required],
      centro: [this.data.centro_formador || '', Validators.required],
      fechaEgreso: [this.data.fecha_egreso || '', Validators.required],
      imageFront: [this.data.imagen_certificado_front_name || ''],
      imageBack: [this.data.imagen_certificado_back_name || ''],
      imageFrontB64: [this.data.imagen_certificado_front || ''],
      imageBackB64: [this.data.imagen_certificado_back || ''],
      descripcion: [this.data.descripcion || ''],
    });
  }

  updateTipoEspecialidadId(i: number, event: MatAutocompleteSelectedEvent): void {
    const tipoEspecialidad = this.tiposEspecialidades.find(
      (tipoEspecialidad) => tipoEspecialidad.nombre === event.option.value
    );
    this.tiposEspecialidades[i].id = tipoEspecialidad?.id || 0;
  }

  private filterTipoEspecialidad(value: string): TipoEspecialidad[] {
    const filterValue = value.toLowerCase();
    return this.tiposEspecialidades.filter((tipoEspecialidad) =>
      tipoEspecialidad.nombre.toLowerCase().includes(filterValue)
    );
  }

  addEspecialidad(): void {
    const control = <FormArray>this.especialidadForm.controls['especialidad'];
    control.push(this.getEspecialidad());
  }

  removeEspecialidad(i: number): void {
    const control = <FormArray>this.especialidadForm.controls['especialidad'];
    control.removeAt(i);
  }

  onSaveEspecialidades() {
    this.guardarEspecialidadesLocal();

    if (this.especialidades.length > 0) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  guardarEspecialidadesLocal(): void {
    for (const ti of this.especialidadesArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setEspecialidadForm(ti);
      }
    }
    if (localStorage.getItem('especialidades') === null) {
      localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('especialidades') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.especialidades = [...data, ...this.especialidades];
      localStorage.removeItem('especialidades');
      localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
    } else {
      let especialidades: Especialidad[] = JSON.parse(localStorage.getItem('especialidades') || '{}');
      this.especialidades = [...especialidades, ...this.especialidades];
      localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.data.filter((data: string) => data.toLowerCase().includes(filterValue));
  }

  setEspecialidadForm(ti: AbstractControl) {
    let tipoEspecialidadId = 0;
    const tipoEspecialidad = this.tiposEspecialidades.find(
      (tipoEspecialidad) => tipoEspecialidad.nombre === ti.get('tipoEspecialidad')?.value
    );
    if (tipoEspecialidad != undefined) {
      tipoEspecialidadId = tipoEspecialidad.id;
    }

    this.especialidad = new Especialidad();
    this.especialidad.id = this.data.id || 0;
    // this.especialidad.nombre = ti.get('nombre')?.value;
    this.especialidad.tipo_especialidad = tipoEspecialidadId;
    this.especialidad.fecha_egreso = formatDate(ti.get('fechaEgreso')?.value, 'yyyy-MM-dd', 'en-US');
    this.especialidad.centro_formador = ti.get('centro')?.value;
    this.especialidad.imagen_certificado_front_name =
      ti.get('imageFront')?.value != null ? ti.get('imageFront')?.value : '';
    this.especialidad.imagen_certificado_front =
      ti.get('imageFrontB64')?.value != null ? ti.get('imageFrontB64')?.value : '';
    this.especialidad.imagen_certificado_back_name =
      ti.get('imageBack')?.value != null ? ti.get('imageBack')?.value : '';
    this.especialidad.imagen_certificado_back =
      ti.get('imageBackB64')?.value != null ? ti.get('imageBackB64')?.value : '';
    this.especialidad.descripcion = ti.get('descripcion')?.value;

    this.especialidades.push(this.especialidad);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event: any, index: number, type: string) {
    const file = event.target.files[0];
    this.convertFile(file).subscribe((base64) => {
      switch (type) {
        case 'front':
          this.especialidadesArray.at(index).patchValue({ imageFront: file.name });
          this.especialidadesArray.at(index).patchValue({ imageFrontB64: base64 });
          break;
        case 'back':
          this.especialidadesArray.at(index).patchValue({ imageBack: file.name });
          this.especialidadesArray.at(index).patchValue({ imageBackB64: base64 });
          break;
      }

      this.especialidadesArray.at(index).updateValueAndValidity();
      this.especialidadesArray.at(index).markAsDirty();
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();

    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return;
      }
      result.next(btoa(event.target.result.toString()));
    };
    return result;
  }

  openFile(key: string): void {
    switch (key) {
      case 'front':
        window.open(this.data.imagen_certificado_front_name);
        break;
      case 'back':
        window.open(this.data.imagen_certificado_back_name);
        break;
    }
  }
}
