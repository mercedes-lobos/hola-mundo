import { ProfessionalService } from './../../../../services/professional.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Institucion } from '../../models/institucion.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { formatDate } from '@angular/common';
import { Titulo } from '../../models/titulo.model';
import { ReplaySubject, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-titulo',
  templateUrl: './dialog-titulo.component.html',
  styleUrls: ['./dialog-titulo.component.scss'],
})
export class DialogTituloComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogTituloComponent>,
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  instituciones: Institucion[] = [];
  filteredInstitucion: (Observable<Institucion[]> | undefined)[] = [];

  titulo!: Titulo;
  titulos: Titulo[] = [];
  idTitulos: number[] = [];

  hasImageFront: boolean = false;
  hasImageBack: boolean = false;

  //Form
  tituloForm!: FormGroup;

  ngOnInit() {
    this.professionalService.getInstitucion().subscribe({
      next: (data) => {
        this.instituciones = data;
      },
      error: (err) => {
        console.error(err);
        if(err.status !== 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener las instituciones.'
          });
        }
      },
      complete: () => {
        this.tituloForm = this.fb.group({
          titulo: this.fb.array([
            // cargo primera fila al comenzar
            this.getTitulo(),
          ]),
        });

        this.filteredInstitucion[0] = this.titulosArray.controls[0].get('institucion')?.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterInstitucion(value || ''))
        );
      },
    });
  }

  get titulosArray(): FormArray {
    return this.tituloForm.get('titulo') as FormArray;
  }
  private getTitulo() {
    const institucion = this.instituciones.find((institucion) => institucion.id == this.data.institucion);
    this.hasImageFront = this.data.url_image_front != null && this.data.url_image_front != '';
    this.hasImageBack = this.data.url_image_back != null && this.data.url_image_back != '';

    return this.fb.group({
      nombre: [this.data.nombre || '', Validators.required],
      institucion: [institucion?.nombre || '', Validators.required],
      fechaEgreso: [this.data.fecha_egreso || '', Validators.required],
      descripcion: [this.data.descripcion || ''],
      imageFront: [this.data.image_front || ''],
      imageBack: [this.data.image_back || ''],
      // imageFrontB64: [this.data.image_front || ''],
      // imageBackB64: [this.data.image_front || ''],
    });
  }

  updateInstitucionId(i: number, event: MatAutocompleteSelectedEvent): void {
    const institucion = this.instituciones.find((institucion) => institucion.nombre === event.option.value);
    this.instituciones[i].id = institucion?.id || 0;
  }

  private filterInstitucion(value: string): Institucion[] {
    const filterValue = value.toLowerCase();
    return this.instituciones.filter((institucion) => institucion.nombre.toLowerCase().includes(filterValue));
  }

  addTitulo(): void {
    const control = <FormArray>this.tituloForm.controls['titulo'];
    control.push(this.getTitulo());
  }

  removeTitulo(i: number): void {
    const control = <FormArray>this.tituloForm.controls['titulo'];
    control.removeAt(i);
  }

  onSaveTitulos() {
    this.guardarTitulosLocal();

    if (this.titulos.length > 0) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  guardarTitulosLocal(): void {
    for (const ti of this.titulosArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setTituloForm(ti);
      }
    }
    if (localStorage.getItem('titulos') === null) {
      localStorage.setItem('titulos', JSON.stringify(this.titulos));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('titulos') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.titulos = [...data, ...this.titulos];
      localStorage.removeItem('titulos');
      localStorage.setItem('titulos', JSON.stringify(this.titulos));
    } else {
      let titulos: Titulo[] = JSON.parse(localStorage.getItem('titulos') || '{}');
      this.titulos = [...titulos, ...this.titulos];
      localStorage.setItem('titulos', JSON.stringify(this.titulos));
    }
  }

  setTituloForm(ti: AbstractControl) {
    let institucionId = 0;
    const institucion = this.instituciones.find((institucion) => institucion.nombre === ti.get('institucion')?.value);
    if (institucion != undefined) {
      institucionId = institucion.id;
    }

    this.titulo = new Titulo();
    this.titulo.id = this.data.id || 0;
    this.titulo.nombre = ti.get('nombre')?.value;
    this.titulo.institucion = institucionId;
    this.titulo.fecha_egreso = formatDate(ti.get('fechaEgreso')?.value, 'yyyy-MM-dd', 'en-US');
    this.titulo.descripcion = ti.get('descripcion')?.value;
    this.titulo.image_front = ti.get('imageFront')?.value != null ? ti.get('imageFront')?.value : '';
    this.titulo.image_back = ti.get('imageBack')?.value != null ? ti.get('imageBack')?.value : '';
    this.titulos.push(this.titulo);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event: any, index: number, type: string) {
    const file = event.target.files[0];
    this.convertFile(file).subscribe((base64) => {
      switch (type) {
        case 'front':
          this.titulosArray.at(index).patchValue({ imageFront: file.name });
          this.titulosArray.at(index).patchValue({ imageFrontB64: base64 });
          break;
        case 'back':
          this.titulosArray.at(index).patchValue({ imageBack: file.name });
          this.titulosArray.at(index).patchValue({ imageBackB64: base64 });
          break;
      }
      this.titulosArray.at(index).updateValueAndValidity();
      this.titulosArray.at(index).markAsDirty();
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
        window.open(this.data.url_image_front);
        break;
      case 'back':
        window.open(this.data.url_image_back);
        break;
    }
  }
}
