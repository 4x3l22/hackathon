import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isEmailValid(): boolean {
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  get isPasswordValid(): boolean {
    // Mínimo 6 caracteres
    return this.password.length >= 6;
  }

  get isFormValid(): boolean {
    return this.isEmailValid && this.isPasswordValid;
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor verifica el email y la contraseña',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    // Validar credenciales contra mock y base de datos
    const usuario = await this.authService.loginWithCredentials(this.email, this.password);

    if (usuario) {
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido ${usuario.nombre}!`,
        text: usuario.rol === 'artesano' ? 'Acceso como Artesano' : 'Acceso como Usuario',
        confirmButtonColor: '#3C8D40',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirigir según el rol del usuario
      setTimeout(() => {
        if (usuario.rol === 'artesano') {
          this.router.navigate(['/artisan-dashboard']);
        } else if (usuario.rol === 'logistica') {
          this.router.navigate(['/logistics-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      }, 2000);
    } else {
      // Credenciales incorrectas
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Email o contraseña incorrectos',
        confirmButtonColor: '#d33'
      });
    }
  }
}
