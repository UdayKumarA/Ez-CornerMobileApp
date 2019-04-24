import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-associatemodules',
  templateUrl: 'associatemodules.html',
})
export class AssociatemodulesPage {

  assModulesLocalData: any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private menuCtrl:MenuController) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.assModulesLocalData = globalData;
      console.log(this.assModulesLocalData);
    })
  }
}
