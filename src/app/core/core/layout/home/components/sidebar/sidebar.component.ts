import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MenuItems } from 'src/app/config/menu-items.config';
import { ProfessionalService } from 'src/app/services/professional.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
})
export class SidebarComponent implements OnDestroy {
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;
  profesionalId!: number;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private storageService: StorageService,
    private profesionalService: ProfessionalService,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.profesionalId = this.storageService.getUser().profesional.id;
    // this.mobileQuery.addListener(this._mobileQueryListener);
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  downloadCMatricula(): void {
    const fileName = `certificado_matricula.pdf`;
    this.profesionalService.postCertificadoMatricula().subscribe({
      next: (res) => {
        this.managePdfFile(res, fileName);
      },
      error: (err) => {
        console.error(err);

        if (err.status == 400) {
          this.notification('', 'El profesional tiene pagos pendientes.', 'error');
        } else if (err.status !== 401) {
          this.notification('', 'No se pudo descargar el archivo.', 'info');
        }
      }
    })
  }

  downloadCEtica(): void {
    const fileName = `certificado_etica.pdf`;
    this.profesionalService.postCertificadoEtica().subscribe({
      next: (res) => {
        this.managePdfFile(res, fileName);
      },
      error: (err) => {
        console.error(err);

        if (err.status == 400) {
          this.notification('', 'El profesional tiene pagos pendientes.', 'error');
        } else if (err.status !== 401) {
          this.notification('', 'No se pudo descargar el archivo.', 'info');
        }
      }
    })
  }

  downloadLibreDeuda(): void {
    const fileName = `certificado_libre_deuda.pdf`;
    this.profesionalService.postLibreDeuda().subscribe({
      next: (res) => {
        this.managePdfFile(res, fileName);
      },
      error: (err) => {
        console.error(err);

        if (err.status == 400) {
          this.notification('', 'El profesional tiene pagos pendientes.', 'error');
        } else if (err.status !== 401) {
          this.notification('', 'No se pudo descargar el archivo.', 'info');
        }
      }
    })
  }

  managePdfFile(response: any, fileName: string): void {
    const pdfData = [];
    pdfData.push(response);

    const filterPath = window.URL.createObjectURL(new Blob(pdfData, {type: 'application/pdf'}));
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', fileName);
    downloadLink.href = filterPath;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  notification(titulo: string, msg: string, tipo: SweetAlertIcon) {
    Swal.fire(titulo, msg, tipo);
  }
}
