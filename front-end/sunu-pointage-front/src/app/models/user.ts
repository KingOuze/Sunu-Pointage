export interface User {
    _id: string; // Optional for storing the user's ID
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    addresse: string;
    cardId?: string; // Optional, for roles that require it
    departement?: string; // Optional for 'employe'
    fonction?: string; // Optional for 'employe'
    cohorte?: string; // Optional for 'etudiant'
    photo?: string; // Optional for storing the photo path
    matricule?: string; // Optional for storing the matricule
    role: string;
    selected?: boolean; // Propriété pour la sélection
}
