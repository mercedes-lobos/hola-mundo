import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewValidacionQrComponent } from './view-validacion-qr.component';

describe('ViewValidacionQrComponent', () => {
  let component: ViewValidacionQrComponent;
  let fixture: ComponentFixture<ViewValidacionQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewValidacionQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewValidacionQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
