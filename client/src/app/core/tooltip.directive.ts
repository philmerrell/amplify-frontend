import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.showTimeout = setTimeout(() => {
      this.createTooltip();
    }, 600); // Delay of 300ms
  }

  @HostListener('mouseleave') onMouseLeave() {
    clearTimeout(this.showTimeout); // Clear timeout to prevent tooltip creation
    this.destroyTooltip();
  }

  private createTooltip() {
    if (!this.tooltipText) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(
      document.body,
      this.tooltipElement
    );

    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '13px');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = {
      top: hostPos.top - 20, // Adjust position above the component
      left: hostPos.left + hostPos.width / 2,
    };

    this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPos.top - this.tooltipElement!.offsetHeight}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipPos.left}px`);
    this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');

    this.renderer.setProperty(this.tooltipElement, 'innerText', this.tooltipText);
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}