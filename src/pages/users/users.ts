import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  usersLocalData: any;
  constructor(public storage: Storage,private menuCtrl:MenuController, public navCtrl: NavController, public navParams: NavParams) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage(){
    this.storage.get('globalData').then((globalData) => {
      this.usersLocalData = globalData;
      console.log(this.usersLocalData);
    })
  }

}
