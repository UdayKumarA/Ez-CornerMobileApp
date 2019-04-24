import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController, PopoverController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmittimesheetPage } from '../../pages/submittimesheet/submittimesheet';
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
  selector: 'page-viewtimesheet',
  templateUrl: 'viewtimesheet.html',
})
export class ViewtimesheetPage {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  
  localStorageData:any;
  empinfoafterlogin: any; message: any; viewSheet: any; mytimesheet: any[]; approvalsheets: any[]; printPersonalMonthData: any;
  shortNamesofMonth: { shortMonthName: any[] }; userID: any; empName: any; AccID:any;
  projectID: any; projectName: any; accountType: any; companyLogo: any;holidayCalendar:any;
  monthtlyHoliday:any[] = [];curMonthNumber:any;
  startingPostition = '1';
  endingPosition = '100';
  actionURL:any;
  isEditValid: any;
  personalItems = [];
  show: boolean = false; buttonName: any = '+';

  constructor(public navCtrl: NavController, public navParams: NavParams, public _http: HttpClient, public popCtrl:PopoverController,
    private menuCtrl: MenuController, public storage: Storage, public alertCtrl: AlertController, public toastCtrl:ToastController) {
    this.menuCtrl.enable(true);
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';    
    
    this.isEditValid = false;
    this.storage.get('globalData').then((globalData) => {
      this.localStorageData = globalData;
      console.log('Local ViewTS Storage - ', this.localStorageData);
      this.empinfoafterlogin = this.localStorageData.EmpInfobyLogin;
      this.userID = this.empinfoafterlogin.userid;
      this.empName = this.empinfoafterlogin.userName;
      console.log(this.empName);
      this.projectID = this.empinfoafterlogin.projectID;
      this.projectName = this.empinfoafterlogin.projectName;
      this.accountType = this.empinfoafterlogin.AccountType;
      this.AccID = this.empinfoafterlogin.AccountID;
      console.log(this.userID + ' ' + this.empName + ' ' + this.accountType + ' ' + this.projectID);
      this.holiday();
      this.reloadPage();
    });
  }
  toggleStatus(){
    this.show = !this.show;
    if (this.show)
      this.buttonName = "-";
    else
      this.buttonName = "+";
  }

  ionViewWillEnter() { }

  doViewSheetRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.personalItems = [];
      this.reloadPage();
      refresher.complete();
    }, 3500);
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
  reloadPage() {
    var EmpSheetsDisplayonLoad = {
      userid: this.userID,
      startposition: this.startingPostition,
      endPosition: this.endingPosition
    }
    this._http.post(this.actionURL+'GetUserTimeSheetforApproval/', EmpSheetsDisplayonLoad)
      .subscribe(res => {
        this.viewSheet = res;
        this.mytimesheet = this.viewSheet.mytimesheets;
        for(var i = 0; i < this.mytimesheet.length; i++) {
          var statusInfo = this.mytimesheet[i].TimesheetStatus;
          if(statusInfo == "yel"){
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
            "Month_Year": this.mytimesheet[i].Month_Year,
            "CompanyBillingHours": this.mytimesheet[i].CompanyBillingHours,
            "ResourceWorkingHours": this.mytimesheet[i].ResourceWorkingHours,
            "TimesheetID": this.mytimesheet[i].TimesheetID,
            "TimesheetStatus": statusInfo,
            "isEditValid": this.isEditValid
          };
          this.personalItems.push(resultObj);
        }
        console.log(this.personalItems);
        //this.printMonth_year();
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          let toast = this.toastCtrl.create({
            message:'No Timesheets Found',
            duration:3000
          })
          toast.present();
        }
      });
  }
  holiday() {
    this.curMonthNumber = new Date().getMonth() + 1;
    this._http.post(this.actionURL+'HolidayCalenderList/'+ this.userID+'/'+this.AccID+'/'+ new Date().getFullYear()+'-'+this.curMonthNumber ,{headers: this.headers})
      .subscribe(res => {
        this.holidayCalendar = res;
        console.log(this.holidayCalendar);
        if(this.holidayCalendar.status.StatusCode == 200){
          for(var i=0; i < this.holidayCalendar.holidayDetails.length; i++){
            //console.log(this.holidayCalendar.holidayDetails[i].HolidayDate);
            this.monthtlyHoliday.push(this.holidayCalendar.holidayDetails[i].HolidayDate);
          }
        }
        console.log(this.monthtlyHoliday);
      });
  }

  preview(month_year, CompanyBillingHours) {
    this.navCtrl.push(PreviewtimesheetPage, { sendMonth: month_year, sendHours: CompanyBillingHours, sending: this.localStorageData });
  }
  addTimesheet() {
    this.navCtrl.push(SubmittimesheetPage, {sendData: this.localStorageData, sendMonthHolidays: this.monthtlyHoliday} );
  }
  edit(month_year, CompanyBillingHours, TimesheetID) {
    this.navCtrl.push(EdittimesheetPage, { sendMonth: month_year, sendHours: CompanyBillingHours, sendTimesheetID: TimesheetID });
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
}
