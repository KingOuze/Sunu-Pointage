import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVigile } from './dashboard-vigile.component';

describe('DashboardVigile', () => {
  let component: DashboardVigile;
  let fixture: ComponentFixture<DashboardVigile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVigile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVigile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
