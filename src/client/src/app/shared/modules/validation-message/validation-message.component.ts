import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  animations: [
    trigger('errorState', [
      state(
        'hidden',
        style({
          display: 'none',
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          display: 'inline-block',
          opacity: 1,
        })
      ),
      transition('visible => hidden', animate('500ms ease-in')),
      transition('hidden => visible', animate('500ms ease-out')),
    ]),
  ],
})
export class ValidationMessageComponent implements OnInit {
  @Input() entityControl: AbstractControl;
  @Input() validationMessages: any;

  constructor() {}

  ngOnInit() {}
}
