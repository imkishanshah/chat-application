import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName]',
    exportAs: 'control',
})
export class ControlDirective {
    constructor(@Optional() public control: NgControl) {
    }
}
