import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDireccionComponent } from './dialog-direccion.component';

describe('DialogDireccionComponent', () => {
  let component: DialogDireccionComponent;
  let fixture: ComponentFixture<DialogDireccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDireccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
