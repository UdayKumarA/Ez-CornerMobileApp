import { Component } from '@angular/core';

/**
 * Generated class for the PeachComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'peach',
  templateUrl: 'peach.html'
})
export class PeachComponent {

  text: string;

  constructor() {
    //console.log('Hello PeachComponent Component');
    this.text = 'Pending at level 2 Manager.';
  }

}
