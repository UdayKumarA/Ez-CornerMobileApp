import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';

@IonicPage()
@Component({
  selector: 'page-managerempts',
  templateUrl: 'managerempts.html',
})
export class ManageremptsPage {

  private headers = new HttpHeaders().set("Content-Type", "application/json");
  actionURL:any;
  fullDataofMonth: any; monthNyear: any; empMonthlyPreviewData: any; empUserID: any; nameOfEmp: any; totalHours: any;
  fullManagerData: any; tsID: any; mgrName: any; mgrID: any; monthlyDetails: any[] = [];

  individualMonthDisplayAccept: any; individualMonthDisplayReject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _http: HttpClient, private menuCtrl: MenuController,
    private sp: SubmittimesheetProvider, private toastCtrl: ToastController, public alertCtrl:AlertController) {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';
    
    this.fullDataofMonth = this.navParams.get('sendFullData');
    //console.log(this.fullDataofMonth);
    this.fullManagerData = this.navParams.get('sendManagerData');
    //console.log(this.fullManagerData);
    this.empUserID = this.fullDataofMonth.Userid;
    //console.log(this.empUserID);
    this.nameOfEmp = this.fullDataofMonth.Username;
    this.tsID = this.fullDataofMonth.TimesheetID;
    this.mgrName = this.fullManagerData.EmpInfobyLogin.userName;
    //console.log(this.mgrName);
    this.mgrID = this.fullManagerData.EmpInfobyLogin.userid;
    //console.log(this.mgrID);
    this.monthNyear = this.fullDataofMonth.Month_Year;
    const [monthName, yearName] = this.monthNyear.split(" ");
    this._http.post(this.actionURL+'GetUserTimesheet/' + this.empUserID + '/' + yearName + '-' + monthName + '-' + "1", { headers: this.headers })
      .subscribe(res => {
        this.empMonthlyPreviewData = res;
        if (this.empMonthlyPreviewData.StatusCode == 200) {
          //console.log(this.empMonthlyPreviewData);
          this.monthlyDetails = this.empMonthlyPreviewData.timeSheetDetails;
        }        
        this.changeDates();
        //this.print();
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          let alert = this.alertCtrl.create({
            title:'Evolutyz Corner',
            message:'No Timesheets from server',
            buttons:['OK']
          })
          alert.present();
        }
      });
  }

  // print(){
  //   this.totalHours = 0;
  //   for(var i = 0; i < this.empMonthlyPreviewData.length; i++){
  //     this.totalHours += this.empMonthlyPreviewData[i].NoofHoursWorked;
  //   }
  //}
  changeDates() {
    var printingLength = this.monthlyDetails.length;
    var namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < printingLength; i++) {
      //console.log(this.previewIndividualMonth[i].TaskDate);
      var printActualDate = this.monthlyDetails[i].TaskDate;
      //console.log(namesOfDays[new Date(new Date(printActualDate).getFullYear(), new Date(printActualDate).getMonth(), i+1).getDay()]+', '+ new Date(printActualDate).getDate());
      var printDate = namesOfDays[new Date(new Date(printActualDate).getFullYear(), new Date(printActualDate).getMonth(), i+1).getDay()] + ', ' + new Date(printActualDate).getDate();
      this.monthlyDetails[i].TaskDate = printDate;
      }
    console.log(this.monthlyDetails);
  }

  approve() {
    const approveObject = {
      timeSheetActions: {
        EmpUsrID: this.empUserID,
        timeSheetID: this.tsID,
        comments: 'Timesheet Approved by ' + this.mgrName + ' after Preview',
        SubmittedType: "1",
        ManagerId: this.mgrID
      }
    }
    console.log(approveObject);

    this.sp.approvets(approveObject)
      .subscribe(res => {
        this.individualMonthDisplayAccept = res;
        if (this.individualMonthDisplayAccept.status.StatusCode == 200) {
          if (this.individualMonthDisplayAccept.timeSheetActions.Position == 'L1') {
            let toast = this.toastCtrl.create({
              message: this.individualMonthDisplayAccept.timeSheetActions.Message,
              duration: 2500
            });
            toast.present();
            this.navCtrl.pop();
          }
          else if (this.individualMonthDisplayAccept.timeSheetActions.Position == 'L2') {
            let toast = this.toastCtrl.create({
              message: this.individualMonthDisplayAccept.timeSheetActions.Message,
              duration: 2500
            });
            toast.present();
            this.navCtrl.pop();
          }
        }
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          alert('Error in retrieving');
        }
      });
  }

  reject() {
    const rejectObject = {
      timeSheetActions: {
        EmpUsrID: this.empUserID,
        timeSheetID: this.tsID,
        comments: 'Timesheet Rejected by ' + this.mgrName + ' after Preview',
        SubmittedType: "0",
        ManagerId: this.mgrID
      }
    }
    console.log(rejectObject);

    this.sp.rejectts(rejectObject)
      .subscribe(res => {
        this.individualMonthDisplayReject = res
        if (this.individualMonthDisplayReject.status.StatusCode == 200) {
          if (this.individualMonthDisplayReject.timeSheetActions.Position == 'L1') {
            let toast = this.toastCtrl.create({
              message: this.individualMonthDisplayReject.timeSheetActions.Message,
              duration: 2500
            });
            toast.present();
            this.navCtrl.pop();
          }
          else if (this.individualMonthDisplayReject.timeSheetActions.Position == 'L2') {
            let toast = this.toastCtrl.create({
              message: this.individualMonthDisplayReject.timeSheetActions.Message,
              duration: 2500
            });
            toast.present();
            this.navCtrl.pop();
          }
        }
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          alert('Error in retrieving');
        }
      });
  }

}
