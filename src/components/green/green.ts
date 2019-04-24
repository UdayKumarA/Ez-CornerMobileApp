import { Component } from '@angular/core';

/**
 * Generated class for the GreenComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'green',
  templateUrl: 'green.html'
})
export class GreenComponent {

  text: string;

  constructor() {
    //console.log('Hello GreenComponent Component');
    this.text = 'Both Managers Accepted your timesheet.';
  }

}
