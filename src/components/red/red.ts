import { Component } from '@angular/core';

/**
 * Generated class for the RedComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'red',
  templateUrl: 'red.html'
})
export class RedComponent {

  text: string;

  constructor() {
    //console.log('Hello RedComponent Component');
    this.text = 'Rejected by any Managers will be marked as red & re-submit timesheet.';
  }

}
