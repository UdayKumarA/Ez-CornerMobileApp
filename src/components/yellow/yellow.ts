import { Component } from '@angular/core';

/**
 * Generated class for the YellowComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'yellow',
  templateUrl: 'yellow.html'
})
export class YellowComponent {

  text: string;

  constructor() {
    //console.log('Hello YellowComponent Component');
    this.text = 'Employee Saves his/her Timesheet and can edit until they submit.';
  }

}
