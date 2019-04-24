import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-accountmanagement',
  templateUrl: 'accountmanagement.html',
})
export class AccountmanagementPage {

  AccMgtLocalData:any;
  
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController) {
    this.menuCtrl.enable(true);
    this.storageData();
  }
  storageData() {
    this.storage.get('globalData').then((globalData) => {
      this.AccMgtLocalData = globalData;
      console.log('Accountmanagement - ',this.AccMgtLocalData);
    })
  }

}
