import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerCarteComponent } from './assigner-carte.component';

describe('AssignerCarteComponent', () => {
  let component: AssignerCarteComponent;
  let fixture: ComponentFixture<AssignerCarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignerCarteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignerCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
