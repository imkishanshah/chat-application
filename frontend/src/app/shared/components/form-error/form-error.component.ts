import { Component, Input } from '@angular/core';
import { ControlDirective } from '../../directives/control.directive';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  Object = Object;
  @Input({ required: true }) text: string = 'Field';
  control!: any;
  @Input({ required: false }) controlRef!: ControlDirective;
  @Input({ required: false }) dyanmicControl!: any;
  @Input() message: { [key in string]: string } = {};
  @Input() hideErrorFor: Array<string> = [];

  ngOnInit() {
    if (this.controlRef?.control?.control) {
      this.control = this.controlRef?.control?.control;
    } else if (this.dyanmicControl) {
      this.control = this.dyanmicControl;
    }
  }
}
