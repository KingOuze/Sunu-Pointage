import { Component, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-attendance-chart',
  standalone: true,
  template: `
    <div>
      <h3>Historique des Pointages</h3>
      <canvas #attendanceChart></canvas>
    </div>
  `,
  styles: [`
    canvas {
      width: 100% !important;
      height: 400px !important;
    }
  `]
})
export class AttendanceChartComponent implements AfterViewInit {
  @ViewChild('attendanceChart') attendanceChart!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit() {
    // Vérifiez si l'application est exécutée côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      const ctx = this.attendanceChart.nativeElement.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['01 Aug', '02 Aug', '03 Aug', '04 Aug', '05 Aug'],
            datasets: [{
              label: 'Pointages quotidiens',
              data: [20, 40, 30, 50, 60],
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true },
              x: { grid: { display: false } }
            }
          }
        });
      } else {
        console.error('Erreur : Contexte du canvas introuvable.');
      }
    }
  }
}
