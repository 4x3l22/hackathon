import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface DatosNegocio {
  id?: number; // Auto-incrementado por IndexedDB
  usuarioId: number; // Foreign key - relación con la tabla usuarios
  nombreNegocio: string;
  descripcionTaller: string;
  metodoPago: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductoDB {
  id?: number; // Auto-incrementado por IndexedDB
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenes: string[]; // Array de imágenes en base64
  usuarioId: number; // Relación con el artesano (dueño del negocio)
  createdAt: string;
  updatedAt?: string;
}

export interface PedidoDB {
  id?: number; // Auto-incrementado por IndexedDB
  numeroPedido: string; // Identificador único del pedido (9 dígitos)
  productoId: number; // Foreign key - producto solicitado
  clienteId: number; // Foreign key - usuario cliente (rol: cliente/usuario)
  transportistaId: number; // Foreign key - usuario transportista
  logisticaId: number; // Foreign key - usuario de logística que crea el pedido
  lugarOrigen: string;
  lugarDestino: string;
  total: number;
  estado: 'pendiente' | 'en_transito' | 'entregado' | 'cancelado';
  createdAt: string;
  updatedAt?: string;
}

export interface UsuarioDB {
  id?: number; // Auto-incrementado por IndexedDB
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  residence: string;
  street: string;
  addressNumber: string;
  neighborhood: string;
  houseNumber: string;
  phone: string;
  photo?: string;
  rol: 'cliente' | 'artesano' | 'logistica' | 'transportista' | 'usuario';
  isArtisan: boolean;
  formularioCompletado?: boolean; // Indica si completó el formulario de negocio
  datosNegocioId?: number; // ID de referencia a la tabla datosNegocio (foreign key)
  artisanData?: {
    lifeStory: string;
    workshopGallery: string[];
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName = 'huipa';
  private version = 6; // Incrementado para asegurar creación de tabla pedidos
  private storeName = 'usuarios';
  private productStoreName = 'productos';
  private businessStoreName = 'datosNegocio'; // Nueva tabla para datos de negocio
  private pedidosStoreName = 'pedidos'; // Nueva tabla para pedidos
  private db: IDBDatabase | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initDB();
    }
  }

  /**
   * Inicializar la base de datos IndexedDB
   */
  private async initDB(): Promise<void> {
    if (!this.isBrowser) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error al abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB inicializada correctamente - Versión:', this.db.version);
        console.log('Object stores disponibles:', Array.from(this.db.objectStoreNames));
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion;
        const transaction = event.target.transaction;

        console.log(`Actualizando base de datos de versión ${oldVersion} a ${newVersion}`);

        // Crear el object store de usuarios si no existe
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Crear índices para búsquedas rápidas
          objectStore.createIndex('email', 'email', { unique: true });
          objectStore.createIndex('documentNumber', 'documentNumber', { unique: true });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });

          console.log('Object store "usuarios" creado con índices');
        }

        // Crear el object store de productos si no existe
        if (!db.objectStoreNames.contains(this.productStoreName)) {
          const productStore = db.createObjectStore(this.productStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Crear índices para búsquedas rápidas
          productStore.createIndex('usuarioId', 'usuarioId', { unique: false });
          productStore.createIndex('categoria', 'categoria', { unique: false });
          productStore.createIndex('createdAt', 'createdAt', { unique: false });

          console.log('Object store "productos" creado con índices');
        }

        // Crear el object store de datosNegocio si no existe
        if (!db.objectStoreNames.contains(this.businessStoreName)) {
          const businessStore = db.createObjectStore(this.businessStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Crear índices para búsquedas rápidas
          businessStore.createIndex('usuarioId', 'usuarioId', { unique: true }); // Un usuario solo puede tener un negocio
          businessStore.createIndex('createdAt', 'createdAt', { unique: false });

          console.log('Object store "datosNegocio" creado con índices');
        }

        // Crear el object store de pedidos si no existe
        if (!db.objectStoreNames.contains(this.pedidosStoreName)) {
          const pedidosStore = db.createObjectStore(this.pedidosStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });

          // Crear índices para búsquedas rápidas
          pedidosStore.createIndex('numeroPedido', 'numeroPedido', { unique: true });
          pedidosStore.createIndex('productoId', 'productoId', { unique: false });
          pedidosStore.createIndex('clienteId', 'clienteId', { unique: false });
          pedidosStore.createIndex('transportistaId', 'transportistaId', { unique: false });
          pedidosStore.createIndex('logisticaId', 'logisticaId', { unique: false });
          pedidosStore.createIndex('estado', 'estado', { unique: false });
          pedidosStore.createIndex('createdAt', 'createdAt', { unique: false });

          console.log('Object store "pedidos" creado con índices');
        }

        // Migración de versión 3 a 4: Agregar campo 'rol' a usuarios existentes
        if (oldVersion < 4) {
          console.log('Migrando usuarios para agregar campo rol...');
          const usuariosStore = transaction.objectStore(this.storeName);
          const cursorRequest = usuariosStore.openCursor();

          cursorRequest.onsuccess = (event: any) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              const usuario = cursor.value;
              // Si no tiene rol, asignarlo basado en isArtisan
              if (!usuario.rol) {
                usuario.rol = usuario.isArtisan ? 'artesano' : 'cliente';
                cursor.update(usuario);
                console.log(`Usuario ${usuario.email} actualizado con rol: ${usuario.rol}`);
              }
              cursor.continue();
            } else {
              console.log('Migración de usuarios completada');
            }
          };
        }

        console.log('Actualización de base de datos completada');
      };

      request.onblocked = () => {
        console.warn('La actualización de la base de datos está bloqueada. Por favor cierra otras pestañas con esta aplicación.');
      };
    });
  }

  /**
   * Asegurar que la DB esté inicializada
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.isBrowser) {
      throw new Error('IndexedDB solo está disponible en el navegador');
    }

    if (!this.db) {
      await this.initDB();
    }

    if (!this.db) {
      throw new Error('No se pudo inicializar IndexedDB');
    }

    return this.db;
  }

  /**
   * Registrar un nuevo usuario
   */
  async registrarUsuario(usuario: Omit<UsuarioDB, 'id' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDB();

    console.log('IndexedDBService - Registrando usuario con datos:', usuario);
    console.log('IndexedDBService - Campo rol:', usuario.rol);

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      // Agregar fecha de creación
      const usuarioCompleto: Omit<UsuarioDB, 'id'> = {
        ...usuario,
        createdAt: new Date().toISOString()
      };

      console.log('IndexedDBService - Usuario completo a guardar:', usuarioCompleto);

      const request = objectStore.add(usuarioCompleto);

      request.onsuccess = () => {
        console.log('Usuario registrado con ID:', request.result);
        console.log('Rol guardado:', usuarioCompleto.rol);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('Error al registrar usuario:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Buscar usuario por email
   */
  async buscarPorEmail(email: string): Promise<UsuarioDB | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('email');
      const request = index.get(email);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        console.error('Error al buscar usuario por email:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Validar credenciales de usuario
   */
  async validarCredenciales(email: string, password: string): Promise<UsuarioDB | null> {
    const usuario = await this.buscarPorEmail(email);

    if (usuario && usuario.password === password) {
      return usuario;
    }

    return null;
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodosLosUsuarios(): Promise<UsuarioDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error al obtener usuarios:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Actualizar usuario
   */
  async actualizarUsuario(usuario: UsuarioDB): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(usuario);

      request.onsuccess = () => {
        console.log('Usuario actualizado');
        resolve();
      };

      request.onerror = () => {
        console.error('Error al actualizar usuario:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Eliminar usuario por ID
   */
  async eliminarUsuario(id: number): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        console.log('Usuario eliminado');
        resolve();
      };

      request.onerror = () => {
        console.error('Error al eliminar usuario:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Verificar si un email ya está registrado
   */
  async emailExiste(email: string): Promise<boolean> {
    const usuario = await this.buscarPorEmail(email);
    return usuario !== null;
  }

  /**
   * Actualizar datos de negocio del artesano y marcar formulario como completado
   * MÉTODO ACTUALIZADO: Ahora crea un registro separado en la tabla datosNegocio
   */
  async actualizarDatosNegocio(usuarioId: number, datosNegocio: Omit<DatosNegocio, 'id' | 'usuarioId' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDB();

    return new Promise(async (resolve, reject) => {
      try {
        // 1. Verificar si ya existe un registro de datos de negocio para este usuario
        const datosExistentes = await this.obtenerDatosNegocioPorUsuario(usuarioId);

        if (datosExistentes) {
          // Actualizar el registro existente
          await this.actualizarDatosNegocioTabla(datosExistentes.id!, datosNegocio);
          
          // Marcar formulario como completado en usuario
          const transactionUsuario = db.transaction([this.storeName], 'readwrite');
          const objectStoreUsuario = transactionUsuario.objectStore(this.storeName);
          const getRequest = objectStoreUsuario.get(usuarioId);

          getRequest.onsuccess = () => {
            const usuario = getRequest.result as UsuarioDB;
            if (usuario) {
              usuario.formularioCompletado = true;
              usuario.datosNegocioId = datosExistentes.id!;
              objectStoreUsuario.put(usuario);
            }
          };

          resolve(datosExistentes.id!);
        } else {
          // 2. Crear nuevo registro en tabla datosNegocio
          const transaction = db.transaction([this.businessStoreName, this.storeName], 'readwrite');
          const businessStore = transaction.objectStore(this.businessStoreName);
          const userStore = transaction.objectStore(this.storeName);

          const datosCompletos: Omit<DatosNegocio, 'id'> = {
            ...datosNegocio,
            usuarioId,
            createdAt: new Date().toISOString()
          };

          const addRequest = businessStore.add(datosCompletos);

          addRequest.onsuccess = () => {
            const datosNegocioId = addRequest.result as number;
            console.log('Datos de negocio registrados con ID:', datosNegocioId);

            // 3. Actualizar usuario con referencia y marcar formulario como completado
            const getUserRequest = userStore.get(usuarioId);

            getUserRequest.onsuccess = () => {
              const usuario = getUserRequest.result as UsuarioDB;
              
              if (!usuario) {
                reject(new Error('Usuario no encontrado'));
                return;
              }

              usuario.datosNegocioId = datosNegocioId;
              usuario.formularioCompletado = true;

              const updateUserRequest = userStore.put(usuario);

              updateUserRequest.onsuccess = () => {
                console.log('Usuario actualizado con referencia a datos de negocio');
                resolve(datosNegocioId);
              };

              updateUserRequest.onerror = () => {
                console.error('Error al actualizar usuario:', updateUserRequest.error);
                reject(updateUserRequest.error);
              };
            };

            getUserRequest.onerror = () => {
              console.error('Error al buscar usuario:', getUserRequest.error);
              reject(getUserRequest.error);
            };
          };

          addRequest.onerror = () => {
            console.error('Error al registrar datos de negocio:', addRequest.error);
            reject(addRequest.error);
          };
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Obtener datos de negocio de un artesano
   * MÉTODO ACTUALIZADO: Ahora busca en la tabla datosNegocio separada
   */
  async obtenerDatosNegocio(usuarioId: number): Promise<DatosNegocio | null> {
    return this.obtenerDatosNegocioPorUsuario(usuarioId);
  }

  /**
   * Limpiar toda la base de datos (útil para testing)
   */
  async limpiarDB(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        console.log('Base de datos limpiada');
        resolve();
      };

      request.onerror = () => {
        console.error('Error al limpiar base de datos:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Eliminar completamente la base de datos y reinicializarla
   * Útil cuando hay cambios en la estructura de la base de datos
   */
  async reinicializarDB(): Promise<void> {
    if (!this.isBrowser) {
      throw new Error('IndexedDB solo está disponible en el navegador');
    }

    return new Promise((resolve, reject) => {
      // Cerrar la conexión actual si existe
      if (this.db) {
        this.db.close();
        this.db = null;
      }

      // Eliminar la base de datos
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = async () => {
        console.log('Base de datos eliminada exitosamente');
        try {
          // Reinicializar
          await this.initDB();
          console.log('Base de datos reinicializada');
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      deleteRequest.onerror = () => {
        console.error('Error al eliminar base de datos:', deleteRequest.error);
        reject(deleteRequest.error);
      };

      deleteRequest.onblocked = () => {
        console.warn('La eliminación de la base de datos está bloqueada. Por favor cierra otras pestañas.');
        reject(new Error('Database deletion blocked'));
      };
    });
  }

  // ==================== MÉTODOS PARA PRODUCTOS ====================

  /**
   * Registrar un nuevo producto
   */
  async registrarProducto(producto: Omit<ProductoDB, 'id' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.productStoreName);

      const productoConFecha: Omit<ProductoDB, 'id'> = {
        ...producto,
        createdAt: new Date().toISOString()
      };

      const request = objectStore.add(productoConFecha);

      request.onsuccess = () => {
        console.log('Producto registrado con ID:', request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('Error al registrar producto:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener todos los productos de un usuario (artesano)
   */
  async obtenerProductosPorUsuario(usuarioId: number): Promise<ProductoDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.productStoreName);
      const index = objectStore.index('usuarioId');
      const request = index.getAll(usuarioId);

      request.onsuccess = () => {
        resolve(request.result as ProductoDB[]);
      };

      request.onerror = () => {
        console.error('Error al obtener productos:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener un producto por ID
   */
  async obtenerProductoPorId(productoId: number): Promise<ProductoDB | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.productStoreName);
      const request = objectStore.get(productoId);

      request.onsuccess = () => {
        resolve(request.result as ProductoDB || null);
      };

      request.onerror = () => {
        console.error('Error al obtener producto:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Actualizar un producto existente
   */
  async actualizarProducto(productoId: number, cambios: Partial<ProductoDB>): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.productStoreName);
      const getRequest = objectStore.get(productoId);

      getRequest.onsuccess = () => {
        const producto = getRequest.result as ProductoDB;

        if (!producto) {
          reject(new Error('Producto no encontrado'));
          return;
        }

        // Actualizar campos
        const productoActualizado: ProductoDB = {
          ...producto,
          ...cambios,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = objectStore.put(productoActualizado);

        updateRequest.onsuccess = () => {
          console.log('Producto actualizado correctamente');
          resolve();
        };

        updateRequest.onerror = () => {
          console.error('Error al actualizar producto:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Error al buscar producto:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  /**
   * Eliminar un producto
   */
  async eliminarProducto(productoId: number): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.productStoreName);
      const request = objectStore.delete(productoId);

      request.onsuccess = () => {
        console.log('Producto eliminado correctamente');
        resolve();
      };

      request.onerror = () => {
        console.error('Error al eliminar producto:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener todos los productos (para marketplace)
   */
  async obtenerTodosLosProductos(): Promise<ProductoDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.productStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.productStoreName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as ProductoDB[]);
      };

      request.onerror = () => {
        console.error('Error al obtener todos los productos:', request.error);
        reject(request.error);
      };
    });
  }

  // ==================== MÉTODOS PARA DATOS DE NEGOCIO ====================

  /**
   * Registrar nuevos datos de negocio
   */
  async registrarDatosNegocio(datosNegocio: Omit<DatosNegocio, 'id' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.businessStoreName);

      const datosCompletos: Omit<DatosNegocio, 'id'> = {
        ...datosNegocio,
        createdAt: new Date().toISOString()
      };

      const request = objectStore.add(datosCompletos);

      request.onsuccess = () => {
        console.log('Datos de negocio registrados con ID:', request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('Error al registrar datos de negocio:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener datos de negocio por ID de usuario
   */
  async obtenerDatosNegocioPorUsuario(usuarioId: number): Promise<DatosNegocio | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.businessStoreName);
      const index = objectStore.index('usuarioId');
      const request = index.get(usuarioId);

      request.onsuccess = () => {
        resolve(request.result as DatosNegocio || null);
      };

      request.onerror = () => {
        console.error('Error al obtener datos de negocio:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener datos de negocio por ID directo
   */
  async obtenerDatosNegocioPorId(datosNegocioId: number): Promise<DatosNegocio | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.businessStoreName);
      const request = objectStore.get(datosNegocioId);

      request.onsuccess = () => {
        resolve(request.result as DatosNegocio || null);
      };

      request.onerror = () => {
        console.error('Error al obtener datos de negocio:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Actualizar datos de negocio existentes en la tabla datosNegocio
   */
  async actualizarDatosNegocioTabla(datosNegocioId: number, cambios: Partial<Omit<DatosNegocio, 'id' | 'usuarioId' | 'createdAt'>>): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.businessStoreName);
      const getRequest = objectStore.get(datosNegocioId);

      getRequest.onsuccess = () => {
        const datosNegocio = getRequest.result as DatosNegocio;

        if (!datosNegocio) {
          reject(new Error('Datos de negocio no encontrados'));
          return;
        }

        // Actualizar campos
        const datosActualizados: DatosNegocio = {
          ...datosNegocio,
          ...cambios,
          updatedAt: new Date().toISOString()
        };

        const updateRequest = objectStore.put(datosActualizados);

        updateRequest.onsuccess = () => {
          console.log('Datos de negocio actualizados correctamente');
          resolve();
        };

        updateRequest.onerror = () => {
          console.error('Error al actualizar datos de negocio:', updateRequest.error);
          reject(updateRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Error al buscar datos de negocio:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  /**
   * Eliminar datos de negocio
   */
  async eliminarDatosNegocio(datosNegocioId: number): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.businessStoreName);
      const request = objectStore.delete(datosNegocioId);

      request.onsuccess = () => {
        console.log('Datos de negocio eliminados correctamente');
        resolve();
      };

      request.onerror = () => {
        console.error('Error al eliminar datos de negocio:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener todos los datos de negocio (para administración)
   */
  async obtenerTodosLosDatosNegocio(): Promise<DatosNegocio[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.businessStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.businessStoreName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as DatosNegocio[]);
      };

      request.onerror = () => {
        console.error('Error al obtener todos los datos de negocio:', request.error);
        reject(request.error);
      };
    });
  }

  // =====================================================
  // MÉTODOS PARA PEDIDOS
  // =====================================================

  /**
   * Generar número de pedido único de 9 dígitos
   */
  private generarNumeroPedido(): string {
    const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 dígitos aleatorios
    return timestamp + random;
  }

  /**
   * Crear un nuevo pedido
   */
  async crearPedido(pedido: Omit<PedidoDB, 'id' | 'createdAt' | 'numeroPedido'>): Promise<number> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.pedidosStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.pedidosStoreName);

      const pedidoCompleto: Omit<PedidoDB, 'id'> = {
        ...pedido,
        numeroPedido: this.generarNumeroPedido(),
        createdAt: new Date().toISOString()
      };

      const request = objectStore.add(pedidoCompleto);

      request.onsuccess = () => {
        console.log('Pedido creado con ID:', request.result);
        resolve(request.result as number);
      };

      request.onerror = () => {
        console.error('Error al crear pedido:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener todos los pedidos
   */
  async obtenerTodosLosPedidos(): Promise<PedidoDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.pedidosStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.pedidosStoreName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result as PedidoDB[]);
      };

      request.onerror = () => {
        console.error('Error al obtener pedidos:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener pedidos por cliente
   */
  async obtenerPedidosPorCliente(clienteId: number): Promise<PedidoDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.pedidosStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.pedidosStoreName);
      const index = objectStore.index('clienteId');
      const request = index.getAll(clienteId);

      request.onsuccess = () => {
        resolve(request.result as PedidoDB[]);
      };

      request.onerror = () => {
        console.error('Error al obtener pedidos por cliente:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtener pedidos por transportista
   */
  async obtenerPedidosPorTransportista(transportistaId: number): Promise<PedidoDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.pedidosStoreName], 'readonly');
      const objectStore = transaction.objectStore(this.pedidosStoreName);
      const index = objectStore.index('transportistaId');
      const request = index.getAll(transportistaId);

      request.onsuccess = () => {
        resolve(request.result as PedidoDB[]);
      };

      request.onerror = () => {
        console.error('Error al obtener pedidos por transportista:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Actualizar estado de un pedido
   */
  async actualizarEstadoPedido(pedidoId: number, estado: PedidoDB['estado']): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.pedidosStoreName], 'readwrite');
      const objectStore = transaction.objectStore(this.pedidosStoreName);
      const getRequest = objectStore.get(pedidoId);

      getRequest.onsuccess = () => {
        const pedido = getRequest.result;
        if (pedido) {
          pedido.estado = estado;
          pedido.updatedAt = new Date().toISOString();
          
          const updateRequest = objectStore.put(pedido);
          
          updateRequest.onsuccess = () => {
            console.log('Estado del pedido actualizado');
            resolve();
          };
          
          updateRequest.onerror = () => {
            console.error('Error al actualizar estado:', updateRequest.error);
            reject(updateRequest.error);
          };
        } else {
          reject(new Error('Pedido no encontrado'));
        }
      };

      getRequest.onerror = () => {
        console.error('Error al obtener pedido:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  /**
   * Obtener usuarios por rol
   */
  async obtenerUsuariosPorRol(rol: UsuarioDB['rol']): Promise<UsuarioDB[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const todosUsuarios = request.result as UsuarioDB[];
        const usuariosFiltrados = todosUsuarios.filter(u => u.rol === rol);
        resolve(usuariosFiltrados);
      };

      request.onerror = () => {
        console.error('Error al obtener usuarios por rol:', request.error);
        reject(request.error);
      };
    });
  }
}
