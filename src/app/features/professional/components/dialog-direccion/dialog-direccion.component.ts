import { Direccion } from './../../models/direccion.model';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfessionalService } from 'src/app/services/professional.service';
import { Provincia } from '../../models/provincia.model';
import { Pais } from '../../models/pais.model';
import { NEVER, Observable, forkJoin, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Departamento } from '../../models/departamento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-direccion',
  templateUrl: './dialog-direccion.component.html',
  styleUrls: ['./dialog-direccion.component.scss'],
})
export class DialogDireccionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogDireccionComponent>,
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  //Variables
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  paises: Pais[] = [];
  direccion!: Direccion;
  direcciones: Direccion[] = [];
  //Form
  direccionForm!: FormGroup;

  filteredDepartamento: (Observable<Departamento[]> | undefined)[] = [];
  filteredPais: (Observable<Pais[]> | undefined)[] = [];
  filteredProvincia: (Observable<Provincia[]> | undefined)[] = [];

  ngOnInit() {

    const paises$ = this.professionalService.getPais();
    const provincias$ = this.professionalService.getProvincia();
    const departamentos$ = this.professionalService.getDepartamento();

    forkJoin([paises$, provincias$, departamentos$]).subscribe({
      next: (res) => {
        this.paises = res[0];
        this.provincias = res[1];
        this.departamentos = res[2];
      },
      error: (e) => {
        console.error(e);
        if (e.status !== 401) {
          Swal.fire('Error', 'Error al cargar los datos.', 'error');
        }

      },
      complete: () => {
        this.direccionForm = this.fb.group({
          direccion: this.fb.array([
            // cargo primera fila al comenzar
            this.getDireccion(),
          ]),
        });

        if (Object.keys(this.data).length === 0) {
          this.direccionesArray.controls[0].get('pais')?.setValue('Argentina', { emitEvent: true });
          this.direccionesArray.controls[0].get('provincia')?.setValue('La Rioja', { emitEvent: true });
          this.direccionesArray.controls[0].get('departamento')?.setValue('Capital', { emitEvent: true });

          this.filteredPais[0] = this.direccionesArray.controls[0].get('pais')?.valueChanges.pipe(
            startWith('Argentina'),
            map((value) => this.filterPais(value || ''))
          );
          this.direccionesArray.controls[0].get('provincia')?.enable();
          this.filteredProvincia[0] = this.direccionesArray.controls[0].get('provincia')?.valueChanges.pipe(
            startWith('La Rioja'),
            map((value) => this.filterProvincia(value || ''))
          );
          this.direccionesArray.controls[0].get('departamento')?.enable();
          this.filteredDepartamento[0] = this.direccionesArray.controls[0].get('departamento')?.valueChanges.pipe(
            startWith('Capital'),
            map((value) => this.filterDepartamento(value || ''))
          );
        } else {
          const pais = this.paises.find((pais) => pais.id == this.data.pais);
          const provincia = this.provincias.find((provincia) => provincia.id == this.data.provincia);
          const departamento = this.departamentos.find((depto) => depto.id == this.data.departamento);

          if (pais?.nombre !== 'Argentina') {
            this.direccionesArray.controls[0].get('pais')?.setValue(pais?.nombre);
            this.direccionesArray.controls[0].get('provincia')?.disable();
            this.direccionesArray.controls[0].get('departamento')?.disable();

            this.filteredPais[0] = this.direccionesArray.controls[0].get('pais')?.valueChanges.pipe(
              startWith(pais?.nombre),
              map((value) => this.filterPais(value || ''))
            );
            this.filteredProvincia[0] = NEVER;
          } else {
            this.direccionesArray.controls[0].get('pais')?.setValue(pais?.nombre);
            this.direccionesArray.controls[0].get('provincia')?.enable();
            this.direccionesArray.controls[0].get('provincia')?.setValue(provincia?.iso_nombre);
            this.direccionesArray.controls[0].get('departamento')?.enable();
            this.direccionesArray.controls[0].get('departamento')?.setValue(departamento?.nombre);

            this.filteredPais[0] = this.direccionesArray.controls[0].get('pais')?.valueChanges.pipe(
              startWith(pais?.nombre),
              map((value) => this.filterPais(value || ''))
            );

            this.filteredProvincia[0] = this.direccionesArray.controls[0].get('provincia')?.valueChanges.pipe(
              startWith(provincia?.iso_nombre),
              map((value) => this.filterProvincia(value || ''))
            );

            this.filteredDepartamento[0] = this.direccionesArray.controls[0].get('departamento')?.valueChanges.pipe(
              startWith(departamento?.nombre),
              map((value) => this.filterDepartamento(value || ''))
            );
          }
        }
      },
    });
  }

  get direccionesArray(): FormArray {
    return this.direccionForm.get('direccion') as FormArray;
  }

  private filterDepartamento(value: string): Departamento[] {
    const filterValue = value.toLowerCase();
    return this.departamentos.filter((departamento) => departamento.nombre.toLowerCase().includes(filterValue));
  }

  private filterPais(value: string): Pais[] {
    const filterValue = value.toLowerCase();
    return this.paises.filter((pais) => pais.nombre.toLowerCase().includes(filterValue));
  }

  private filterProvincia(value: string): Provincia[] {
    const filterValue = value.toLowerCase();
    return this.provincias.filter((prov) => prov.nombre_completo.toLowerCase().includes(filterValue));
  }

  updatePaisId(i: number, event: MatAutocompleteSelectedEvent): void {
    const pais = this.paises.find((pais) => pais.nombre === event.option.value);
    this.paises[i].id = pais?.id || 0;
    if (event.option.value != 'Argentina') {
      this.filteredProvincia[i] = NEVER;
      this.direccionesArray.controls[i].get('provincia')?.setValue('');
      this.direccionesArray.controls[i].get('provincia')?.disable();
      this.direccionesArray.controls[i].get('provincia')?.clearValidators();
      this.direccionesArray.controls[i].get('provincia')?.updateValueAndValidity();
      this.filteredDepartamento[i] = NEVER;
      this.direccionesArray.controls[i].get('departamento')?.setValue('');
      this.direccionesArray.controls[i].get('departamento')?.disable();
      this.direccionesArray.controls[i].get('departamento')?.clearValidators();
      this.direccionesArray.controls[i].get('departamento')?.updateValueAndValidity();
    } else {
      this.filteredProvincia[i] = this.direccionesArray.controls[i].get('provincia')?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterProvincia(value || ''))
      );
      this.direccionesArray.controls[i].get('provincia')?.enable();
      this.direccionesArray.controls[i].get('provincia')?.setValidators([Validators.required]);
      this.direccionesArray.controls[i].get('provincia')?.updateValueAndValidity();
      this.filteredDepartamento[i] = this.direccionesArray.controls[i].get('departamento')?.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDepartamento(value || ''))
      );
      this.direccionesArray.controls[i].get('departamento')?.enable();
      this.direccionesArray.controls[i].get('departamento')?.setValidators([Validators.required]);
      this.direccionesArray.controls[i].get('departamento')?.updateValueAndValidity();
    }
  }
  updateProvinciaId(i: number, event: MatAutocompleteSelectedEvent): void {
    const provincia = this.provincias.find((prov) => prov.iso_nombre === event.option.value);
    this.provincias[i].id = provincia?.id || 0;
  }
  updateDepartamentoId(i: number, event: MatAutocompleteSelectedEvent): void {
    const departamento = this.departamentos.find((departamento) => departamento.nombre === event.option.value);
    this.departamentos[i].id = departamento?.id || 0;
  }

  private getDireccion() {
    const departamento = this.departamentos.find((departamento) => departamento.id == this.data.departamento);
    let provincia: Provincia | undefined;
    const pais = this.paises.find((pais) => pais.id == this.data.pais);
    if (this.data.provincia != null) provincia = this.provincias.find((prov) => prov.id == this.data.provincia);

    return this.fb.group({
      tipo_direccion: [this.data.tipo_direccion || '', Validators.required],
      calle: [this.data.calle || '', Validators.required],
      numero: [this.data.numero || '', Validators.required],
      piso: [this.data.piso || ''],
      numero_departamento: [this.data.numero_departamento || ''],
      codigo_postal: [this.data.codigo_postal || '', Validators.required],
      localidad: [this.data.localidad || '', Validators.required],
      departamento: [departamento?.nombre || '', Validators.required],
      pais: [pais?.nombre || '', Validators.required],
      provincia: [provincia?.iso_nombre || ''],
    });
  }

  addDireccion(): void {
    const control = <FormArray>this.direccionForm.controls['direccion'];
    control.push(this.getDireccion());
  }

  removeDireccion(i: number): void {
    const control = <FormArray>this.direccionForm.controls['direccion'];
    control.removeAt(i);
  }

  onSaveDireccion() {
    this.guardarDireccionesLocal();

    if (this.direcciones.length > 0) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close();
    }
  }

  guardarDireccionesLocal(): void {
    for (const ti of this.direccionesArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setDireccionForm(ti);
      }
    }
    if (localStorage.getItem('direcciones') === null) {
      localStorage.setItem('direcciones', JSON.stringify(this.direcciones));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('direcciones') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.direcciones = [...data, ...this.direcciones];
      localStorage.removeItem('direcciones');
      localStorage.setItem('direcciones', JSON.stringify(this.direcciones));
    } else {
      let direcciones: Direccion[] = JSON.parse(localStorage.getItem('direcciones') || '{}');
      this.direcciones = [...direcciones, ...this.direcciones];
      localStorage.setItem('direcciones', JSON.stringify(this.direcciones));
    }
  }

  setDireccionForm(ti: AbstractControl) {
    const pais = this.paises.find((pais) => pais.nombre === ti.get('pais')?.value);
    const provincia = this.provincias.find((prov) => prov.iso_nombre === ti.get('provincia')?.value);
    const departamento = this.departamentos.find(
      (departamento) => departamento.nombre === ti.get('departamento')?.value
    );

    this.direccion = new Direccion();
    this.direccion.id = this.data.id || 0;
    this.direccion.tipo_direccion = ti.get('tipo_direccion')?.value;
    this.direccion.calle = ti.get('calle')?.value;
    this.direccion.numero = ti.get('numero')?.value;
    this.direccion.piso = ti.get('piso')?.value;
    this.direccion.numero_departamento = ti.get('numero_departamento')?.value;
    this.direccion.codigo_postal = ti.get('codigo_postal')?.value;
    this.direccion.localidad = ti.get('localidad')?.value;
    this.direccion.departamento = departamento?.id || 0;
    this.direccion.pais = pais?.id || 0;
    this.direccion.provincia = provincia?.id || null;

    this.direcciones.push(this.direccion);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
