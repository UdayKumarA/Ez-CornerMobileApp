import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-approvalsrejections',
  templateUrl: 'approvalsrejections.html',
})
export class ApprovalsrejectionsPage {

  approvalRejectionLocalData: any;

  constructor(public storage: Storage, public navCtrl: NavController, public menuCtrl:MenuController, public navParams: NavParams) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.approvalRejectionLocalData = globalData;
      console.log('Approvalsrejections - ',this.approvalRejectionLocalData);
    })
  }

}
