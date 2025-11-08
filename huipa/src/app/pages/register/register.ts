import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioDB } from '../../services/indexeddb.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  form: FormGroup;
  selectedRole: 'cliente' | 'artesano' | 'logistica' | 'transportista' = 'cliente';
  previewUrl: string | null = null;
  imageBase64: string | null = null;
  // Optional workshop section
  workshopPhotos: Array<{ previewUrl: string; base64: string }> = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      documentType: ['', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Campos opcionales solo para artesanos
      residence: [''],
      street: [''],
      addressNumber: [''],
      neighborhood: [''],
      houseNumber: [''],
      phone: [''],
      bio: [''],
      showWorkshop: [false]
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos',
        confirmButtonColor: '#8B5A2B'
      });
      return;
    }

    try {
      // Preparar datos del usuario para IndexedDB
      const usuarioData: Omit<UsuarioDB, 'id' | 'createdAt'> = {
        email: this.form.value.email,
        password: this.form.value.password,
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        birthDate: this.form.value.birthDate,
        documentType: this.form.value.documentType,
        documentNumber: this.form.value.documentNumber,
        residence: this.form.value.residence || '',
        street: this.form.value.street || '',
        addressNumber: this.form.value.addressNumber || '',
        neighborhood: this.form.value.neighborhood || '',
        houseNumber: this.form.value.houseNumber || '',
        phone: this.form.value.phone || '',
        photo: this.imageBase64 || undefined,
        rol: this.selectedRole,
        isArtisan: this.selectedRole === 'artesano',
        artisanData: this.selectedRole === 'artesano' ? {
          lifeStory: this.form.value.bio || '',
          workshopGallery: this.workshopPhotos.map(p => p.base64)
        } : undefined
      };

      console.log('Registrando usuario con rol:', this.selectedRole);
      console.log('Datos completos del usuario:', usuarioData);

      // Registrar usuario en IndexedDB
      const userId = await this.authService.registrarUsuario(usuarioData);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente',
        confirmButtonColor: '#3C8D40',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirigir al login
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error al registrar:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.message || 'No se pudo completar el registro',
        confirmButtonColor: '#d33'
      });
    }
  }

  setRole(r: 'cliente' | 'artesano' | 'logistica' | 'transportista') {
    this.selectedRole = r;
    
    // Actualizar validadores según el rol
    const camposArtesano = ['residence', 'street', 'addressNumber', 'neighborhood', 'houseNumber', 'phone'];
    
    if (r === 'artesano') {
      // Hacer campos requeridos para artesano
      camposArtesano.forEach(campo => {
        this.form.get(campo)?.setValidators([Validators.required]);
        this.form.get(campo)?.updateValueAndValidity();
      });
      // Activar el switch de artesano
      this.form.get('showWorkshop')?.setValue(true);
    } else {
      // Quitar validadores requeridos para otros roles
      camposArtesano.forEach(campo => {
        this.form.get(campo)?.clearValidators();
        this.form.get(campo)?.updateValueAndValidity();
      });
      // Desactivar el switch de artesano
      this.form.get('showWorkshop')?.setValue(false);
      this.workshopPhotos = [];
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return this.clearImage();
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is data:[<mediatype>];base64,<data>
      this.previewUrl = result;
      // store only the base64 payload (strip prefix)
      const commaIndex = result.indexOf(',');
      this.imageBase64 = commaIndex !== -1 ? result.substring(commaIndex + 1) : result;
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.previewUrl = null;
    this.imageBase64 = null;
    // If you want to also clear the input element, template re-selecting will handle it (file input is not bound)
  }

  /** Workshop gallery helpers */
  onWorkshopFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const commaIndex = result.indexOf(',');
        const base64 = commaIndex !== -1 ? result.substring(commaIndex + 1) : result;
        this.workshopPhotos.push({ previewUrl: result, base64 });
      };
      reader.readAsDataURL(file);
    });
    // Optionally reset the input so same file selection later triggers change
    input.value = '';
  }

  removeWorkshopPhoto(index: number) {
    this.workshopPhotos.splice(index, 1);
  }

  clearWorkshopPhotos() {
    this.workshopPhotos = [];
  }
}