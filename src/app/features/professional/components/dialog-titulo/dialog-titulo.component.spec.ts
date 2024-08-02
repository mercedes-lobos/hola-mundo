import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTituloComponent } from './dialog-titulo.component';

describe('DialogTituloComponent', () => {
  let component: DialogTituloComponent;
  let fixture: ComponentFixture<DialogTituloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTituloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
