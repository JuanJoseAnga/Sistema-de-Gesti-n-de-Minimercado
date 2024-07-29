import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresComponent } from './pooveedores.component';

describe('ProoverdoresComponent', () => {
  let component:ProveedoresComponent;
  let fixture: ComponentFixture<ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
