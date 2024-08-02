import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistroPagoComponent } from './dialog-registro-pago.component';

describe('DialogRegistroPagoComponent', () => {
  let component: DialogRegistroPagoComponent;
  let fixture: ComponentFixture<DialogRegistroPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistroPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRegistroPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
