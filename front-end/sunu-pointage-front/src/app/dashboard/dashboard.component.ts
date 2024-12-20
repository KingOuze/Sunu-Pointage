import { Component } from '@angular/core';
import { ClockComponent } from '../clock/clock.component';
import { DoorAccessComponent } from '../door-access/door-access.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ClockComponent,DoorAccessComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
