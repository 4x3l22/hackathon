import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Lightweight stub AuthService so RegisterComponent can subscribe during development.
 * Replace or expand this service later to use HttpClient and real API endpoints.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  /**
   * Placeholder register method. Returns an observable that emits a fake success object.
   * The RegisterComponent expects this to exist and subscribe to it. Replace implementation later.
   */
  register(payload: any): Observable<any> {
    console.log('[AuthService] register called with payload:', payload);
    // Return a fake success response. In future, replace with HttpClient.post(...) to backend.
    return of({ success: true, message: 'stub - replace with real HTTP call' });
  }
}
