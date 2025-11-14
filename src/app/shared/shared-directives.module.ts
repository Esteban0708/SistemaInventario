import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { ParallaxOnScrollDirective } from './directives/parallax-on-scroll.directive';

@NgModule({
  declarations: [RevealOnScrollDirective, ParallaxOnScrollDirective],
  imports: [CommonModule],
  exports: [RevealOnScrollDirective, ParallaxOnScrollDirective]
})
export class SharedDirectivesModule {}
