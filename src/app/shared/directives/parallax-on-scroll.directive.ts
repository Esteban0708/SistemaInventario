import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[parallaxOnScroll]'
})
export class ParallaxOnScrollDirective implements OnInit {
  @Input() speed = 0.12; 

  private startTop = 0;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnInit(): void {
    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    this.startTop = rect.top + window.scrollY;
  }

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    const delta = (y - this.startTop) * this.speed;
    this.rd.setStyle(this.el.nativeElement, 'transform', `translateY(${delta}px)`);
  }
}
