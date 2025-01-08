 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {  Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  role: string; // Rôle de l'utilisateur (admin, vigile, etc.)*
  valid?: boolean; 
  username?:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL de votre backend

  constructor(private http: HttpClient, private router: Router) { }

  // Connexion avec email et mot de passe
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Sauvegarde du token et du rôle dans le localStorage
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
          }
        })
      );
  }

  // Connexion via UID (carte RFID)
  loginWithUID(uid: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login-with-uid`, { uid })
      .pipe(
        tap(response => {
          // Sauvegarde du token et du rôle dans le localStorage
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
          }
        })
      );
  }

  // Méthode pour déconnecter l'utilisateur// Dans auth.service.ts
logout(): Observable<any> {
  return this.http.post('/api/logout', {}).pipe(
    tap(() => {
      // Nettoyer le localStorage ou sessionStorage si nécessaire
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      
    })
  );
}

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // Vérifier si le mot de passe correspond à l'email
  checkPassword(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/check-password`, { email, password });
  }

  getUserRole(): string {
    // Exemple : Récupérer le rôle depuis un token ou une session
    const user = JSON.parse(localStorage.getItem('role') || '{}');
    return user.role || '';
  }
  sendResetLink(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}forgot-password`, { email });
  }
}
 
