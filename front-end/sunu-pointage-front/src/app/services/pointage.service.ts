import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Configurer une instance Axios avec une base URL
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:4000/', // Base URL de l'API
      timeout: 10000, // Timeout de 10 secondes
    });
  }

  // Récupérer les pointages d'un utilisateur spécifique
  async getPointages(userId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`historique-pointage/${userId}`);
      return response.data; // Assurez-vous que la réponse a un format correct
    } catch (error) {
      console.error('Erreur lors du chargement des pointages', error);
      throw error;
    }
  }

  // Récupérer tous les pointages
  async getAllPointages(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('historique-pointage');
      return response.data; // Assurez-vous que la réponse a un format correct
    } catch (error) {
      console.error('Erreur lors du chargement de tous les pointages', error);
      throw error;
    }
  }

  // Mettre à jour l'état d'un pointage
  async updateEtat(id: string, etat: string): Promise<void> {
    try {
      // Envoi de la requête PUT pour mettre à jour l'état du pointage
      const response = await this.axiosInstance.put(`/update-pointage/${id}`, { etat });
      if (response.data.success) {
        console.log('État mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état', error);
      throw error;
    }
}
  // Récupérer un utilisateur par son ID
  async getUserById(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`user/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      throw error;
    }
  }
  
}
