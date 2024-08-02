import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { formatDate } from '@angular/common';
import { Curso } from '../../models/curso.model';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-dialog-curso',
  templateUrl: './dialog-curso.component.html',
  styleUrls: ['./dialog-curso.component.scss'],
})
export class DialogCursoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogCursoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  curso!: Curso;
  cursos: Curso[] = [];
  idCursos: number[] = [];

  //Form
  cursoForm!: FormGroup;

  ngOnInit() {
    this.cursoForm = this.fb.group({
      curso: this.fb.array([
        // cargo primera fila al comenzar
        this.getCurso(),
      ]),
    });
  }

  get cursosArray(): FormArray {
    return this.cursoForm.get('curso') as FormArray;
  }
  private getCurso() {
    return this.fb.group({
      nombre: [this.data.nombre_capacitacion || '', Validators.required],
      fechaRealizacion: [this.data.fecha_realizacion || '', Validators.required],
      descripcion: [this.data.descripcion || ''],
      centro: [this.data.centro_formador || '', Validators.required],
      imageFront: [this.data.imagen_certificado || ''],
    });
  }

  addCurso(): void {
    const control = <FormArray>this.cursoForm.controls['curso'];
    control.push(this.getCurso());
  }

  removeCurso(i: number): void {
    const control = <FormArray>this.cursoForm.controls['curso'];
    control.removeAt(i);
  }

  onSaveCursos() {
    this.guardarCursosLocal();

    if (this.cursos.length > 0) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  guardarCursosLocal(): void {
    for (const ti of this.cursosArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setCursoForm(ti);
      }
    }
    if (localStorage.getItem('cursos') === null) {
      localStorage.setItem('cursos', JSON.stringify(this.cursos));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('cursos') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.cursos = [...data, ...this.cursos];
      localStorage.removeItem('cursos');
      localStorage.setItem('cursos', JSON.stringify(this.cursos));
    } else {
      let cursos: Curso[] = JSON.parse(localStorage.getItem('cursos') || '{}');
      this.cursos = [...cursos, ...this.cursos];
      localStorage.setItem('cursos', JSON.stringify(this.cursos));
    }
  }

  setCursoForm(ti: AbstractControl) {
    this.curso = new Curso();
    this.curso.id = this.data.id || 0;
    this.curso.nombre_capacitacion = ti.get('nombre')?.value;
    this.curso.fecha_realizacion = formatDate(ti.get('fechaRealizacion')?.value, 'yyyy-MM-dd', 'en-US');
    this.curso.descripcion = ti.get('descripcion')?.value;
    this.curso.centro_formador = ti.get('centro')?.value;
    this.curso.imagen_certificado = ti.get('imageFront')?.value != null ? ti.get('imageFront')?.value : '';

    this.cursos.push(this.curso);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event: any, index: number, type: string) {
    const file = event.target.files[0];
    this.convertFile(file).subscribe((base64) => {
      switch (type) {
        case 'front':
          this.cursosArray.at(index).patchValue({ imageFront: file.name });
          this.cursosArray.at(index).patchValue({ imageFrontB64: base64 });
          break;
      }

      this.cursosArray.at(index).updateValueAndValidity();
      this.cursosArray.at(index).markAsDirty();
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

  openFile(): void {
    window.open(this.data.imagen_certificado_name);
  }
}
