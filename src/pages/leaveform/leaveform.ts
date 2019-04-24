import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-leaveform',
  templateUrl: 'leaveform.html',
})
export class LeaveformPage {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  actionURI: any;
  public eventCreationForm: FormGroup;
  appLocalStorage: any; EmpID: any; EmpName: any; fromDate: any; toDate: any; datefromCalender: any;
  leavesType: any; leaveCategoryGrid: any[] = []; buildingLeavesArray: any[] = []; applyLeaveSuccessObj: any;
  leavesConsumedObj:any[] = [];

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: HttpClient,
    public viewCtrl: ViewController, public storage: Storage, public toastCtrl: ToastController) {
    this.actionURI = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURI = 'http://192.168.75.12:6022/api/ECorner/';

    this.storage.get('globalData').then((globalData) => {
      this.appLocalStorage = globalData;
      this.EmpID = this.appLocalStorage.EmpInfobyLogin.userid;
      this.EmpName = this.appLocalStorage.EmpInfobyLogin.userName;
      this.http.post(this.actionURI + 'GetEmpLeaveCategories/' + this.EmpID + '/' + new Date().getFullYear(), { headers: this.headers })
        .subscribe(res => {
          this.leavesType = res;
          //console.log(this.leavesType);
          if (this.leavesType.StatusCode == 200) {
            this.leaveCategoryGrid = this.leavesType.EmpLeaveCategory;
            console.log(this.leaveCategoryGrid);
          } else if (this.leavesType.StatusCode == 404) {
            console.log('No leaves data');
          }
        })
    });
    this.datefromCalender = this.navParams.get('pushData');
    console.log(this.datefromCalender);
    this.fromDate = this.datefromCalender;
    this.toDate = this.datefromCalender;
    this.eventCreationForm = formBuilder.group({
      EmpID: [],
      EmpName: [],
      fromDate: [],
      toDate: [],
      No_Of_Days: []
    })
  }
  leaveNumber(ev, i) {
    if (ev._value <= (this.leaveCategoryGrid[i].totLeavesCount - this.leaveCategoryGrid[i].totHolidaysUsed)) {
      if (this.buildingLeavesArray.length > 0) {
        var selectedLeaveType = this.buildingLeavesArray.find(item => item.LeaveTypeId == this.leaveCategoryGrid[i].leaveTypeID);
        //console.log(selectedLeaveType);
        if (selectedLeaveType != null) {
          selectedLeaveType.No_Of_Days = ev._value;
        }
        else {
          const leaveObject = {
            LeaveTypeId: this.leaveCategoryGrid[i].leaveTypeID,
            No_Of_Days: ev._value
          }
          this.buildingLeavesArray.push(leaveObject);
        }
        //console.log(this.buildingLeavesArray);
      }
      else {
        const leaveObject = {
          LeaveTypeId: this.leaveCategoryGrid[i].leaveTypeID,
          No_Of_Days: ev._value
        }
        this.buildingLeavesArray.push(leaveObject);
        //console.log(this.buildingLeavesArray);
      }
    } else {
      let toast = this.toastCtrl.create({
        message: 'Type Number equal to or below balance holidays',
        duration: 2500,
      })
      toast.present();
    }
  }
  applyLeave() {
    //console.log(this.buildingLeavesArray);
    for(var p=0;p<this.buildingLeavesArray.length;p++){
      if(this.buildingLeavesArray[p].No_Of_Days != null && this.buildingLeavesArray[p].No_Of_Days != ""){
        this.leavesConsumedObj.push(this.buildingLeavesArray[p]);
      }
    }
    console.log(this.leavesConsumedObj);
    const leavesApplyingObject = {
      ApplyLeave: {
        Usrl_UserId: this.EmpID,
        LeaveStartDate: this.fromDate,
        LeaveEndDate: this.toDate,
        Comments: 'Leave Applied on ' + new Date().toDateString(),
      },
      LeavesConsumed: []
    }
    leavesApplyingObject.LeavesConsumed = this.leavesConsumedObj;
    console.log(leavesApplyingObject);
    if (new Date(leavesApplyingObject.ApplyLeave.LeaveStartDate) <= new Date(leavesApplyingObject.ApplyLeave.LeaveEndDate)) {
      //console.log('can apply');
      var total = 0;
      for (var f = 0; f < this.leavesConsumedObj.length; f++) {
        total += Number(this.leavesConsumedObj[f].No_Of_Days);
      }
      console.log(total);
      console.log(Math.ceil(((new Date(leavesApplyingObject.ApplyLeave.LeaveEndDate).getTime() - new Date(leavesApplyingObject.ApplyLeave.LeaveStartDate).getTime()))/(1000*3600*24) + 1));
      if ((Math.ceil(((new Date(leavesApplyingObject.ApplyLeave.LeaveEndDate).getTime() - new Date(leavesApplyingObject.ApplyLeave.LeaveStartDate).getTime()))/(1000*3600*24) + 1)) == total) {
        console.log('days count matached');
        this.http.post(this.actionURI + 'AddUserLeaves', leavesApplyingObject)
          .subscribe(res => {
            this.applyLeaveSuccessObj = res;
            console.log(this.applyLeaveSuccessObj);
            if (this.applyLeaveSuccessObj.StatusCode == 200) {
              let toast = this.toastCtrl.create({
                message: this.applyLeaveSuccessObj.appliedStatus.Message,
                duration: 3000
              });
              toast.present();
              this.navCtrl.pop();
            }
          },
            (err: any) => {
              if (err.error.StatusCode != 200) {
                console.log(err.error);
                alert('Error in retrieving');
              }
            })
      } else {
        let toast = this.toastCtrl.create({
          message: 'Check the No of days cound with the difference of Start & End Dates',
          duration: 3000
        });
        toast.present();
      }
    } else if (new Date(leavesApplyingObject.ApplyLeave.LeaveStartDate) > new Date(leavesApplyingObject.ApplyLeave.LeaveEndDate)) {
      let toast = this.toastCtrl.create({
        message: 'Please Check the Dates Correctly',
        duration: 3000
      });
      toast.present();
    }
  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }
}

