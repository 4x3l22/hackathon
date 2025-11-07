import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  phoneNumber: string = '';
  password: string = '';

  get isPhoneValid(): boolean {
    // Debe ser exactamente 10 dígitos numéricos
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(this.phoneNumber);
  }

  get isPasswordValid(): boolean {
    // Mínimo 8 caracteres
    return this.password.length >= 8;
  }

  get isFormValid(): boolean {
    return this.isPhoneValid && this.isPasswordValid;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Eliminar caracteres no numéricos y limitar a 10 dígitos
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.phoneNumber = input.value;
  }

  onSubmit(): void {
    if (!this.isFormValid) {
      return;
    }

    // Aquí iría la lógica de autenticación
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: 'Inicio de sesión exitoso',
      confirmButtonColor: '#4CAF50'
    });
  }
}
