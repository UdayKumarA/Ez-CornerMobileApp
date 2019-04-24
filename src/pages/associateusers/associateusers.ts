import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-associateusers',
  templateUrl: 'associateusers.html',
})
export class AssociateusersPage {

  assUsersLocalData: any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.assUsersLocalData = globalData;
      console.log(this.assUsersLocalData);
    })
  }
}
