import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-time-card',
  standalone: true,
  template: `
    <div class="time-card">
      <h3>Heure Actuelle</h3>
      <p>{{ currentTime }}</p>
    </div>
  `,
  styles: [`
    .time-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      background-color: #f9f9f9;
    }
  `]
})
export class TimeCardComponent implements OnInit {
  currentTime: string = '';

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => {
      this.ngZone.run(() => this.updateTime());
    }, 1000);
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }
}