import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AddeventPage } from '../addevent/addevent';
import { ListeventsPage } from '../listevents/listevents';

@IonicPage()
@Component({
  selector: 'page-leavecalendar',
  templateUrl: 'leavecalendar.html',
})
export class LeavecalendarPage {
  globalData: any;
  selectedDate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.globalData = this.navParams.get('sendData');
    console.log(this.globalData);
  }
  onDaySelect($event) {
    console.log($event);
    if (($event.month + 1) >= 1 && ($event.month + 1) <= 9) {
      if ($event.date >= 1 && $event.date <= 9) {
        this.selectedDate = $event.year + '-' + '0' + ($event.month + 1) + '-' + '0' + $event.date;
        if (new Date(this.selectedDate).getDate() === new Date().getDate()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) > new Date()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) < new Date()) {
          console.log("Display the Leaves");
          this.alertRaise();
        }
      } else if ($event.date > 9 && $event.date <= 31) {
        this.selectedDate = $event.year + '-' + '0' + ($event.month + 1) + '-' + $event.date;
        if (new Date(this.selectedDate).getDate() === new Date().getDate()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) > new Date()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) < new Date()) {
          console.log("Display the Leaves");
          this.alertRaise();
        }
      }
    } else if (($event.month + 1) >= 10 && ($event.month + 1) <= 12) {
      if ($event.date >= 1 && $event.date <= 9) {
        this.selectedDate = $event.year + '-' + ($event.month + 1) + '-' + '0' + $event.date;
        if (new Date(this.selectedDate).getDate() === new Date().getDate()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) > new Date()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) < new Date()) {
          console.log("Display the Leaves");
          this.alertRaise();
        }
      } else if ($event.date > 9 && $event.date <= 31) {
        this.selectedDate = $event.year + '-' + ($event.month + 1) + '-' + $event.date;
        if (new Date(this.selectedDate).getDate() === new Date().getDate()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) > new Date()) {
          this.alertRaise();
        } else if (new Date(this.selectedDate) < new Date()) {
          console.log("Display the Leaves");
          this.alertRaise();
        }
      }
    }
  }
  alertRaise() {
    let alert = this.alertCtrl.create({
      title: 'Manage',
      buttons: [
        {
          text: 'Leaves',
          handler: () => {
            console.log('Leave Page');
            this.navCtrl.push(AddeventPage, { pushData: this.selectedDate });
          }
        },
        {
          text: 'Events',
          handler: () => {
            console.log('Events');
          }
        }
      ]
    })
    alert.present();
  }
}