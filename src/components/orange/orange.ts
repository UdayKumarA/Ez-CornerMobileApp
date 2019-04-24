import { Component } from '@angular/core';

/**
 * Generated class for the OrangeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'orange',
  templateUrl: 'orange.html'
})
export class OrangeComponent {

  text: string;

  constructor() {
    //console.log('Hello OrangeComponent Component');
    this.text = 'Pending at level 1 Manager.';
  }

}
