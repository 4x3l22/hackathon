import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resetpassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './resetpassword.html',
  styles: ``,
})
export class Resetpassword {
  // Estado del flujo
  step: 'phone' | 'code' | 'password' = 'phone';
  
  // Datos del formulario
  phoneNumber: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Control de estado
  codeSent: boolean = false;
  codeVerified: boolean = false;
  isLoading: boolean = false;
  
  // Temporizador
  canResendCode: boolean = true;
  resendTimer: number = 0;
  private timerInterval: any;
  
  // Código simulado (en producción vendría del backend)
  private generatedCode: string = '';

  // Validación de teléfono
  get isPhoneValid(): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(this.phoneNumber);
  }

  // Validación de código
  get isCodeValid(): boolean {
    return this.verificationCode.length === 6 && /^\d{6}$/.test(this.verificationCode);
  }

  // Validación de contraseña
  get isPasswordValid(): boolean {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número
    const hasMinLength = this.newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(this.newPassword);
    const hasLowerCase = /[a-z]/.test(this.newPassword);
    const hasNumber = /[0-9]/.test(this.newPassword);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  }

  // Validaciones individuales para mostrar en el template
  get hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  // Validación de confirmación de contraseña
  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
  }

  // Validación del formulario según el paso
  get canProceed(): boolean {
    switch (this.step) {
      case 'phone':
        return this.isPhoneValid;
      case 'code':
        return this.isCodeValid;
      case 'password':
        return this.isPasswordValid && this.passwordsMatch;
      default:
        return false;
    }
  }

  // Formatear solo números en el teléfono
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.phoneNumber = input.value;
  }

  // Formatear solo números en el código
  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    this.verificationCode = input.value;
  }

  // Enviar código de verificación
  async sendVerificationCode(): Promise<void> {
    if (!this.isPhoneValid || this.isLoading) return;

    this.isLoading = true;

    // Simular llamada al backend para verificar si el teléfono existe
    setTimeout(() => {
      // Generar código aleatorio de 6 dígitos
      this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('Código generado:', this.generatedCode); // Solo para desarrollo
      
      this.codeSent = true;
      this.step = 'code';
      this.isLoading = false;
      
      this.startResendTimer();
      
      Swal.fire({
        icon: 'success',
        title: 'Código Enviado',
        text: `Se ha enviado un código de verificación al número ${this.phoneNumber}`,
        confirmButtonColor: '#a07034'
      });
    }, 1500);
  }

  // Reenviar código
  resendCode(): void {
    if (!this.canResendCode) return;
    
    this.sendVerificationCode();
  }

  // Temporizador para reenvío
  startResendTimer(): void {
    this.canResendCode = false;
    this.resendTimer = 60;
    
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      
      if (this.resendTimer <= 0) {
        this.canResendCode = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  // Verificar código
  verifyCode(): void {
    if (!this.isCodeValid || this.isLoading) return;

    this.isLoading = true;

    // Simular validación del código
    setTimeout(() => {
      if (this.verificationCode === this.generatedCode) {
        this.codeVerified = true;
        this.step = 'password';
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Código Verificado',
          text: 'Ahora puedes establecer tu nueva contraseña',
          confirmButtonColor: '#a07034'
        });
      } else {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Código Incorrecto',
          text: 'El código ingresado no es válido. Intenta nuevamente.',
          confirmButtonColor: '#a07034'
        });
      }
    }, 1000);
  }

  // Guardar nueva contraseña
  saveNewPassword(): void {
    if (!this.canProceed || this.isLoading) return;

    this.isLoading = true;

    // Simular guardado de la nueva contraseña
    setTimeout(() => {
      this.isLoading = false;
      
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña Actualizada!',
        text: 'Tu contraseña ha sido cambiada exitosamente',
        confirmButtonColor: '#a07034'
      }).then(() => {
        // Aquí redirigiría al login
        this.resetForm();
      });
    }, 1500);
  }

  // Resetear formulario
  resetForm(): void {
    this.step = 'phone';
    this.phoneNumber = '';
    this.verificationCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.codeSent = false;
    this.codeVerified = false;
    this.canResendCode = true;
    this.resendTimer = 0;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Volver al paso anterior
  goBack(): void {
    if (this.step === 'code') {
      this.step = 'phone';
      this.verificationCode = '';
    } else if (this.step === 'password') {
      this.step = 'code';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
