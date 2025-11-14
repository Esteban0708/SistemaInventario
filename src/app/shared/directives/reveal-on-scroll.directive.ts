import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]'
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() rootMargin = '0px 0px -10% 0px';
  @Input() repeat = false;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    this.rd.addClass(el, 'reveal');

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.rd.addClass(el, 'in-view');
          if (!this.repeat) this.observer?.unobserve(el);
        } else if (this.repeat) {
          this.rd.removeClass(el, 'in-view');
        }
      });
    }, { root: null, rootMargin: this.rootMargin, threshold: 0.12 });

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
