import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<img [src]="iconPath" [alt]="name">`,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent  {

  @Input() name: any;
  get iconPath(): string {
    return `assets/icons/${this.name}.svg`;
  }

}
