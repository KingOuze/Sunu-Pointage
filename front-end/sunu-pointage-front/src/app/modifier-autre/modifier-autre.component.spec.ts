import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAutreComponent } from './modifier-autre.component';

describe('ModifierAutreComponent', () => {
  let component: ModifierAutreComponent;
  let fixture: ComponentFixture<ModifierAutreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierAutreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierAutreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
