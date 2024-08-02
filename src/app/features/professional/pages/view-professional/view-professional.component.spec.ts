import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfessionalComponent } from './view-professional.component';

describe('ViewProfessionalComponent', () => {
  let component: ViewProfessionalComponent;
  let fixture: ComponentFixture<ViewProfessionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfessionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
