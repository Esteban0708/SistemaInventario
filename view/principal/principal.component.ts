import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  constructor(private router: Router) { }

  seleccionarPlan(idPlan: number) {
    console.log(`Plan seleccionado: ${idPlan}`);
    localStorage.setItem('planSeleccionado', idPlan.toString());
    this.router.navigate(['/registro']);
  }
}
