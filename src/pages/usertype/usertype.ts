import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-usertype',
  templateUrl: 'usertype.html',
})
export class UsertypePage {

  userTypeLocalData: any;
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,private menuCtrl:MenuController) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => { 
      this.userTypeLocalData = globalData;
      console.log(this.userTypeLocalData);
    });
  }
}
