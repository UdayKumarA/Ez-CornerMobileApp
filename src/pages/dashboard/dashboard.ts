import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, MenuController, PopoverController } from 'ionic-angular';
import { ViewtimesheetPage } from '../../pages/viewtimesheet/viewtimesheet';
import { HttpClient } from '@angular/common/http';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { ManageremptsPage } from '../../pages/managerempts/managerempts';
import { ManagerempscrollsheetPage } from '../../pages/managerempscrollsheet/managerempscrollsheet';
import { PreviewtimesheetPage } from '../../pages/previewtimesheet/previewtimesheet';
import { EdittimesheetPage } from '../../pages/edittimesheet/edittimesheet';
import { Storage } from '@ionic/storage';

import { BlueComponent } from '../../components/blue/blue';
import { GreenComponent } from '../../components/green/green';
import { OrangeComponent } from '../../components/orange/orange';
import { PeachComponent } from '../../components/peach/peach';
import { RedComponent } from '../../components/red/red';
import { YellowComponent } from '../../components/yellow/yellow';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  timeInit(): any {
    this.todayHours = new Date().getHours();
    this.todayMinutes = new Date().getMinutes();
    this.todaySeconds = new Date().getSeconds();
  }
  myStyles: any;
  showTime: number;
  todaySeconds: number;
  todayMinutes: number;
  todayHours: number;
  isEditValid: any;
  localStorageData: any;
  empinfoafterlogin: any;
  fullEmpData: any[] = [];
  logoPathURI: any;
  actionURL: any;
  approvalItems = [];
  personalItems = [];
  array_items: any;
  myPersonalTimesheet: any[] = [];
  approvalsheets: any[] = [];
  startingPostition = '1';
  endingPosition = '100';
  
 
  data: any; userID: any; empName: any; projectID: any; projectName: any; message: any; accountType: any; companyLogo: any;
  Roleid: any; receivedResponseforReject: any; receivedResponseforAccept: any; isEditEnabled: boolean = false; show: boolean = false; buttonName: any = '+';

  constructor(public http: HttpClient, private toastCtrl: ToastController, private sp: SubmittimesheetProvider, private menuCtrl: MenuController,
    public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, 
    public storage: Storage, public popCtrl:PopoverController) {
    this.menuCtrl.enable(true);
    this.isEditValid = false;
    this.storageData();
    this.logoPathURI = 'http://192.168.75.12:7021/LoginCssNew/images/evolutyzcorplogo.png';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';

    this.timeInit();
    this.showTime = setInterval(() => {
      this.timeInit();
    }, 1000);
  }
  toggleStatus() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "-";
    else
      this.buttonName = "+";
  }
  popYellowControl(myYellowEvent) {
    let popover = this.popCtrl.create(YellowComponent);
    popover.present({
      ev: myYellowEvent
    });
  }
  popRedControl(myRedEvent) {
    let popover = this.popCtrl.create(RedComponent);
    popover.present({
      ev: myRedEvent
    });
  }
  popPeachControl(myPeachEvent) {
    let popover = this.popCtrl.create(PeachComponent);
    popover.present({
      ev: myPeachEvent
    });
  }
  popOrangeControl(myOrangeEvent) {
    let popover = this.popCtrl.create(OrangeComponent);
    popover.present({
      ev: myOrangeEvent
    });
  }
  popGreenControl(myGreenEvent) {
    let popover = this.popCtrl.create(GreenComponent);
    popover.present({
      ev: myGreenEvent
    });
  }
  popBlueControl(myBlueEvent) {
    let popover = this.popCtrl.create(BlueComponent);
    popover.present({
      ev: myBlueEvent
    });
  }

  storageData() {
    this.storage.get('globalData').then((globalData) => {
      this.localStorageData = globalData;
      console.log('Local Storage - ', this.localStorageData);
      this.empinfoafterlogin = this.localStorageData.EmpInfobyLogin;
      this.userID = this.empinfoafterlogin.userid;
      this.empName = this.empinfoafterlogin.userName;
      this.Roleid = this.empinfoafterlogin.RoleId;
      this.projectID = this.empinfoafterlogin.projectID;
      this.projectName = this.empinfoafterlogin.projectName;
      this.accountType = this.empinfoafterlogin.AccountType;
      this.companyLogo = this.logoPathURI + this.empinfoafterlogin.Companylogopath;
      //console.log(this.companyLogo);
      //console.log(this.userID + ' ' + this.empName +  ' ' + this.roleName + ' '+this.accountType+' '+this.projectID);
      console.log(this.Roleid);
      this.onLoadDashboardAPICall();
    });
  }

  onLoadDashboardAPICall() {
    var managerApproveSheets = {
      userid: this.userID,
     
     
      startposition: this.startingPostition,

      
      endPosition: this.endingPosition
    }
    //console.log(managerApproveSheets);

    this.http.post(this.actionURL + 'GetUserTimeSheetforApproval/', managerApproveSheets)
      .subscribe(res => {
        this.array_items = res;
        console.log(this.array_items);
        if (this.array_items.StatusCode == 200) {
         const arr_length = this.array_items.mytimesheets.length;
         const  mysheet =  this.array_items.mytimesheets.slice(0,5)
          this.myPersonalTimesheet =mysheet;

          console.log(this.myPersonalTimesheet,mysheet);
          const timeSheet = this.array_items.timesheetsforapproval.slice(0,5)
          this.approvalsheets = timeSheet;
          console.log(timeSheet);
          this.printApprovalsArray();
          this.printPersonalArray();
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            //alert('No Updated records from Server');
            let toast = this.toastCtrl.create({
              message: 'No Timesheets Found',
              duration: 3000,
            })
            toast.present();
          }
        });
  }

  printApprovalsArray() {
    for (let i = 0; i < this.approvalsheets.length; i++) {
      this.approvalItems.push(this.approvalsheets[i]);
    }
    console.log(this.approvalItems);
  }
  getColor(statusInfo) {
    switch (statusInfo) {
      case "yel":
        return "#FFFF00";
      case "red":
        return "#FF6347";
      case "pea":
        return "#FFDAB9";
      case "ora":
        return "#FFA500";
      case "gre":
        return "#228B22";
      case "tea":
        return "#8A2BE2"
    }
  }
  printPersonalArray() {
    console.log(this.myPersonalTimesheet.length);
    for (let i = 0; i < this.myPersonalTimesheet.length; i++)  {
      var statusInfo = this.myPersonalTimesheet[i].TimesheetStatus;
      if (statusInfo == "yel") {
        this.isEditValid = true;
      } else if (statusInfo == "red") {
        this.isEditValid = false;
      } else if (statusInfo == "pea") {
        this.isEditValid = false;
      } else if (statusInfo == "ora") {
        this.isEditValid = false;
      } else if (statusInfo == "gre") {
        this.isEditValid = false;
      } else if (statusInfo == "tea") {
        this.isEditValid = false;
      }
      var resultObj = {
        "Month_Year": this.myPersonalTimesheet[i].Month_Year,
        "CompanyBillingHours": this.myPersonalTimesheet[i].CompanyBillingHours,
        "ResourceWorkingHours": this.myPersonalTimesheet[i].ResourceWorkingHours,
        "TimesheetID": this.myPersonalTimesheet[i].TimesheetID,
        "TimesheetStatus": statusInfo,
        "isEditValid": this.isEditValid
      };
      this.personalItems.push(resultObj);
    }
    console.log(this.personalItems);
  }

  approveforEmp(timesheetID) {
    let alert = this.alertCtrl.create({
      title: 'Do you want to Approve TimeSheet ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Approve',
          handler: () => {
            this.approvedTimesheet(timesheetID);
          }
        }
      ]
    });
    alert.present();
  }

  rejectforEmp(timesheetID) {
    let alert = this.alertCtrl.create({
      title: 'Do you want to Reject Timesheet ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Reject',
          handler: () => {
            this.rejectedTimesheet(timesheetID);
          }
        }
      ]
    });
    alert.present();
  }

  approvedTimesheet(timesheetID) {
    var fullEmpData = this.approvalsheets.find(ts => ts.TimesheetID == timesheetID);
    //console.log(fullEmpData);

    const approveObject = {
      timeSheetActions: {
        EmpUsrID: fullEmpData.Userid,
        timeSheetID: fullEmpData.TimesheetID,
        comments: 'Timesheet approved by' + this.empName,
        ManagerId: this.userID,
        SubmittedType: "1"
      }
    }
    console.log(approveObject);

    this.sp.approvets(approveObject)
      .subscribe(res => {
        this.receivedResponseforAccept = res;
        console.log(this.receivedResponseforAccept);
        if (this.receivedResponseforAccept.status.StatusCode == 200) {
          if (this.receivedResponseforAccept.timeSheetActions.Position == 'L1') {
            console.log('l1 entered');
            let toast = this.toastCtrl.create({
              message: this.receivedResponseforAccept.timeSheetActions.Message,
              duration: 3000
            });
            toast.present();
          }
          else if (this.receivedResponseforAccept.timeSheetActions.Position == 'L2') {
            console.log('l2 entered');
            let toast = this.toastCtrl.create({
              message: this.receivedResponseforAccept.timeSheetActions.Message,
              duration: 3000
            });
            toast.present();
          }
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            alert('No Actions');
          }
        });
  }

  rejectedTimesheet(timesheetID) {
    var fullEmpData = this.approvalsheets.find(ts => ts.TimesheetID == timesheetID);
    console.log(fullEmpData);
    const rejectObject = {
      timeSheetActions: {
        EmpUsrID: fullEmpData.Userid,
        timeSheetID: fullEmpData.TimesheetID,
        comments: 'Timesheet rejected by ' + this.empName,
        ManagerId: this.userID,
        SubmittedType: "0"
      }
    }
    console.log(rejectObject);

    this.sp.rejectts(rejectObject)
      .subscribe(res => {
        this.receivedResponseforReject = res;
        console.log(this.receivedResponseforReject);
        if (this.receivedResponseforReject.status.StatusCode == 200) {
          if (this.receivedResponseforReject.timeSheetActions.Position == 'L1') {
            console.log('l1 Manager entered');
            let toast = this.toastCtrl.create({
              message: this.receivedResponseforReject.timeSheetActions.Message,
              duration: 3000
            });
            toast.present();
          }
          else if (this.receivedResponseforReject.timeSheetActions.Position == 'L2') {
            console.log('l2 Manager entered');
            let toast = this.toastCtrl.create({
              message: this.receivedResponseforReject.timeSheetActions.Message,
              duration: 3000
            });
            toast.present();
          }
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            alert('No Actions');
          }
        });
  }

  previewforEmp(month_year, timesheetID, name, empid) {
    this.fullEmpData = this.approvalsheets.find(ts => ts.TimesheetID == timesheetID);
    console.log(this.fullEmpData);
    this.navCtrl.push(ManageremptsPage, { sendFullData: this.fullEmpData, sendManagerData: this.localStorageData });
  }
  loadMore() {
    this.navCtrl.push(ManagerempscrollsheetPage, { sendUserFullData: this.localStorageData });
  }
  preview(month_year, CompanyBillingHours) {
    this.navCtrl.push(PreviewtimesheetPage, { sendMonth: month_year, sendHours: CompanyBillingHours, sending: this.localStorageData });
  }
  edit(month_year, CompanyBillingHours, TimesheetID) {
    this.navCtrl.push(EdittimesheetPage, { sendMonth: month_year, sendHours: CompanyBillingHours, sendTimesheetID: TimesheetID, sending: this.localStorageData });
  }
  viewTimesheet() {
    this.navCtrl.push(ViewtimesheetPage);
  }

  doRefresh(e) {
    //console.log('Begin async operation', e);

    setTimeout(() => {
      //console.log('calling the refresher');
      this.personalItems = [];
      //console.log(this.personalItems);
      this.approvalItems = [];
      //console.log(this.approvalItems);

      var managerApproveSheets = {
        userid: this.userID,
        startposition: +this.startingPostition + 1,
        endPosition: +this.endingPosition + 1
      }
      //console.log(managerApproveSheets);

      this.http.post(this.actionURL + 'GetUserTimeSheetforApproval/', managerApproveSheets)
        .subscribe(res => {
          this.array_items = res;
          //console.log(this.array_items);
          this.myPersonalTimesheet = this.array_items.mytimesheets;
          //console.log(this.myPersonalTimesheet);      
          this.approvalsheets = this.array_items.timesheetsforapproval;
          //console.log(this.approvalsheets);
          this.printApprovalsArray();
          this.printPersonalArray();
        })
      e.complete();
    }, 1000);
  }
}
