import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  private baseUrl = 'http://127.0.0.1:8000/api'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) { }

  // Créer un utilisateur
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-user`, userData);
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  // Recupérer un user par son id
  getUserById(id: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  //mettre a jour les informations d'un user
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, userData);
  }

  // Récupérer les utilisateurs par rôle
  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/role/${role}`);
  }

  //Bloquer ou debloquer un user
  switchStatus(userId: String, status: String): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/switch-status/${userId}`, { status: status });
  }
  // Récupérer les users par departement
  getUsersByDepartment(departmentId: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/departement/${departmentId}`);
  }

   // Récupérer les users par departement
   getUsersByCohorte(cohorteId: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/cohorte/${cohorteId}`);
  }

  //Assigner un carte RFID a un user
  assignCard(userId: String, cardId: String): Observable<any>{
    console.log(cardId)
    return this.http.post(`${this.baseUrl}/users/card/${userId}`, { cardId: cardId } );
  }

  //supprimer l'assignation de la carte
  deleteCard(id: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/card/${id}`);
  }

  // Supprimer un utilisateur par ID
  deleteUser(id: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // Supprimer plusieurs utilisateurs
  deleteMultipleUsers(userIds: String[]): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { ids: userIds }
    };
    return this.http.delete(`${this.baseUrl}/users`, options);
  }

  // Importer des utilisateurs depuis un fichier CSV
  importUsersFromCSV(file: FormData): Observable<any> {

    return this.http.post(`${this.baseUrl}/users/import`, file);
  }

  //creer un departement 
  createDepartement(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/departements/create`, data);
  }

  // recuperer tous les departements
  getDepartements(): Observable<any> {
    return this.http.get(`${this.baseUrl}/departements`);
  }

  // recuperer un departement par id
  getDepartementById(id: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/departements/${id}`);
  }

  //recuperer le cohorte pa id
  getCohortById(id: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/cohortes/${id}`);
  }
  // modifier un departement
  updateDepartement(id: String, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/departements/update/${id}`, data);
  }

  // supprimer un departement
  deleteDepartement(id: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/departements/delete/${id}`);
  }

  getEmployeesCountByDepartment(departmentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/departements/${departmentId}/employees/count`);
}

//importer un fichier csv pour créer des departementsb
createDepartementFileUpload(formData: FormData): Observable<Response> {

  return this.http.post<Response>(`${this.baseUrl}/departements/import`, formData);
}

  //creer une Cohorte 
  createCohorte(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${this.baseUrl}/cohortes/create`, data);
  }

  // recuperer tous les Cohortes
  getCohortes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cohortes`);
  }

  // recuperer un Cohorte par id
  getCohorteById(id: String ): Observable<any> {
    return this.http.get(`${this.baseUrl}/cohortes/${id}`);
  }

  // modifier un Cohorte 
  updateCohorte(id: String, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/cohortes/update/${id}`, data);
  }

  // supprimer un Cohorte
  deleteCohorte(id: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cohortes/delete/${id}`);
  }

  getEtudiantsCountByCohorte(cohorteId: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/cohortes/${cohorteId}/etudiant/count`);
}

//importer un fichier csv pour créer des Cohortes
createCohorteFileUpload(formData: any) {

  return this.http.post(`${this.baseUrl}/cohortes/import`, formData);
}

//Selectionner tous les pointages
getAllPointages(): Observable<any> {
  return this.http.get(`${this.baseUrl}/pointages`);
}

}
