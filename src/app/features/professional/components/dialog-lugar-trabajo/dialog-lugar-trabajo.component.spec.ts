import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLugarTrabajoComponent } from './dialog-lugar-trabajo.component';

describe('DialogLugarTrabajoComponent', () => {
  let component: DialogLugarTrabajoComponent;
  let fixture: ComponentFixture<DialogLugarTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLugarTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogLugarTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
