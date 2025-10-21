export interface Partenaire {
  _id?: string;
    id?: string;  // <-- Ajouté ici

  name: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  ninea: string;
  permis?: string;
  certificat?: string;
  autresDocs?: string;
  idCardCopy?: string;
  photo?: string;
  role?: string;
  description: string;
  contact?: string;
  status?: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
