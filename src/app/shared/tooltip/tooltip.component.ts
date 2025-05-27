import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tooltip',
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() text = '';

  constructor(private el: ElementRef) { }
}
