import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCardComponent } from './time-card.component';

describe('TimeCardComponent', () => {
  let component: TimeCardComponent;
  let fixture: ComponentFixture<TimeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
