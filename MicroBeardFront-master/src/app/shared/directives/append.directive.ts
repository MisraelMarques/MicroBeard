import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';

@Directive({
  selector: '[appAppend]'
})
export class AppendDirective implements OnChanges {
  @Input('appAppend') collaboratorParam: Collaborator;

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.collaboratorParam.currentValue){
      const licenseNum = changes.collaboratorParam.currentValue.licenses.length;
      const span = this.renderer.createElement('span');
      const text = this.renderer.createText(` (${licenseNum}) licenses`)

      this.renderer.appendChild(span, text);
      this.renderer.appendChild(this.element.nativeElement, span);
    }
  }
}
