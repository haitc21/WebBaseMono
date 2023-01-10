import { Component, Input, OnInit } from '@angular/core';
import {  AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-msg',
  templateUrl: './validation-msg.component.html'
})
export class ValidationMsgComponent implements OnInit {

  @Input() entityControl: AbstractControl;
  @Input() validationMessages: any;

  constructor() { }

  ngOnInit() {
  }
}
