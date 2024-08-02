import { ChangeDetectorRef, Component } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { Pago } from '../../models/pago.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-list-pagos-adeudados',
  templateUrl: './list-pagos-adeudados.component.html',
  styleUrls: ['./list-pagos-adeudados.component.scss']
})
export class ListPagosAdeudadosComponent {
  constructor(
    private paymentService: PaymentService
  ) {}

  displayedColumns: string[] = ['fecha_vencimiento', 'periodo', 'mes', 'monto', 'estado', 'observacion'];
  data: Pago[] = [];
  dataSource: any = [];

  ngOnInit() {
    this.paymentService.getPagosAdeudados().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.log(error);
        if (error.status !== 401) {
          this.notification('Error', 'Error al acceder a los pagos adeudados.', 'error');
        }
      }
    });
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
