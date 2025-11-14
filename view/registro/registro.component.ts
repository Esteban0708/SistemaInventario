import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../service/registro.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  registroForm!: FormGroup;
  planSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: RegistroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.planSeleccionado = Number(localStorage.getItem('planSeleccionado'));

    if (!this.planSeleccionado) {
      this.router.navigate(['/']);
    }

    this.registroForm = this.fb.group({
      nombreTienda: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  registrar() {
    if (this.registroForm.invalid) return;

    const body = {
      ...this.registroForm.value,
      idPlan: this.planSeleccionado
    };

    this.auth.registro(body).subscribe({
      next: () => {
        if (this.planSeleccionado === 1) {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/pago']);
        }
      }
    });
  }
}
