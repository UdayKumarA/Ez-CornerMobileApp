import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-addeditrole',
  templateUrl: 'addeditrole.html',
})
export class AddeditrolePage {
  addEditRoleLocalData:any;
  constructor(public storage: Storage, public navCtrl: NavController, private menuCtrl:MenuController, public navParams: NavParams) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.addEditRoleLocalData = globalData;
      console.log('Addeditrole - ',this.addEditRoleLocalData);
    })
  }
}
