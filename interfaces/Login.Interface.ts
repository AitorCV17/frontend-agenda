// interfaces/Login.Interface.ts
export interface Login {
    id: number;  // <--- ya lo agregaste, pero confirma que existe
    status?: boolean;
    msg?: string;
    name: string;
    email: string;
    token: string;
    role: string;
  }
  