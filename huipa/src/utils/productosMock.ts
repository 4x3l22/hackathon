export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionLarga: string;
  precio: number;
  imagen: string;
  imagenes: string[];
  categoria: 'ceramica' | 'tejido' | 'madera' | 'joyeria' | 'pintura' | 'reciclaje';
  artesano: {
    id: number;
    nombre: string;
    imagen: string;
  };
  stock: number;
  disponible: boolean;
  caracteristicas: string[];
  dimensiones?: string;
  materiales: string[];
}

export const productosMock: Producto[] = [
  {
    id: 1,
    nombre: 'Taza de Cerámica Artesanal',
    descripcion: 'Taza única elaborada a mano con técnicas ancestrales',
    descripcionLarga: 'Esta hermosa taza de cerámica es elaborada completamente a mano por artesanos del Huila. Cada pieza es única y lleva grabados tradicionales inspirados en la cultura precolombina. Perfecta para café o té, mantiene la temperatura ideal por más tiempo gracias al grosor de sus paredes. Los esmaltes naturales le dan un acabado brillante y duradero.',
    precio: 35000,
    imagen: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop'
    ],
    categoria: 'ceramica',
    artesano: {
      id: 1,
      nombre: 'María Elena Gutiérrez',
      imagen: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    },
    stock: 15,
    disponible: true,
    caracteristicas: [
      'Hecho a mano',
      'Esmaltes naturales',
      'Apto para lavavajillas',
      'Diseño único',
      'Mantiene temperatura'
    ],
    dimensiones: '10cm x 8cm (diámetro x altura)',
    materiales: ['Arcilla natural', 'Esmalte cerámico', 'Pigmentos naturales']
  },
  {
    id: 2,
    nombre: 'Ruana Tradicional Huilense',
    descripcion: 'Ruana tejida en telar vertical con lana 100% natural',
    descripcionLarga: 'Ruana tradicional tejida con técnicas ancestrales transmitidas de generación en generación. Elaborada en telar vertical con lana de oveja 100% natural, teñida con tintes vegetales. Los diseños geométricos representan elementos de la cosmovisión andina. Perfecta para el clima frío, es suave, abrigadora y extremadamente duradera.',
    precio: 180000,
    imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop'
    ],
    categoria: 'tejido',
    artesano: {
      id: 3,
      nombre: 'Isabel Torres',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    stock: 8,
    disponible: true,
    caracteristicas: [
      'Lana 100% natural',
      'Tintes vegetales',
      'Tejido en telar',
      'Diseño tradicional',
      'Muy abrigadora'
    ],
    dimensiones: '150cm x 120cm',
    materiales: ['Lana de oveja', 'Tintes naturales vegetales']
  },
  {
    id: 3,
    nombre: 'Mesa Rústica de Madera Recuperada',
    descripcion: 'Mesa elaborada con madera de graneros antiguos',
    descripcionLarga: 'Esta impresionante mesa es creada a partir de madera recuperada de graneros y construcciones antiguas del Huila. Cada tabla cuenta una historia y presenta vetas únicas. El acabado natural resalta la belleza de la madera envejecida. Perfecta como mesa de centro o auxiliar, combina el estilo rústico con la funcionalidad moderna.',
    precio: 450000,
    imagen: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&h=600&fit=crop'
    ],
    categoria: 'madera',
    artesano: {
      id: 2,
      nombre: 'Carlos Mendoza',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    stock: 3,
    disponible: true,
    caracteristicas: [
      'Madera recuperada',
      'Pieza única',
      'Acabado natural',
      'Muy resistente',
      'Ecológica'
    ],
    dimensiones: '80cm x 80cm x 45cm',
    materiales: ['Madera recuperada', 'Barniz ecológico']
  },
  {
    id: 4,
    nombre: 'Collar con Esmeraldas Colombianas',
    descripcion: 'Collar artesanal en plata 950 con esmeraldas naturales',
    descripcionLarga: 'Elegante collar elaborado en plata 950 con esmeraldas colombianas naturales. Cada piedra es seleccionada cuidadosamente por su color y claridad. El diseño contemporáneo combina la tradición joyera con líneas modernas. Perfecto para ocasiones especiales o uso diario elegante. Incluye certificado de autenticidad de las piedras.',
    precio: 320000,
    imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'
    ],
    categoria: 'joyeria',
    artesano: {
      id: 4,
      nombre: 'Andrés Valderrama',
      imagen: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    stock: 5,
    disponible: true,
    caracteristicas: [
      'Plata 950',
      'Esmeraldas naturales',
      'Diseño contemporáneo',
      'Certificado incluido',
      'Hecho a mano'
    ],
    dimensiones: '45cm de largo',
    materiales: ['Plata 950', 'Esmeraldas colombianas']
  },
  {
    id: 5,
    nombre: 'Cuadro Paisaje Cafetero',
    descripcion: 'Pintura al óleo del eje cafetero colombiano',
    descripcionLarga: 'Esta vibrante pintura al óleo captura la esencia del paisaje cafetero colombiano. Los colores vivos representan las montañas verdes, las plantaciones de café y el cielo azul característico de la región. Pintada sobre lienzo de alta calidad con óleos profesionales. Perfecta para decorar espacios que buscan evocar la belleza natural de Colombia.',
    precio: 280000,
    imagen: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop'
    ],
    categoria: 'pintura',
    artesano: {
      id: 5,
      nombre: 'Lucía Ramírez',
      imagen: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    stock: 1,
    disponible: true,
    caracteristicas: [
      'Pintura al óleo',
      'Lienzo de calidad',
      'Colores vivos',
      'Firmada por artista',
      'Lista para colgar'
    ],
    dimensiones: '60cm x 80cm',
    materiales: ['Óleo profesional', 'Lienzo de algodón', 'Bastidor de madera']
  },
  {
    id: 6,
    nombre: 'Lámpara de Botellas Recicladas',
    descripcion: 'Lámpara única con botellas de vidrio recicladas',
    descripcionLarga: 'Innovadora lámpara creada a partir de botellas de vidrio recicladas y madera recuperada. Cada botella es cuidadosamente cortada y pulida para crear una pieza de iluminación única. La combinación de vidrio y madera crea efectos de luz cálidos y acogedores. Incluye instalación eléctrica certificada. Una pieza que combina arte, funcionalidad y conciencia ambiental.',
    precio: 165000,
    imagen: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'
    ],
    categoria: 'reciclaje',
    artesano: {
      id: 6,
      nombre: 'Roberto Sánchez',
      imagen: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    },
    stock: 7,
    disponible: true,
    caracteristicas: [
      'Materiales reciclados',
      'Instalación certificada',
      'Diseño único',
      'Ecológica',
      'Luz cálida'
    ],
    dimensiones: '30cm x 40cm',
    materiales: ['Botellas de vidrio recicladas', 'Madera recuperada', 'Componentes eléctricos']
  },
  {
    id: 7,
    nombre: 'Cojines Decorativos Bordados',
    descripcion: 'Cojines tejidos a mano con bordados tradicionales',
    descripcionLarga: 'Set de cojines decorativos tejidos completamente a mano con técnicas tradicionales. Los bordados representan símbolos ancestrales de la región. Rellenos de fibra hipoalergénica de alta calidad. Los colores naturales provienen de tintes vegetales. Ideales para decorar salas, habitaciones o espacios exteriores cubiertos.',
    precio: 85000,
    imagen: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop'
    ],
    categoria: 'tejido',
    artesano: {
      id: 3,
      nombre: 'Isabel Torres',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    stock: 12,
    disponible: true,
    caracteristicas: [
      'Bordado a mano',
      'Tintes naturales',
      'Relleno hipoalergénico',
      'Funda removible',
      'Set de 2 unidades'
    ],
    dimensiones: '45cm x 45cm cada uno',
    materiales: ['Algodón', 'Lana', 'Tintes vegetales', 'Fibra hipoalergénica']
  },
  {
    id: 8,
    nombre: 'Jarrón de Barro Tradicional',
    descripcion: 'Jarrón artesanal con técnica de barro bruñido',
    descripcionLarga: 'Elegante jarrón elaborado con la técnica ancestral de barro bruñido. El proceso incluye modelado a mano, secado natural y bruñido con piedra de río para lograr el característico brillo. Los diseños geométricos son típicos de la cerámica precolombina del Huila. Perfecto para flores frescas o secas, o como pieza decorativa independiente.',
    precio: 95000,
    imagen: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop',
      'https://artesaniasdelatlantico.com/wp-content/uploads/2021/05/Jarron-Barro-colombiano.jpg'
    ],
    categoria: 'ceramica',
    artesano: {
      id: 1,
      nombre: 'María Elena Gutiérrez',
      imagen: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    },
    stock: 6,
    disponible: true,
    caracteristicas: [
      'Barro bruñido',
      'Técnica ancestral',
      'Diseño precolombino',
      'Acabado brillante',
      'Pieza única'
    ],
    dimensiones: '25cm x 15cm (altura x diámetro)',
    materiales: ['Arcilla natural', 'Pigmentos minerales']
  },
  {
    id: 9,
    nombre: 'Aretes de Plata con Piedras',
    descripcion: 'Aretes artesanales en plata con cuarzos naturales',
    descripcionLarga: 'Hermosos aretes elaborados en plata 950 con cuarzos y ágatas naturales. El diseño bohemio-contemporáneo los hace versátiles para diferentes ocasiones. Cada piedra es seleccionada por sus propiedades energéticas y estéticas. Los enganches son hipoalergénicos. Incluyen estuche de regalo y certificado de autenticidad.',
    precio: 75000,
    imagen: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'
    ],
    categoria: 'joyeria',
    artesano: {
      id: 4,
      nombre: 'Andrés Valderrama',
      imagen: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    stock: 10,
    disponible: true,
    caracteristicas: [
      'Plata 950',
      'Piedras naturales',
      'Hipoalergénicos',
      'Diseño bohemio',
      'Estuche incluido'
    ],
    dimensiones: '4cm de largo',
    materiales: ['Plata 950', 'Cuarzos naturales', 'Ágatas']
  },
  {
    id: 10,
    nombre: 'Porta Retratos Artesanal',
    descripcion: 'Marco de madera noble con tallados a mano',
    descripcionLarga: 'Elegante porta retratos elaborado con maderas nobles y acabados naturales. Los tallados a mano representan motivos florales y geométricos tradicionales. El vidrio es de alta calidad con protección UV. Incluye soporte para colocar horizontal o verticalmente. Perfecto para tus mejores recuerdos o como regalo especial.',
    precio: 48000,
    imagen: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&h=600&fit=crop'
    ],
    categoria: 'madera',
    artesano: {
      id: 2,
      nombre: 'Carlos Mendoza',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    stock: 20,
    disponible: true,
    caracteristicas: [
      'Madera noble',
      'Tallado a mano',
      'Vidrio con UV',
      'Doble orientación',
      'Acabado natural'
    ],
    dimensiones: '20cm x 25cm (para foto 15x20)',
    materiales: ['Madera de cedro', 'Vidrio con protección UV', 'Barniz ecológico']
  }
];

// Función helper para buscar productos
export function buscarProductoPorId(id: number): Producto | undefined {
  return productosMock.find(p => p.id === id);
}

// Función para filtrar por categoría
export function filtrarPorCategoria(categoria: string): Producto[] {
  return productosMock.filter(p => p.categoria === categoria);
}

// Función para obtener productos del artesano
export function productosPorArtesano(artesanoId: number): Producto[] {
  return productosMock.filter(p => p.artesano.id === artesanoId);
}
