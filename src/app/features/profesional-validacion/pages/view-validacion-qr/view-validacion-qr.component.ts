import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { IQrData, QrData } from '../../models/qr-data.model';
import { ProfesionalValidacionService } from 'src/app/services/profesional-validacion.service';

@Component({
  selector: 'app-view-validacion-qr',
  templateUrl: './view-validacion-qr.component.html',
  styleUrls: ['./view-validacion-qr.component.scss'],
})
export class ViewValidacionQrComponent implements OnInit {

  qrData!: QrData;

  constructor(private route: ActivatedRoute, private profesionalValidacionService: ProfesionalValidacionService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe({
      next: (params) => {
        this.qrData = params as QrData;
        const qrConsulta = {
          fecha_pago: params['fecha_pago'],
          documento: params['documento'],
        };
        this.validarQr(qrConsulta);
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          position: 'bottom',
          icon: 'error',
          title: 'Error',
          text: 'Error al leer el código QR',
          showConfirmButton: true,
        });
      }
    })
  }

  validarQr(qrConsulta: IQrData) {
    let errorMsg = '';
    try {
      this.profesionalValidacionService.postProfesional(qrConsulta).subscribe({
        next: (response) => {
          if (response.valid) {
            Swal.fire({
              position: 'bottom',
              icon: 'success',
              title: 'Codigo QR VALIDO',
              html:
                'Profesional encontrado<br>Nombre: ' +
                response.profesional.nombre_completo +
                '<br>' +
                'Matrícula: ' +
                response.profesional.matricula +
                '<br>' +
                'Documento: ' +
                response.profesional.documento +
                '<br>',
              showConfirmButton: true,
            });
          } else {
            Swal.fire({
              position: 'bottom',
              icon: 'error',
              title: 'QR no válido',
              showConfirmButton: true,
            });
          }
        },
        error: (err) => {
          errorMsg = err.error.error + '<br>';
          Swal.fire({
            position: 'bottom',
            icon: 'error',
            title: errorMsg,
            showConfirmButton: true,
          });
        },
      });
    } catch (error) {
      errorMsg += error;
      Swal.fire({
        position: 'bottom',
        icon: 'error',
        title: 'Error',
        text: errorMsg,
        showConfirmButton: true,
      });
    }
  }
}
