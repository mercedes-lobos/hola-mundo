import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { RegistroPago } from './models/registro-pago.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { DialogRegistroPagoComponent } from './components/dialog-registro-pago/dialog-registro-pago.component';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MesPago } from './models/consts/mes-pago.const';
import { DialogDatosBancariosComponent } from './components/dialog-datos-bancarios/dialog-datos-bancarios.component';
import { DialogDatosBancariosGComponent } from './components/dialog-datos-bancarios-g/dialog-datos-bancarios-g.component';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit {
  constructor(
    private paymentService: PaymentService,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private storageService: StorageService
  ) {}

  displayedColumns: string[] = ['fecha_registro', 'periodo', 'concepto', 'mes_pago', 'monto', 'estado_pago', 'action'];
  registrosPago: RegistroPago[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  offSet = 0;
  previusOffset = 0;
  nextOffset = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 100];

  userId!: number;
  listMesPago = MesPago;

  hasRegistrosPago: boolean = false;

  registrosDataSource: MatTableDataSource<RegistroPago> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.registrosDataSource.paginator = this.paginator;
    this.loadData();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.userId = this.storageService.getUser().user.id;
  }

  loadData() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.paymentService
            .getRegistroPagos(this.userId, this.offSet, this.paginator.pageSize)
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          this.paginator.pageIndex = this.currentPage;
          if (data === null) {
            return [];
          }
          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.nextOffset = Number(data.next ? data.next.split('offset=')[1] : 0);
          this.previusOffset = Number(data.previous ? data.previous.split('offset=')[1] : 0);
          this.resultsLength = data.count;
          return data.results;
        })
      )
      .subscribe({
        next: (res) => {
          this.registrosPago = res;
          localStorage.setItem('registrosPago', JSON.stringify(this.registrosPago));
        }
      })
  }

  pageChanged(event: PageEvent) {
    const previous = event.previousPageIndex || 0;
    if (event.pageIndex > previous) {
      this.offSet = this.nextOffset;
    } else {
      this.offSet = this.previusOffset;
    }
    this.paginator.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }

  openRegistroPagoDialog(data?: RegistroPago): void {
    const dialogRef = this.dialog.open(DialogRegistroPagoComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      data: data || {},
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.notification('Registro de Pago', 'Guardado exitosamente.', 'success');
        this.loadData();
      }
    });
  }

  openDatosDialog(): void {
    const dialogRef = this.dialog.open(DialogDatosBancariosComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      autoFocus: false,
    });
  }

    openDatosGDialog(): void {
    const dialogRef = this.dialog.open(DialogDatosBancariosGComponent, {
      panelClass: '.modal-responsive',
      minWidth: '40%',
      autoFocus: false,
    });
  }

  deleteRow(key: string, id: number) {
    Swal.fire({
      title: 'Está seguro/a?',
      text: "El registro se eliminará.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        const registroId = this.registrosPago[id].id  || 0;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        data.splice(id, 1);
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(data));

        this.paymentService.deleteRegistroPago(registroId).subscribe({
          next: () => {
            console.log('delete');
          }
        })

        Swal.fire({
          title: 'Eliminado!',
          text: 'El registro ha sido eliminado.',
          icon: 'success',
        }).finally(() => {
          this.loadData();
        });
      }
    });
  }

  getMesPago(id: number) {
    const mesPago = this.listMesPago.find((mesPago) => mesPago.id == id);
    return mesPago?.label;
  }

  //Notificaciones
  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
