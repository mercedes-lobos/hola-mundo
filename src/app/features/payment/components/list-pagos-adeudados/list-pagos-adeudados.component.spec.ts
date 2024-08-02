import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPagosAdeudadosComponent } from './list-pagos-adeudados.component';

describe('ListPagosAdeudadosComponent', () => {
  let component: ListPagosAdeudadosComponent;
  let fixture: ComponentFixture<ListPagosAdeudadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPagosAdeudadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPagosAdeudadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
