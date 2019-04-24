import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edittimesheet',
  templateUrl: 'edittimesheet.html',
})
export class EdittimesheetPage {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  editTSLocalData: any; actionURL:any;
  _month: any; _year: any; totalDaysinMonth: any;
  monthData: any; monthHours: any;
  data: any; userID: any; empName: any; projectName: any;
  previewData: any; tasksRetrievalInfo: any; editingTimeSheetID: any;
  capturedTaskID: any; capturedProjectID: any; editedInternalObject: any[] = [];
  empinfoafterlogin: any; previewDataIndividualMonthDetails: any; retrievedTasksList: any;
  editedResponseSheetObject: any;
  capturedUserID: any;
  isSaveDisabled:boolean = false;
  isSubmitDisabled:boolean = false;
  
  namesofallDays: { dayOfWeek: any[], buildingJsonData: any[] };

  public edittimesheetForm: FormGroup;
  hoursValidationControl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public _http: HttpClient, private toastCtrl: ToastController, 
    public storage: Storage, private menuCtrl: MenuController, public formBuilder: FormBuilder) {
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';

    this.edittimesheetForm = formBuilder.group({
      hoursValidationControl:['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1),Validators.maxLength(2), Validators.min(0),Validators.max(24)])]
    })

    this.menuCtrl.enable(true);
    this._month = (new Date().getMonth() + 1);
    console.log(this._month);
    this._year = new Date().getFullYear();
    //console.log(this._year);
    this.totalDaysinMonth = new Date(this._year, this._month, 0).getDate();
    //console.log(this.totalDaysinMonth);
    this.localStorage();
  }

  localStorage() {
    this.storage.get('globalData').then((globalData) => {
      this.editTSLocalData = globalData;
      console.log('Edit TS - ', this.editTSLocalData);
      this.monthData = this.navParams.get('sendMonth');
      console.log(this.monthData);
      this.monthHours = this.navParams.get('sendHours');
      this.editingTimeSheetID = this.navParams.get('sendTimesheetID');
      console.log(this.editingTimeSheetID);
      this.empinfoafterlogin = this.editTSLocalData.EmpInfobyLogin;
      this.userID = this.empinfoafterlogin.userid;
      this.capturedUserID = this.empinfoafterlogin.userid;
      this.empName = this.empinfoafterlogin.userName;
      this.projectName = this.empinfoafterlogin.projectName;
      this.capturedProjectID = this.empinfoafterlogin.projectID;
      this.capturedTaskID = this.empinfoafterlogin.TaskTypeID;
      console.log(this.userID + ' ' + this.empName + ' ' + this.projectName + ' ' + this.capturedProjectID + ' ' + this.capturedTaskID);
      const [monthName, yearName] = this.monthData.split(" ");
      this._http.post(this.actionURL+'GetUserTimesheet/' + this.userID + '/' + yearName + '-' + monthName + '-' + "1", { headers: this.headers })
        .subscribe(res => {
          this.previewData = res;
          if (this.previewData.StatusCode == 200) {
            //console.log(this.previewData);
            this.previewDataIndividualMonthDetails = this.previewData.timeSheetDetails;
            console.log(this.previewDataIndividualMonthDetails);
          }
          this.printModifiedDates();
        },
        (err: any) => 
        {
          if(err.error.StatusCode != 200){ 
            console.log(err.error);
            alert('Error in Retrieving Timesheet');
          }
        });
      this._http.post(this.actionURL+'GetTaskList/'+ this.capturedUserID, { headers: this.headers })
        .subscribe(res => {
          this.tasksRetrievalInfo = res;
          if (this.tasksRetrievalInfo.StatusCode == 200) {
            //console.log(this.tasksRetrievalInfo);
            this.retrievedTasksList = this.tasksRetrievalInfo.taskNames;
            //console.log(this.retrievedTasksList);
          }
        },
        (err: any) => 
        {
          if(err.error.StatusCode != 200){ 
            console.log(err.error);
            alert('Error in Retrieving');
          }
        });
      //console.log('ionViewDidLoad EdittimesheetPage');
    })
  }

  printModifiedDates() {
    var printeditMonthDetailsLength = this.previewDataIndividualMonthDetails.length;
    var namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    //console.log(printeditMonthDetailsLength);
    for (var i = 0; i < printeditMonthDetailsLength; i++) {
      var printActualDate = this.previewDataIndividualMonthDetails[i].TaskDate;
      //console.log(printActualDate);
      var printDate = namesOfDays[new Date(new Date(printActualDate).getFullYear(), new Date(printActualDate).getMonth(), i + 1).getDay()] + ', ' + new Date(printActualDate).getDate();
      //console.log(printDate);
      this.previewDataIndividualMonthDetails[i].TaskDate = printDate;
      //this.modifiedDatesforPrinting.push(printDate);
    }
    //console.log(this.previewDataIndividualMonthDetails);
  }

  hoursSelected($event, rowIndex) {
    var hoursValue = $event._value;
    if(hoursValue < 0 || hoursValue > 24) {
      this.previewDataIndividualMonthDetails[rowIndex].NoofHoursWorked = hoursValue;
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
    } else if (hoursValue >= 0 && hoursValue <= 24) {
      this.previewDataIndividualMonthDetails[rowIndex].NoofHoursWorked = hoursValue;
      this.isSaveDisabled = false;
      this.isSubmitDisabled = false;
    }
      for(var i=0;i<this.previewDataIndividualMonthDetails.length;i++) {
        if(this.previewDataIndividualMonthDetails[i].NoofHoursWorked > 24) {
          this.isSaveDisabled = true;
          this.isSubmitDisabled = true;
          break;
        } else {
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        }
      }
      console.log(this.previewDataIndividualMonthDetails);
  }

  taskSelected($event, rowIndex) {
    var selectedValue = this.retrievedTasksList.find(item => item.TaskId == $event);
    //console.log(selectedValue);
    if (selectedValue != null) {
      this.previewDataIndividualMonthDetails[rowIndex].Taskname = selectedValue.TaskName;
      this.previewDataIndividualMonthDetails[rowIndex].Taskid = selectedValue.TaskId;
      //this.namesofallDays.buildingJsonData[rowIndex].taskid = selectedValue.TaskId;
    }
    //console.log(this.previewDataIndividualMonthDetails);
    //console.log(this.previewData);
    //console.log(this.namesofallDays);
  }

  update() {
    var [monthName, yearName] = this.monthData.split(" ");
    console.log(monthName + ' ' + yearName);
    for (var i = 0; i < this.previewDataIndividualMonthDetails.length; i++) {
      var entireObject = {
        taskDay: (i + 1),
        taskDate: yearName+'/'+monthName+'/'+ (i+1),
        projectid: this.previewDataIndividualMonthDetails[i].ProjectId,
        taskid: this.previewDataIndividualMonthDetails[i].Taskid,
        hoursWorked: this.previewDataIndividualMonthDetails[i].NoofHoursWorked,
      }
      //console.log(entireObject.taskDate + ' ' + entireObject.taskid + ' '+ entireObject.hoursWorked + ' '+ entireObject.projectid);
      this.editedInternalObject.push(entireObject);
    }
    //console.log(this.editedInternalObject);
    //modified json object
    const editedObject = {
      timesheets: {
        UserID: this.userID,
        TaskDate: yearName + '/' + monthName + '/' + "1",
        comments: "Modified for month " + monthName + ' ' + yearName,
        projectID: this.capturedProjectID,
        SubmittedType: "Save",
      },
      listtimesheetdetails: []
    }
    editedObject.listtimesheetdetails = this.editedInternalObject;
    console.log(editedObject);
    this._http.post(this.actionURL+'EditTimeSheetDetails/' + this.editingTimeSheetID, editedObject, { headers: this.headers })
      .subscribe(res => {
        console.log(res);
        this.editedResponseSheetObject = res;
        if(this.editedResponseSheetObject.status.StatusCode == 200) {
          if(this.editedResponseSheetObject.SubmittedState == "Once"){
            let toast = this.toastCtrl.create({
              message: this.editedResponseSheetObject.Message,
              duration: 1000
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
          alert('Error in Editing');
        }
      });
  }
  submit() {
    console.log('Submit');
    var [monthName, yearName] = this.monthData.split(" ");
    console.log(monthName + ' ' + yearName);
    for (var i = 0; i < this.previewDataIndividualMonthDetails.length; i++) {
      var entireObject = {
        taskDay: (i + 1),
        taskDate: yearName+'/'+monthName+'/'+ (i+1),
        projectid: this.previewDataIndividualMonthDetails[i].ProjectId,
        taskid: this.previewDataIndividualMonthDetails[i].Taskid,
        hoursWorked: this.previewDataIndividualMonthDetails[i].NoofHoursWorked,
      }
      //console.log(entireObject.taskDate + ' ' + entireObject.taskid + ' '+ entireObject.hoursWorked + ' '+ entireObject.projectid);
      this.editedInternalObject.push(entireObject);
    }
    //console.log(this.editedInternalObject);
    //modified json object
    const editedSubmitObject = {
      timesheets: {
        UserID: this.userID,
        TaskDate: yearName + '/' + monthName + '/' + "1",
        comments: "Modified for month " + monthName + ' ' + yearName,
        projectID: this.capturedProjectID,
        SubmittedType: "Submit",
      },
      listtimesheetdetails: []
    }
    editedSubmitObject.listtimesheetdetails = this.editedInternalObject;
    console.log(editedSubmitObject);
    this._http.post(this.actionURL+'EditTimeSheetDetails/' + this.editingTimeSheetID, editedSubmitObject, { headers: this.headers })
      .subscribe(res => {
        console.log(res);
        this.editedResponseSheetObject = res;
        if(this.editedResponseSheetObject.status.StatusCode == 200) {
            let toast = this.toastCtrl.create({
              message: this.editedResponseSheetObject.Message,
              duration: 1000
            });
            toast.present();
            this.navCtrl.pop();          
        }
      },
      (err: any) => 
      {
        if(err.error.StatusCode != 200){ 
          console.log(err.error);
          alert('Error in Editing');
        }
      });
  }
}
