import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-previewtimesheet',
  templateUrl: 'previewtimesheet.html',
})
export class PreviewtimesheetPage {

  private headers = new HttpHeaders().set("Content-Type", "application/json");
  actionURL:any;
  empinfoafterlogin: any; monthData: any; monthHours: any;
  data: any; userID: any; empName: any; projectName: any;
  previewData: any; previewIndividualMonth: any;
  printingDateArray: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public _http: HttpClient, public toastCtrl: ToastController, private menuCtrl: MenuController) {
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';
    
    this.menuCtrl.enable(true);
    this.monthData = this.navParams.get('sendMonth');
    console.log(this.monthData);
    this.monthHours = this.navParams.get('sendHours');
    console.log(this.monthHours);
    this.data = this.navParams.get('sending');
    console.log(this.data);
    this.empinfoafterlogin = this.data.EmpInfobyLogin;
    this.userID = this.empinfoafterlogin.userid;
    console.log(this.userID);
    this.empName = this.empinfoafterlogin.userName;
    this.projectName = this.empinfoafterlogin.projectName;
    const [monthName, yearName] = this.monthData.split(" ");
    this._http.post(this.actionURL+'GetUserTimesheet/' + this.userID + '/' + yearName + '-' + monthName + '-' + "1", { headers: this.headers })
      .subscribe(res => {
        this.previewData = res;
        if (this.previewData.StatusCode == 200) {
          this.previewIndividualMonth = this.previewData.timeSheetDetails;
          //console.log(this.previewIndividualMonth);
        }
        this.changeDates();
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          alert('Error in retrieving');
        }
      });
  }

  changeDates() {
    var printingLength = this.previewIndividualMonth.length;
    var namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < printingLength; i++) {
      //console.log(this.previewIndividualMonth[i].TaskDate);
      var printActualDate = this.previewIndividualMonth[i].TaskDate;
      //console.log(namesOfDays[new Date(new Date(printActualDate).getFullYear(), new Date(printActualDate).getMonth(), i+1).getDay()]+', '+ new Date(printActualDate).getDate());
      var printDate = namesOfDays[new Date(new Date(printActualDate).getFullYear(), new Date(printActualDate).getMonth(), i+1).getDay()] + ', ' + new Date(printActualDate).getDate();
      this.previewIndividualMonth[i].TaskDate = printDate;
      }
    console.log(this.previewIndividualMonth);
  }
}
