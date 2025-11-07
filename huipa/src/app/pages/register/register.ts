import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.html',
})
export class RegisterComponent {
  form: FormGroup;
  role: 'usuario' | 'artesano' | 'logistico' = 'usuario';
  previewUrl: string | null = null;
  imageBase64: string | null = null;
  // Optional workshop section
  workshopPhotos: Array<{ previewUrl: string; base64: string }> = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required]],
      residence: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
  bio: [''] ,
  showWorkshop: [false]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Prepare payload to send to the (future) AuthService
        const payload: any = {
          ...this.form.value,
          role: this.role,
          image: this.imageBase64 // base64 string or null
        };

        // include optional workshop info only if the section is enabled
        if (this.form.get('showWorkshop')?.value) {
          if (this.form.get('bio')) payload.bio = this.form.get('bio')?.value || null;
          if (this.workshopPhotos && this.workshopPhotos.length) {
            payload.workshopPhotos = this.workshopPhotos.map((p) => p.base64);
          }
        }

      // Subscribe to the AuthService.register - ready for the real implementation later
      this.authService.register(payload).pipe(take(1)).subscribe({
        next: (res: any) => {
          // handle success (redirect, show toast, etc.)
          console.log('register success', res);
        },
        error: (err: any) => {
          // handle error
          console.error('register error', err);
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  setRole(r: 'usuario' | 'artesano' | 'logistico') {
    this.role = r;
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