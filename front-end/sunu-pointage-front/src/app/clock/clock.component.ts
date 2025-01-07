import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  today: Date;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    // Définit une date statique si SSR
    this.today = isPlatformServer(this.platformId) ? new Date('2024-01-01') : new Date();
  }

  ngOnInit(): void {
    // Met à jour la date côté client uniquement
    if (!isPlatformServer(this.platformId)) {
      setInterval(() => {
        this.today = new Date(); // Met à jour l'heure actuelle
      }, 1000); // Met à jour chaque seconde
    }
  }
}