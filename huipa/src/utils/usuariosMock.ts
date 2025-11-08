export interface Usuario {
  id: number;
  email: string;
  password: string;
  nombre: string;
  rol: 'cliente' | 'artesano' | 'logistica' | 'transportista' | 'usuario';
  telefono?: string;
  ubicacion?: string;
  imagenPerfil?: string;
}

export const usuariosMock: Usuario[] = [
  {
    id: 1,
    email: 'maria@artesano.com',
    password: '123456',
    nombre: 'María Elena Gutiérrez',
    rol: 'artesano',
    telefono: '573001234567',
    ubicacion: 'Neiva, Huila',
    imagenPerfil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    email: 'juan@usuario.com',
    password: '123456',
    nombre: 'Juan Pérez',
    rol: 'usuario',
    telefono: '573009876543',
    ubicacion: 'Bogotá, Colombia',
    imagenPerfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    email: 'laura@usuario.com',
    password: '123456',
    nombre: 'Laura Rodríguez',
    rol: 'usuario',
    telefono: '573105551234',
    ubicacion: 'Medellín, Colombia',
    imagenPerfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    email: 'carlos@usuario.com',
    password: '123456',
    nombre: 'Carlos Mendoza',
    rol: 'usuario',
    telefono: '573207778899',
    ubicacion: 'Cali, Colombia',
    imagenPerfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  }
];

// Función helper para validar credenciales
export function validarCredenciales(email: string, password: string): Usuario | null {
  const usuario = usuariosMock.find(u => u.email === email && u.password === password);
  return usuario || null;
}
