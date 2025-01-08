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
          type: 'bar', // Changer le type en 'bar' pour un diagramme en barre
          data: {
            labels: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan'], // Exemple de jours
            datasets: [{
              label: 'Nombre de personnes pointées',
              data: [20, 40, 30, 50, 60], // Remplacez ces données par le nombre de personnes pointées par jour
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Couleur des barres
              borderColor: '#36A2EB', // Couleur des bordures des barres
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { 
                beginAtZero: true, // L'axe Y commence à zéro
                title: { display: true, text: 'Nombre de personnes' }
              },
              x: { 
                title: { display: true, text: 'Jour' }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      } else {
        console.error('Erreur : Contexte du canvas introuvable.');
      }
    }
  }
}
