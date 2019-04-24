import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-addeditprojects',
  templateUrl: 'addeditprojects.html',
})
export class AddeditprojectsPage {

  addEditProjLocalData:any;
  
  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,private menuCtrl:MenuController) {
    this.menuCtrl.enable(true);
    this.localStorage();
  }
  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.addEditProjLocalData = globalData;
      console.log('Addeditprojects - ',this.addEditProjLocalData);
    })
  }

  
}
