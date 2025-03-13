export interface Login {
    id: number;       // Agrega esta línea
    status?: boolean;
    msg?: string;
    name: string;     // Se usará 'name' en lugar de 'nombres'
    email: string;
    token: string;
    role: string;     // Se usará 'role' en lugar de 'tipoUsuario'
}