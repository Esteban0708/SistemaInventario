import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  open = false;
  close(){ this.open = false; }

  scrolled = false;
  @HostListener('window:scroll')
  onScroll(){ this.scrolled = window.scrollY > 4; }
}
