import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDatosBancariosComponent } from './dialog-datos-bancarios.component';

describe('DialogDatosBancariosComponent', () => {
  let component: DialogDatosBancariosComponent;
  let fixture: ComponentFixture<DialogDatosBancariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDatosBancariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDatosBancariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
