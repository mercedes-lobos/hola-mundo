import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDatosBancariosGComponent } from './dialog-datos-bancarios-g.component';

describe('DialogDatosBancariosGComponent', () => {
  let component: DialogDatosBancariosGComponent;
  let fixture: ComponentFixture<DialogDatosBancariosGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDatosBancariosGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDatosBancariosGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
