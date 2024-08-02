export class QrData {
  fecha_pago!: Date;
  documento!: string;
  matricula!: string;
  nombre!: string;
}

export interface IQrData {
  fecha_pago: Date;
  documento: string;
}
