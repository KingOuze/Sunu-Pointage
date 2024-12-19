import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekTrendComponent } from './week-trend.component';

describe('WeekTrendComponent', () => {
  let component: WeekTrendComponent;
  let fixture: ComponentFixture<WeekTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
