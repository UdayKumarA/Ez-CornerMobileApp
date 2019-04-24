import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LeaveformPage } from '../leaveform/leaveform';

@IonicPage()
@Component({
  selector: 'page-addevent',
  templateUrl: 'addevent.html',
})
export class AddeventPage {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  actionURI: any; userID: any; myLeaves:any; personalLeaves:any[] = []; teamls:any[]=[];
  public addEventPage: string = 'applyleave';
  public eventCreationForm: FormGroup;
  appLocalStorage: any; pushData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public modalCtrl: ModalController,
    public formBuilder: FormBuilder, public storage: Storage, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    
    this.actionURI = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURI = 'http://192.168.75.12:6022/api/ECorner/';

    this.storage.get('globalData').then((globalData) => {
      this.appLocalStorage = globalData;
      this.userID = this.appLocalStorage.EmpInfobyLogin.userid;
      console.log(this.userID);
      this.pushData = this.navParams.get('pushData');
      this.leaveFunctionAPI();
    });
    this.eventCreationForm = formBuilder.group({
      EmpID: [],
      EmpName: [],
      fromDate: [],
      toDate: [],
      balanceLeaves: []
    })
  }
  addNewLeave() {
    if (new Date(this.pushData).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) {
      var leaveFormModalPage = this.modalCtrl.create(LeaveformPage, { pushData: this.pushData });
      leaveFormModalPage.present();
    } else if (new Date(this.pushData).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) {
      let toast=this.toastCtrl.create({
        message:'Cannot Apply leave for this Date',
        duration:2000
      });
      toast.present();
    }
  }
  leaveFunctionAPI(){
    this.http.post(this.actionURI + 'UserLeavesInfo/' + this.userID + '/' + new Date(this.pushData).getFullYear() + '-' + (new Date(this.pushData).getMonth() + 1), { headers: this.headers })
    .subscribe(res => {
      this.myLeaves = res;
      if(this.myLeaves.StatusCode == 200){
        for(var i =0; i < this.myLeaves.myLeaveDetails.length; i++){
          var personalCount = ((new Date(this.myLeaves.myLeaveDetails[i].EndDate).getTime() - new Date(this.myLeaves.myLeaveDetails[i].LeaveDate).getTime())/(1000 * 3600 * 24) + 1);
          var personalObj = {
            "EmployeeID":this.myLeaves.myLeaveDetails[i].EmployeeID,
            "EmployeeName":this.myLeaves.myLeaveDetails[i].EmployeeName,
            "LeaveDate":this.myLeaves.myLeaveDetails[i].LeaveDate,
            "EndDate":this.myLeaves.myLeaveDetails[i].EndDate,
            "personalLeavesCount":personalCount
          }
          this.personalLeaves.push(personalObj);
          //console.log(this.personalLeaves);
        }
        for(var j = 0;j<this.myLeaves.TeamLeaveDetails.length;j++){              
          for(var k=0;k<this.myLeaves.TeamLeaveDetails[j].Empdetails.length;k++){
            var teamcount = ((new Date(this.myLeaves.TeamLeaveDetails[j].Empdetails[k].EndDate).getTime() - new Date(this.myLeaves.TeamLeaveDetails[j].Empdetails[k].StartDate).getTime())/(1000 * 3600 * 24) + 1);
            var teamsObj = {
              "EmployeeID":this.myLeaves.TeamLeaveDetails[j].Empdetails[k].EmployeeID,
              "EmployeeName":this.myLeaves.TeamLeaveDetails[j].Empdetails[k].EmployeeName,
              "StartDate":this.myLeaves.TeamLeaveDetails[j].Empdetails[k].StartDate,
              "EndDate":this.myLeaves.TeamLeaveDetails[j].Empdetails[k].EndDate,
              "teamLeavesCount" : teamcount
            }
            this.teamls.push(teamsObj);
            //console.log(this.teamls);
          }
        }
        console.log(this.teamls);
      }
    },
    (err: any) => 
    {
      if(err.error.StatusCode != 200){ 
        console.log(err.error);
        let toast = this.toastCtrl.create({
          message:'Error in retrieval',
          duration:3000
        })
        toast.present();
      }
    })
  }
}
