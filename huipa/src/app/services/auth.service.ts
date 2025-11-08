import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Usuario, validarCredenciales } from '../../utils/usuariosMock';
import { IndexedDBService, UsuarioDB } from './indexeddb.service';

/**
 * AuthService que maneja autenticación con usuarios mock e IndexedDB
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private indexedDBService: IndexedDBService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Cargar usuario desde localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  /**
   * Método para hacer login verificando tanto mock como IndexedDB
   */
  async loginWithCredentials(email: string, password: string): Promise<Usuario | null> {
    // Primero intentar con usuarios mock
    const usuarioMock = validarCredenciales(email, password);
    if (usuarioMock) {
      this.login(usuarioMock);
      return usuarioMock;
    }

    // Si no se encuentra en mock, buscar en IndexedDB
    if (this.isBrowser) {
      const usuarioDB = await this.indexedDBService.validarCredenciales(email, password);
      if (usuarioDB) {
        // Convertir UsuarioDB a Usuario para mantener compatibilidad
        const usuario: Usuario = {
          id: usuarioDB.id!,
          email: usuarioDB.email,
          password: usuarioDB.password,
          nombre: `${usuarioDB.firstName} ${usuarioDB.lastName}`,
          rol: usuarioDB.rol,
          telefono: usuarioDB.phone,
          ubicacion: usuarioDB.residence,
          imagenPerfil: usuarioDB.photo
        };
        this.login(usuario);
        return usuario;
      }
    }

    return null;
  }

  /**
   * Método para hacer login y guardar el usuario autenticado
   */
  login(usuario: Usuario): void {
    // Guardar en localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(usuario));
    }
    // Emitir el usuario actual
    this.currentUserSubject.next(usuario);
  }

  /**
   * Registrar un nuevo usuario en IndexedDB
   */
  async registrarUsuario(usuario: Omit<UsuarioDB, 'id' | 'createdAt'>): Promise<number> {
    if (!this.isBrowser) {
      throw new Error('Registro solo disponible en el navegador');
    }

    // Verificar si el email ya existe
    const emailExiste = await this.indexedDBService.emailExiste(usuario.email);
    if (emailExiste) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Registrar usuario
    const id = await this.indexedDBService.registrarUsuario(usuario);
    return id;
  }

  /**
   * Placeholder register method. Returns an observable that emits a fake success object.
   * The RegisterComponent expects this to exist and subscribe to it. Replace implementation later.
   */
  register(payload: any): Observable<any> {
    console.log('[AuthService] register called with payload:', payload);
    // Return a fake success response. In future, replace with HttpClient.post(...) to backend.
    return of({ success: true, message: 'stub - replace with real HTTP call' });
  }

  /**
   * Método para obtener el usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Método para cerrar sesión
   */
  logout(): void {
    // Limpiar localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    // Primero verificar el BehaviorSubject
    if (this.currentUserSubject.value !== null) {
      return true;
    }
    
    // Si no hay usuario en el subject, verificar localStorage
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        // Si hay usuario en localStorage pero no en el subject, cargarlo
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
          return true;
        } catch (e) {
          // Si hay error al parsear, limpiar localStorage
          localStorage.removeItem('currentUser');
        }
      }
    }
    
    return false;
  }

  /**
   * Verificar si el usuario es artesano
   */
  isArtesano(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === 'artesano';
  }
}
