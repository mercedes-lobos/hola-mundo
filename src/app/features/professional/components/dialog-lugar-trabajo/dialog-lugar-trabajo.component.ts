import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LugarTrabajo } from '../../models/lugar-trabajo.model';

@Component({
  selector: 'app-dialog-lugar-trabajo',
  templateUrl: './dialog-lugar-trabajo.component.html',
  styleUrls: ['./dialog-lugar-trabajo.component.scss'],
})
export class DialogLugarTrabajoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogLugarTrabajoComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  //Variables
  lugarTrabajo!: LugarTrabajo;
  lugaresTrabajo: LugarTrabajo[] = [];
  //Form
  lugarTrabajoForm!: FormGroup;

  ngOnInit() {
    this.lugarTrabajoForm = this.fb.group({
      lugarTrabajo: this.fb.array([
        // cargo primera fila al comenzar
        this.getLugarTrabajo(),
      ]),
    });
  }

  get lugaresTrabajoArray(): FormArray {
    return this.lugarTrabajoForm.get('lugarTrabajo') as FormArray;
  }

  private getLugarTrabajo() {
    return this.fb.group({
      nombre: [this.data.nombre || '', Validators.required],
      sector: [this.data.sector || '', Validators.required],
    });
  }

  addLugarTrabajo(): void {
    const control = <FormArray>this.lugarTrabajoForm.controls['lugarTrabajo'];
    control.push(this.getLugarTrabajo());
  }

  removeLugarTrabajo(i: number): void {
    const control = <FormArray>this.lugarTrabajoForm.controls['lugarTrabajo'];
    control.removeAt(i);
  }

  onSaveLugarTrabajo() {
    this.guardarLugaresTrabajoLocal();

    if (this.lugaresTrabajo.length > 0) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  guardarLugaresTrabajoLocal(): void {
    for (const ti of this.lugaresTrabajoArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setLugarTrabajoForm(ti);
      }
    }
    if (localStorage.getItem('lugarTrabajo') === null) {
      localStorage.setItem('lugarTrabajo', JSON.stringify(this.lugaresTrabajo));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('lugarTrabajo') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.lugaresTrabajo = [...data, ...this.lugaresTrabajo];
      localStorage.removeItem('lugarTrabajo');
      localStorage.setItem('lugarTrabajo', JSON.stringify(this.lugaresTrabajo));
    } else {
      let lugaresTrabajo: LugarTrabajo[] = JSON.parse(localStorage.getItem('lugarTrabajo') || '{}');
      this.lugaresTrabajo = [...lugaresTrabajo, ...this.lugaresTrabajo];
      localStorage.setItem('lugarTrabajo', JSON.stringify(this.lugaresTrabajo));
    }
  }

  setLugarTrabajoForm(ti: AbstractControl) {
    this.lugarTrabajo = new LugarTrabajo();
    this.lugarTrabajo.id = this.data.id || 0;
    this.lugarTrabajo.nombre = ti.get('nombre')?.value;
    this.lugarTrabajo.sector = ti.get('sector')?.value;

    this.lugaresTrabajo.push(this.lugarTrabajo);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
