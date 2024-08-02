import { Observable, forkJoin, ReplaySubject } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { RegistroPago } from '../../models/registro-pago.model';
import { Concepto } from '../../models/concepto.model';
import { Periodo } from '../../models/periodo.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { StorageService } from 'src/app/services/storage.service';
import { ConceptoTable } from '../../models/tables/concepto-table.model';
import { PeriodoTable } from '../../models/tables/periodo-table.model';
import { formatDate } from '@angular/common';
import { MesPago } from '../../models/consts/mes-pago.const';
import { ImageCropperComponent } from '../../../../shared/components/image-cropper/image-cropper.component';

@Component({
  selector: 'app-dialog-registro-pago',
  templateUrl: './dialog-registro-pago.component.html',
  styleUrls: ['./dialog-registro-pago.component.scss'],
})
export class DialogRegistroPagoComponent implements OnInit {
  registroPagoForm!: FormGroup;
  registroPago!: RegistroPago;
  registrosPago: RegistroPago[] = [];
  listConceptos: Concepto[] = [];
  listPeriodos: Periodo[] = [];

  id!: number;
  idProfesional!: number;
  periodoId!: number;
  conceptoId!: number;
  listMesPago = MesPago;

  filteredPeriodo: Observable<Periodo[]> | undefined;
  filteredConcepto: Observable<Concepto[]> | undefined;

  selectedConcept!: number;
  selectedAmount!: number;
  currentDate = new FormControl(new Date());
  constructor(
    public dialogRef: MatDialogRef<DialogRegistroPagoComponent>,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.id = this.storageService.getUser().user.id;
    this.idProfesional = this.storageService.getUser().profesional.id;

    const concepto$ = this.paymentService.getAllConcepto();
    const periodo$ = this.paymentService.getAllPeriodo();

    forkJoin([concepto$, periodo$]).subscribe({
      next: (res) => {
        this.listConceptos = (res[0] as unknown as ConceptoTable).results;
        this.listPeriodos = (res[1] as unknown as PeriodoTable).results;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.registroPagoForm = this.fb.group({
          // TODO: Revisar el tema del array, no hace falta. Modifcar acá y en html.
          registroPago: this.fb.array([this.getRegistroPago()]),
        });
      },
    });
  }

  get registrosPagoArray(): FormArray {
    return this.registroPagoForm.get('registroPago') as FormArray;
  }

  private getRegistroPago() {
    return this.fb.group({
      fecha_registro: [this.currentDate.value || '', Validators.required],
      periodo: [this.data.periodo || '', Validators.required],
      monto: [this.data.monto || '', Validators.required],
      concepto: [this.data.concepto || '', Validators.required],
      observacion: [this.data.observacion || ''],
      comprobante: [this.data.comprobante || '', Validators.required],
      mes_pago: [this.data.mes_pago || '', Validators.required],
    });
  }

  onSaveRegistroPago() {
    this.registroPagoForm.markAllAsTouched();
    this.guardarRegistroPagoLocal();

    const registroPago: RegistroPago = {
      fecha_registro: formatDate(this.registroPago.fecha_registro, 'yyyy-MM-dd', 'en-US'),
      periodo: this.registroPago.periodo,
      monto: this.registroPago.monto,
      concepto: this.registroPago.concepto,
      observacion: this.registroPago.observacion,
      comprobante: this.registroPago.comprobante,
      mes_pago: this.registroPago.mes_pago,
      user: this.id,
      profesional: this.idProfesional,
    };

    this.paymentService.postRegistroPagos(registroPago).subscribe({
      next: (res) => {
        //console.log(res);
      },
      error: (err) => {
        if (err.error.non_field_errors) {
          this.notification('Error', 'Ya existe un registro de pago para este periodo con este concepto', 'error');
        } else if(err.status !== 401) {
          this.notification('Error', 'Error al guardar Registro de Pago', 'error');
        }

        console.log(err);
      },
      complete: () => {
        console.log('complete');
        this.dialogRef.close(true);
      },
    });
  }

  guardarRegistroPagoLocal(): void {
    for (const ti of this.registrosPagoArray.controls) {
      if (!ti.invalid && ti.dirty) {
        this.setRegistroPagoForm(ti);
      }
    }
    if (localStorage.getItem('registrosPago') === null) {
      localStorage.setItem('registrosPago', JSON.stringify(this.registrosPago));
    } else if (this.data.rowId >= 0) {
      const data = JSON.parse(localStorage.getItem('registrosPago') || '{}');
      const editado = data[this.data.rowId];
      const index = data.indexOf(editado);
      data.splice(index, 1);
      this.registrosPago = [...data, ...this.registrosPago];
      localStorage.removeItem('registrosPago');
      localStorage.setItem('registrosPago', JSON.stringify(this.registrosPago));
    } else {
      let registrosPago: RegistroPago[] = JSON.parse(localStorage.getItem('registrosPago') || '{}');
      this.registrosPago = [...registrosPago, ...this.registrosPago];
      localStorage.setItem('registrosPago', JSON.stringify(this.registrosPago));
    }
  }

  setRegistroPagoForm(ti: AbstractControl) {
    this.registroPago = new RegistroPago();
    this.registroPago.id = this.data.id || 0;
    this.registroPago.fecha_registro = formatDate(ti.get('fecha_registro')?.value, 'yyyy-MM-dd', 'en-US');
    this.registroPago.periodo = ti.get('periodo')?.value;
    this.registroPago.monto = ti.get('monto')?.value;
    this.registroPago.concepto = ti.get('concepto')?.value;
    this.registroPago.observacion = ti.get('observacion')?.value;
    this.registroPago.comprobante = ti.get('comprobante')?.value != null ? ti.get('comprobante')?.value : '';
    this.registroPago.mes_pago = ti.get('mes_pago')?.value;
    this.registroPago.user = this.id;
    this.registroPago.profesional = this.idProfesional;

    this.registrosPago.push(this.registroPago);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  uploadFile(event: any, index: number, type: string) {
    const file = event.target.files[0];
    this.convertFile(file).subscribe((base64) => {
      switch (type) {
        case 'comprobante':
          this.registrosPagoArray.at(index).patchValue({ comprobante: file.name });
          this.registrosPagoArray.at(index).patchValue({ comprobanteB64: base64 });
          break;
      }

      this.registrosPagoArray.at(index).updateValueAndValidity();
      this.registrosPagoArray.at(index).markAsDirty();
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
    window.open(this.data.url_comprobante);
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }

  onSelectChange() {
    const concepto = this.registrosPagoArray.controls[0].get('concepto')?.value;
    this.selectedAmount = this.listConceptos.find((c) => c.id == concepto)?.costo || 0;
    this.registrosPagoArray.controls[0].patchValue({ monto: this.selectedAmount });
  }
}
