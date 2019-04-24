import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { ManageremptsPage } from '../../pages/managerempts/managerempts';

@IonicPage()
@Component({
  selector: 'page-managerempscrollsheet',
  templateUrl: 'managerempscrollsheet.html',
})
export class ManagerempscrollsheetPage {
  actionURL:any;
  items: any[] = []; data: any;
  userID: any;
  empName: any;
  array_items: any;
  approvalsheets: any[] = [];
  fullEmpData: any;
  empinfoafterlogin: any;
  afterScrollingMgrID: any;
  startingPostition = 1;
  endingPosition = 20;

  scrollPageAcceptRes: any; scrollPageRejectRes: any; totalApprovalCountfromDB: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private menuCtrl: MenuController,
    private toastCtrl: ToastController, public alertCtrl: AlertController, private sp: SubmittimesheetProvider) {
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';
    
    this.menuCtrl.enable(false);
    this.data = this.navParams.get('sendUserFullData');
    console.log(this.data);
    this.empinfoafterlogin = this.data.EmpInfobyLogin;
    this.userID = this.data.EmpInfobyLogin.userid;
    this.empName = this.data.EmpInfobyLogin.userName;
    //console.log(this.userID);
    //console.log(this.empName);

    var managerApproveSheets = {
      userid: this.userID,
      startposition: this.startingPostition,
      endPosition: this.endingPosition
    }
  console.log(managerApproveSheets);

    this.http.post(this.actionURL+'GetUserTimeSheetforApproval/', managerApproveSheets)
      .subscribe(res => {
        this.array_items = res;
        console.log(this.array_items);
        console.log(this.array_items);
        if (this.array_items.StatusCode == 200) {
          this.approvalsheets = this.array_items.timesheetsforapproval;
          this.printArray();
        } else if(this.array_items.StatusCode == 404) {
          console.log('entered');
          let toast = this.toastCtrl.create({
            message: this.array_items.StatusMessage,
            duration: 3000
          });
          toast.present();
        }
      },
      (err: any) => 
      {
        if(err.error.StatusCode == 500){ 
          console.log(err.error);
          alert('Error in retrieving');
        }
      });
  }

  printArray() {
    for (let i = 0; i < this.approvalsheets.length; i++) {
      this.items.push(this.approvalsheets[i]);
      //console.log(this.items);
    }
    console.log(this.items);
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
    this.fullEmpData = this.items.find(ts => ts.TimesheetID == timesheetID);
    console.log(this.fullEmpData);

    const approveObject = {
      timeSheetActions: {
        EmpUsrID: this.fullEmpData.Userid,
        timeSheetID: this.fullEmpData.TimesheetID,
        comments: 'TimeSheet approved by ' + this.empName,
        SubmittedType: "1",
        ManagerId: this.userID
      }
    }
    console.log(approveObject);
    this.sp.approvets(approveObject)
      .subscribe(res => {
        console.log(res);
        this.scrollPageAcceptRes = res;
        if (this.scrollPageAcceptRes.status.StatusCode == 200) {
          if (this.scrollPageAcceptRes.timeSheetActions.Position == 'L1') {
            let toast = this.toastCtrl.create({
              message: this.scrollPageAcceptRes.timeSheetActions.Message,
              duration: 1000
            });
            toast.present();
          }
          else if (this.scrollPageAcceptRes.timeSheetActions.Position == 'L2') {
            let toast = this.toastCtrl.create({
              message: this.scrollPageAcceptRes.timeSheetActions.Message,
              duration: 1000
            });
            toast.present();
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

  rejectedTimesheet(timesheetID) {
    this.fullEmpData = this.items.find(ts => ts.TimesheetID == timesheetID);
    console.log(this.fullEmpData);
    const rejectObject = {
      timeSheetActions: {
        EmpUsrID: this.fullEmpData.Userid,
        timeSheetID: this.fullEmpData.TimesheetID,
        comments: 'Timesheet Rejected by ' + this.empName,
        SubmittedType: "0",
        ManagerId: this.userID
      }
    }
    console.log(rejectObject);

    this.sp.rejectts(rejectObject)
      .subscribe(res => {
        this.scrollPageRejectRes = res;
        console.log(this.scrollPageRejectRes);
        if (this.scrollPageRejectRes.status.StatusCode == 200) {
          if (this.scrollPageRejectRes.timeSheetActions.Position == 'L1') {
            let toast = this.toastCtrl.create({
              message: this.scrollPageRejectRes.timeSheetActions.Message,
              duration: 1000
            });
            toast.present();
          }
          else if (this.scrollPageRejectRes.timeSheetActions.Position == 'L2') {
            let toast = this.toastCtrl.create({
              message: this.scrollPageRejectRes.timeSheetActions.Message,
              duration: 1000
            });
            toast.present();
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

  previewforEmp(timesheetID, i) {
    console.log(timesheetID + ' ' + i);
    this.fullEmpData = this.items.find(ts => ts.TimesheetID == timesheetID);
    console.log(this.fullEmpData);
    this.navCtrl.push(ManageremptsPage, { sendFullData: this.fullEmpData, sendManagerData: this.data });
  }

  //scrolling
  doInfinite(infiniteScroll) {
    this.startingPostition = +this.endingPosition + 1;
    this.endingPosition = +this.endingPosition + 20;
    console.log('starting position: ' + this.startingPostition);
    console.log('ending position: ' + this.endingPosition);
    this.afterScrollingMgrID = this.userID;
    console.log(this.afterScrollingMgrID);

    var managerApproveSheets = {
      userid: this.afterScrollingMgrID,
      startposition: this.startingPostition,
      endPosition: this.endingPosition
    }
    console.log(managerApproveSheets);

    this.http.post(this.actionURL+'GetUserTimeSheetforApproval/', managerApproveSheets)
      .subscribe(res => {
        this.array_items = res;
        this.totalApprovalCountfromDB = this.array_items.totalRow.TotalCountforApproval;
        if (this.array_items.StatusCode == 200) {
          this.approvalsheets = this.array_items.timesheetsforapproval;
        }
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          alert('Error in Retrieving');
        }
      });
    console.log(this.approvalsheets);

    console.log('Begin async operation');
    let i = 0;
    setTimeout(() => {
      for (; i < this.approvalsheets.length; i++) {
        this.items.push(this.approvalsheets[i]);
        //console.log(this.items);
      }
      console.log(this.items);
      console.log('length is: ' + this.items.length + ' ' + 'indexed value: ' + i);
      console.log('Async operation has ended');
      console.log('Total Records in DB ' + this.totalApprovalCountfromDB);
      infiniteScroll.complete();

      if (this.items.length === this.totalApprovalCountfromDB) {
        infiniteScroll.enable(false);
        let toast = this.toastCtrl.create({
          message: 'No More Timesheets to load...!!!',
          duration: 3000
        });
        toast.present();
        
        console.log('Ended...!');
      } else {
        console.log('Continue...!');
      }
    }, 1000);
  }

}
