import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
 @Input({ required: true }) text: string = 'Field';
  
  // We accept the AbstractControl directly via dynamicControl for simplicity
  @Input({ required: false }) dyanmicControl!: AbstractControl | any; 
  
  control!: AbstractControl | null;

  ngOnInit() {
    // If passed directly
    if (this.dyanmicControl) {
      this.control = this.dyanmicControl;
    }
    // If you had the directive logic, it would go here
  }
}
