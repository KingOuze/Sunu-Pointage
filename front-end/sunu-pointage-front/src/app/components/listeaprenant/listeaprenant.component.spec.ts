import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeaprenantComponent } from './listeaprenant.component';

describe('ListeaprenantComponent', () => {
  let component: ListeaprenantComponent;
  let fixture: ComponentFixture<ListeaprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeaprenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeaprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
