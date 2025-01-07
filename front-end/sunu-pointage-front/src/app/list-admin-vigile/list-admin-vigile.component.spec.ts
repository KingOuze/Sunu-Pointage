import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdminVigileComponent } from './list-admin-vigile.component';

describe('ListAdminVigileComponent', () => {
  let component: ListAdminVigileComponent;
  let fixture: ComponentFixture<ListAdminVigileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAdminVigileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAdminVigileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
