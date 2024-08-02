import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadImageCropperComponent } from './load-image-cropper.component';

describe('LoadImageCropperComponent', () => {
  let component: LoadImageCropperComponent;
  let fixture: ComponentFixture<LoadImageCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadImageCropperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
