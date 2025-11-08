export interface Producto {
  nombre: string;
  imagen: string;
  descripcionBreve: string;
}

export interface HistoriaDestacada {
  id: number;
  nombre: string;
  imagenPerfil: string;
  descripcionHistoria: string;
  productos: Producto[];
}

export const historiasDestacadas: HistoriaDestacada[] = [
  {
    id: 1,
    nombre: 'María Elena Gutiérrez',
    imagenPerfil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    descripcionHistoria: 'Artesana ceramista con más de 20 años de experiencia. Cada pieza que creo lleva la tradición de mi pueblo y el amor por el barro. Mis manos transforman la arcilla en arte funcional que cuenta historias de generaciones.',
    productos: [
      {
        nombre: 'Tazas de Cerámica Artesanal',
        imagen: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
        descripcionBreve: 'Tazas únicas elaboradas a mano con técnicas ancestrales. Cada una tiene su personalidad y acabado en esmaltes naturales.'
      },
      {
        nombre: 'Platos Decorativos',
        imagen: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop',
        descripcionBreve: 'Platos con diseños inspirados en la naturaleza, perfectos para decorar o servir alimentos con estilo.'
      },
      {
        nombre: 'Jarrones Rústicos',
        imagen: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop',
        descripcionBreve: 'Jarrones de diferentes tamaños con texturas únicas, ideales para flores frescas o secas.'
      }
    ]
  },
  {
    id: 2,
    nombre: 'Carlos Mendoza',
    imagenPerfil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    descripcionHistoria: 'Maestro carpintero especializado en muebles de madera recuperada. Creo que cada trozo de madera tiene una segunda oportunidad de ser algo hermoso. Mi taller es un espacio donde la naturaleza y el diseño se encuentran.',
    productos: [
      {
        nombre: 'Mesa Rústica de Madera',
        imagen: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=600&fit=crop',
        descripcionBreve: 'Mesa elaborada con madera recuperada de graneros antiguos. Cada veta cuenta una historia diferente.'
      },
      {
        nombre: 'Estantes Flotantes',
        imagen: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
        descripcionBreve: 'Estantes minimalistas de madera maciza con soporte oculto. Funcionalidad y belleza en equilibrio.'
      },
      {
        nombre: 'Porta Retratos Artesanales',
        imagen: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
        descripcionBreve: 'Marcos hechos a mano con maderas nobles y acabados naturales para tus mejores recuerdos.'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Isabel Torres',
    imagenPerfil: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    descripcionHistoria: 'Tejedora tradicional que preserva técnicas ancestrales de mi comunidad. Cada hilo que entrelaza lleva los colores de las montañas y la sabiduría de mis ancestras. Tejer es mi forma de mantener viva nuestra cultura.',
    productos: [
      {
        nombre: 'Ruana Tradicional',
        imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
        descripcionBreve: 'Ruana tejida en telar vertical con lana de oveja 100% natural. Diseños geométricos tradicionales.'
      },
      {
        nombre: 'Cojines Decorativos',
        imagen: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
        descripcionBreve: 'Cojines tejidos a mano con patrones ancestrales y colores naturales extraídos de plantas.'
      },
      {
        nombre: 'Tapiz de Pared',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        descripcionBreve: 'Tapiz decorativo que representa escenas de la vida cotidiana en las montañas andinas.'
      }
    ]
  },
  {
    id: 4,
    nombre: 'Andrés Valderrama',
    imagenPerfil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    descripcionHistoria: 'Joyero artesanal que trabaja con plata y piedras semi-preciosas. Mi inspiración viene de la naturaleza colombiana: sus ríos, montañas y biodiversidad. Cada joya es una pieza única que celebra nuestra tierra.',
    productos: [
      {
        nombre: 'Aretes de Plata y Esmeraldas',
        imagen: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
        descripcionBreve: 'Aretes elegantes elaborados en plata 950 con esmeraldas colombianas naturales.'
      },
      {
        nombre: 'Collar con Piedras Naturales',
        imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
        descripcionBreve: 'Collar artesanal con cuarzos y ágatas en cadena de plata. Diseño bohemio contemporáneo.'
      },
      {
        nombre: 'Anillo de Compromiso Único',
        imagen: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
        descripcionBreve: 'Anillo personalizado en plata con diseño orgánico inspirado en las formas de la naturaleza.'
      }
    ]
  },
  {
    id: 5,
    nombre: 'Lucía Ramírez',
    imagenPerfil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    descripcionHistoria: 'Pintora y muralista que plasma la cultura colombiana en cada trazo. Mis obras son un homenaje a la diversidad, los colores y la alegría de nuestra gente. El arte es mi voz y mi herramienta de transformación social.',
    productos: [
      {
        nombre: 'Cuadro Paisaje Cafetero',
        imagen: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
        descripcionBreve: 'Pintura al óleo que captura la belleza del eje cafetero colombiano con sus montañas y plantaciones.'
      },
      {
        nombre: 'Arte Abstracto Colombiano',
        imagen: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
        descripcionBreve: 'Obra abstracta inspirada en los colores y texturas de los mercados tradicionales colombianos.'
      },
      {
        nombre: 'Retrato Personalizado',
        imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
        descripcionBreve: 'Retratos artísticos a lápiz y acuarela que capturan la esencia y personalidad de cada persona.'
      }
    ]
  },
  {
    id: 6,
    nombre: 'Roberto Sánchez',
    imagenPerfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    descripcionHistoria: 'Artista del reciclaje creativo que transforma desechos en obras de arte funcionales. Creo que la basura de unos es el tesoro de otros. Mi misión es demostrar que podemos cuidar el planeta mientras creamos belleza.',
    productos: [
      {
        nombre: 'Lámpara de Botellas Recicladas',
        imagen: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',
        descripcionBreve: 'Lámpara única elaborada con botellas de vidrio recicladas y accesorios de madera recuperada.'
      },
      {
        nombre: 'Macetero de Neumáticos',
        imagen: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
        descripcionBreve: 'Maceteros decorativos hechos con neumáticos reciclados, pintados con colores vibrantes y diseños únicos.'
      },
      {
        nombre: 'Esculturas de Metal Reciclado',
        imagen: 'https://images.unsplash.com/photo-1580911003143-c7e8c93e8cdb?w=600&h=600&fit=crop',
        descripcionBreve: 'Esculturas artísticas creadas con chatarra y metal reciclado. Cada pieza es una declaración de sostenibilidad.'
      }
    ]
  }
];
