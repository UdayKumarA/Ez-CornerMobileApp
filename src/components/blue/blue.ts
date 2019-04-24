import { Component } from '@angular/core';

/**
 * Generated class for the BlueComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'blue',
  templateUrl: 'blue.html'
})
export class BlueComponent {

  text: string;

  constructor() {
    //console.log('Hello BlueComponent Component');
    this.text = 'Waiting for Managers approval.';
  }

}
