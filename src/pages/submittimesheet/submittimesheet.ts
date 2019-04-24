import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-submittimesheet',
  templateUrl: 'submittimesheet.html',
})
export class SubmittimesheetPage {
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  public selectedYear: any = new Date().getFullYear().toString();
  minMonth:any;
  actionURL:any;
  isSaveDisabled:boolean = false;
  isSubmitDisabled:boolean = false;
  disabled: any; localStorageData: any; holidaysofCurrentMonth: any;
  empinfoafterlogin: any; _date: any; _year: any; _Month: any; _month: any; start: any; end: any; daysDiff: any; diffDays: any; namesofMonth: any;
  displayStart: any; displayEnd: any; totalMonthHours: any; namesofallDays: { dayOfWeek: any[], buildingJsonData: any[] };
  entireObject: any[]; difference: any; objDate: any; obj1: any;
  data: any; message: any; capturedUserID: any; capturedUserName: any; capturedProjectID: any; capturedProjectName: any; capturedTaskID: any;
  capturedTaskName: any; capturedAccID; any; retrievalInfo: any; retrievedTasksList: any;
  nowMonth: any; printDropdownMonthArray: any[] = []; currentMonth: any; monthNumber: any; retVal: any; selectedTask: any; finalRequest = {}; inputDisabled: boolean;
  responseAfterSubmit: any; holidayCalendar: any; tempObj: any; monthtlyHoliday: any[] = [];
  holidayCalendarInselecteMonth: any; monthtlyHolidaysInSelectedMonth: any[] = [];

  public submitSheet:FormGroup;
  hoursValidationControl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private menuCtrl: MenuController,
    private sp: SubmittimesheetProvider, private toastCtrl: ToastController, public storage: Storage,
    public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    //this.actionURI = 'http://192.168.75.19:5010/api/ECorner/';
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';

    this.submitSheet = formBuilder.group({
      hoursValidationControl:['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(1),Validators.maxLength(2), Validators.min(0),Validators.max(24)])]
    })

    this.menuCtrl.enable(true);
    this.disabled = false;
    console.log('selected year ' + this.selectedYear);

    this.data = this.navParams.get('sendData');
    console.log(this.data);
    this.empinfoafterlogin = this.data.EmpInfobyLogin;
    this.capturedUserID = this.empinfoafterlogin.userid;
    this.capturedUserName = this.empinfoafterlogin.userName;
    this.capturedProjectID = this.empinfoafterlogin.projectID;
    this.capturedProjectName = this.empinfoafterlogin.projectName;
    this.capturedTaskID = this.empinfoafterlogin.TaskTypeID;
    this.capturedTaskName = this.empinfoafterlogin.TaskName;
    this.capturedAccID = this.empinfoafterlogin.AccountID;
    console.log(this.capturedUserID + ' ' + this.capturedUserName + ' ' + this.capturedProjectID + ' ' + this.capturedTaskID + ' ' + this.capturedAccID);

    this.holidaysofCurrentMonth = this.navParams.get('sendMonthHolidays');
    //console.log(this.holidaysofCurrentMonth);
    console.log(this.holidaysofCurrentMonth.length);

    this._year = new Date().getFullYear();
    //console.log(this._year);
    this._Month = new Date().getMonth();
    //console.log(this._Month);
    this._month = new Date().getMonth() + 1;
    //console.log(this._month);
    
    var getDaysInMonth = function (month, year, _day) {
      return new Date(year, month, 1);
    };
    this.start = getDaysInMonth(new Date().getMonth(), new Date().getFullYear(), 1);
    this.end = getDaysInMonth(new Date().getMonth() + 1, new Date().getFullYear(), 1);
    //console.log(this.start);
    //console.log(this.end);
    var daysDiff = Math.abs(this.start.getTime() - this.end.getTime());
    //console.log(daysDiff);
    this.difference = Math.ceil(daysDiff / (1000 * 3600 * 24));
    //console.log(this.difference);

    var namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var name = getDaysInMonth(new Date().getMonth(), new Date().getFullYear(), 1);
    //console.log(name);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.monthNumber = new Date().getMonth() + 1;
    //console.log(this.monthNumber);
    this.displayStart = monthNames[new Date().getMonth()].toString().substring(0, 3) + ' ' + name.getDate() + ', ' + ' ' + new Date().getFullYear();
    //console.log(this.displayStart);
    this.displayEnd = monthNames[new Date().getMonth()].toString().substring(0, 3) + ' ' + Math.ceil(daysDiff / (1000 * 3600 * 24)) + ', ' + ' ' + new Date().getFullYear();
    //console.log(this.displayEnd);

    this.namesofallDays = { dayOfWeek: [], buildingJsonData: [] };
    this.namesofMonth = monthNames[new Date().getMonth()].toString();
    //console.log(this.namesofMonth);
    for (let i = 0; i < this.difference; i++) {
      var j = i + 1;
      var nd = new Date(new Date().getFullYear(), new Date().getMonth(), j);
      //console.log(nd);
      var dayName = namesOfDays[nd.getDay()] + ', ' + j;
      this.namesofallDays.dayOfWeek.push(dayName);
      //console.log(this.namesofallDays.dayOfWeek);
      if (nd.getDay() == 0 || nd.getDay() == 6) {
        var th = 0;
        //console.log(th);
      }
      else if (nd.getDay() == 1 || nd.getDay() == 2 || nd.getDay() == 3 || nd.getDay() == 4 || nd.getDay() == 5) {
        th = 8;
        //console.log(th);
      }
      var entireObject = {
        taskDay: j,
        taskDate: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + j,
        hoursWorked: th,
        projectid: this.capturedProjectID,
        taskid: this.capturedTaskID
      }
      this.namesofallDays.buildingJsonData.push(entireObject);
    }

    if (this.holidaysofCurrentMonth.length < 0) {
      //console.log(this.holidaysofCurrentMonth.length);
    } else {
      for (var k = 0; k < this.holidaysofCurrentMonth.length; k++) {
        console.log(this.holidaysofCurrentMonth.length);
        var hoildayDate = new Date(this.holidaysofCurrentMonth[k]).getDate();
        //console.log(hoildayDate);
        this.tempObj = this.namesofallDays.buildingJsonData.find(singleArray => singleArray.taskDay == hoildayDate);
        //console.log(this.tempObj);
        this.tempObj.hoursWorked = 0;
      }
    }
    //console.log(this.namesofallDays.buildingJsonData);

    //12 Months dropdown
    for (let twelveMonths = 0; twelveMonths < 12; twelveMonths++) {
      const monthNamesDropDown = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var monthsDropDown = monthNamesDropDown[new Date(new Date().getFullYear(), twelveMonths, 1).getMonth()];

      if (new Date().getMonth() == twelveMonths) {
        this.currentMonth = twelveMonths + 1;
        //console.log('Month number '+this.currentMonth);
      } else {
        this.currentMonth = null;
      }
      //console.log(month);
      var twelveMonthsJson = {
        monthNamesList: monthsDropDown,
        currentMonth: this.currentMonth
      }
      this.printDropdownMonthArray.push(twelveMonthsJson);
    }
    //console.log(this.printDropdownMonthArray);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SubmittimesheetPage');
    this.http.post(this.actionURL+'GetTaskList/'+ this.capturedUserID, { headers: this.headers })
      .subscribe(res => {
        this.retrievalInfo = res;
        if (this.retrievalInfo.StatusCode == 200) {
          this.retrievedTasksList = this.retrievalInfo.taskNames;
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            alert('Error in Retrieving');
          }
        });
  }

  ionViewWillEnter() {
    //console.log(this.retrievedTasksList);    
  }

  monthSelected(e) {
    var monthNamesSelected = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var namesOfDaysSelected = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    console.log('selected Month ' + e);
    this.namesofMonth = e;
    // console.log(this.namesofMonth);
    // console.log('javascript Index: '+monthNamesSelected.indexOf(e));
    this.monthNumber = (monthNamesSelected.indexOf(e)) + 1;
    console.log('selected Month Number: ' + this.monthNumber);
    var selectMonthDaysCount = new Date(this.selectedYear, this.monthNumber, 0).getDate();
    console.log('days in a month: ' + selectMonthDaysCount);
    this.namesofallDays.dayOfWeek = [];
    this.namesofallDays.buildingJsonData = [];
    this.monthtlyHolidaysInSelectedMonth = [];
    console.log(this.monthtlyHolidaysInSelectedMonth.length);
    //console.log('Empty Array: '+this.namesofallDays.buildingJsonData);
    this.http.post(this.actionURL+'HolidayCalenderList/' + this.capturedUserID + '/' + this.capturedAccID + '/' + this.selectedYear + '-' + this.monthNumber, { headers: this.headers })
      .subscribe(res => {
        this.holidayCalendarInselecteMonth = res;
        console.log(this.holidayCalendarInselecteMonth);
        if (this.holidayCalendarInselecteMonth.status.StatusCode == 200) {
          for (var i = 0; i < this.holidayCalendarInselecteMonth.holidayDetails.length; i++) {
            //console.log(this.holidayCalendar.holidayDetails[i].HolidayDate);
            this.monthtlyHolidaysInSelectedMonth.push(this.holidayCalendarInselecteMonth.holidayDetails[i].HolidayDate);
          }
        }
        console.log(this.monthtlyHolidaysInSelectedMonth);
        console.log(this.monthtlyHolidaysInSelectedMonth.length);
        if (this.monthtlyHolidaysInSelectedMonth.length < 0) {
          console.log(this.monthtlyHolidaysInSelectedMonth.length);
        } else {
          for (var k = 0; k < this.monthtlyHolidaysInSelectedMonth.length; k++) {
            //console.log(this.monthtlyHolidaysInSelectedMonth.length); 
            var hoildayDate = new Date(this.monthtlyHolidaysInSelectedMonth[k]).getDate();
            //console.log(hoildayDate);
            this.tempObj = this.namesofallDays.buildingJsonData.find(singleArray => singleArray.taskDay == hoildayDate);
            ///console.log(this.tempObj);
            this.tempObj.hoursWorked = 0;
          }
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            let alert = this.alertCtrl.create({
              title: 'Info...!!!',
              subTitle: 'No Public Holidays in this Month',
              buttons: ['OK']
            });
            alert.present();
          }
        });
    for (let i = 0; i < selectMonthDaysCount; i++) {
      var j = i + 1;
      var nd = new Date(this.selectedYear, monthNamesSelected.indexOf(e), j);
      //console.log(nd);
      var daysAfterSelected = namesOfDaysSelected[nd.getDay()] + ',' + j;
      this.namesofallDays.dayOfWeek.push(daysAfterSelected);// = namesOfDaysSelected[nd.getDay()].toString().substring(0,3)+ ','+ j;
      if (nd.getDay() == 0 || nd.getDay() == 6) {
        var th = 0;
        //console.log(th);
      }
      else if (nd.getDay() == 1 || nd.getDay() == 2 || nd.getDay() == 3 || nd.getDay() == 4 || nd.getDay() == 5) {
        th = 8;
        //console.log(th);
      }
      //console.log(dayNameAferChange);
      var entireObjectForSelectedMonth = {
        taskDay: j,
        taskDate: this.selectedYear + '/' + this.monthNumber + '/' + j,
        hoursWorked: th,
        projectid: this.capturedProjectID,
        taskid: this.capturedTaskID
      }
      this.namesofallDays.buildingJsonData.push(entireObjectForSelectedMonth);
    }
    console.log(this.namesofallDays.buildingJsonData);
  }

  yearSelected($event) {
    var namesOfDaysSelected = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    console.log('Year Selected ', $event);
    //this.selectedYear = $event;
    //console.log('selected year', this.selectedYear);
    if ($event > new Date().getFullYear().toString()) {
      console.log('Cannot Submit Even After selection');
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
    } else {
      //console.log('2nd Selected Year ', this.selectedYear);
      this.isSaveDisabled = false;
      this.isSubmitDisabled = false;
      console.log('Month Selected ', this.monthNumber);
      var selectMonthDaysCount = new Date(this.selectedYear, this.monthNumber, 0).getDate();
      console.log('days in a month: ' + selectMonthDaysCount);
      this.namesofallDays.dayOfWeek = [];
      this.namesofallDays.buildingJsonData = [];
      this.monthtlyHolidaysInSelectedMonth = [];
      console.log(this.monthtlyHolidaysInSelectedMonth.length);
      //console.log('Empty Array: '+this.namesofallDays.buildingJsonData);
      this.http.post(this.actionURL+'HolidayCalenderList/' + this.capturedUserID + '/' + this.capturedAccID + '/' + this.selectedYear + '-' + this.monthNumber, { headers: this.headers })
        .subscribe(res => {
          this.holidayCalendarInselecteMonth = res;
          console.log(this.holidayCalendarInselecteMonth);
          if (this.holidayCalendarInselecteMonth.status.StatusCode == 200) {
            for (var i = 0; i < this.holidayCalendarInselecteMonth.holidayDetails.length; i++) {
              //console.log(this.holidayCalendar.holidayDetails[i].HolidayDate);
              this.monthtlyHolidaysInSelectedMonth.push(this.holidayCalendarInselecteMonth.holidayDetails[i].HolidayDate);
            }
          }
          console.log(this.monthtlyHolidaysInSelectedMonth);
          console.log(this.monthtlyHolidaysInSelectedMonth.length);
          if (this.monthtlyHolidaysInSelectedMonth.length < 0) {
            console.log(this.monthtlyHolidaysInSelectedMonth.length);
          } else {
            for (var k = 0; k < this.monthtlyHolidaysInSelectedMonth.length; k++) {
              //console.log(this.monthtlyHolidaysInSelectedMonth.length); 
              var hoildayDate = new Date(this.monthtlyHolidaysInSelectedMonth[k]).getDate();
              //console.log(hoildayDate);
              this.tempObj = this.namesofallDays.buildingJsonData.find(singleArray => singleArray.taskDay == hoildayDate);
              ///console.log(this.tempObj);
              this.tempObj.hoursWorked = 0;
            }
          }
        },
          (err: any) => {
            if (err.error.StatusCode != 200) {
              console.log(err.error);
              let alert = this.alertCtrl.create({
                title: 'Info...!!!',
                subTitle: 'No Public Holidays in this Month',
                buttons: ['OK']
              });
              alert.present();
            }
          });
      for (let i = 0; i < selectMonthDaysCount; i++) {
        var j = i + 1;
        var nd = new Date(this.selectedYear, (this.monthNumber - 1), j);
        console.log(nd);
        var daysAfterSelected = namesOfDaysSelected[nd.getDay()] + ',' + j;
        this.namesofallDays.dayOfWeek.push(daysAfterSelected);
        if (nd.getDay() == 0 || nd.getDay() == 6) {
          var th = 0;
          //console.log(th);
        }
        else if (nd.getDay() == 1 || nd.getDay() == 2 || nd.getDay() == 3 || nd.getDay() == 4 || nd.getDay() == 5) {
          th = 8;
          //console.log(th);
        }
        //console.log(dayNameAferChange);
        var entireObjectForSelectedMonth = {
          taskDay: j,
          taskDate: $event + '/' + this.monthNumber + '/' + j,
          hoursWorked: th,
          projectid: this.capturedProjectID,
          taskid: this.capturedTaskID
        }
        this.namesofallDays.buildingJsonData.push(entireObjectForSelectedMonth);
      }
      console.log(this.namesofallDays.buildingJsonData);
    }
  }

  hoursSelected($event, rowIndex) {
    var hoursValue = $event._value;
    if(hoursValue < 0 || hoursValue > 24) {
      this.namesofallDays.buildingJsonData[rowIndex].hoursWorked = hoursValue;
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
    } else if (hoursValue >= 0 && hoursValue <= 24) {
      this.namesofallDays.buildingJsonData[rowIndex].hoursWorked = hoursValue;
      this.isSaveDisabled = false;
      this.isSubmitDisabled = false;
    }
    console.log(this.namesofallDays);
      for(var i=0;i<this.namesofallDays.buildingJsonData.length;i++) {
        if(this.namesofallDays.buildingJsonData[i].hoursWorked > 24) {
          this.isSaveDisabled = true;
          this.isSubmitDisabled = true;
          break;
        } else {
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        }
      }
  }

  taskSelected($event, rowIndex) {
    var selectedValue = this.retrievedTasksList.find(item => item.TaskId == $event);
    if (selectedValue != null) {
      //this.namesofallDays.buildingJsonData[rowIndex].passingTaskType = selectedValue.TaskName;
      this.namesofallDays.buildingJsonData[rowIndex].taskid = selectedValue.TaskId;
    }
    console.log(this.namesofallDays);
  }

  submit() {
    const onLoadBuildObject = {
      timesheets: {
        UserID: this.capturedUserID,
        TaskDate: this.selectedYear + '/' + this.monthNumber + '/' + "1",
        comments: 'Worked in ' + this.namesofMonth + ', ' + this.selectedYear,
        projectID: this.capturedProjectID,
        SubmittedType: "Submit"
      },
      listtimesheetdetails: []
    }
    onLoadBuildObject.listtimesheetdetails = this.namesofallDays.buildingJsonData;
    //console.log(onLoadBuildObject);
    this.finalRequest = onLoadBuildObject;
    //alert(JSON.stringify(this.finalRequest));
    console.log(this.finalRequest);
    this.sp.postSheet(this.finalRequest)
      .subscribe(res => {
        this.responseAfterSubmit = res;
        console.log(this.responseAfterSubmit);
        if (this.responseAfterSubmit.status.StatusCode == 200) {
          if (this.responseAfterSubmit.SubmittedState == 'Repeated') {
            let toast = this.toastCtrl.create({
              message: this.responseAfterSubmit.Message,
              duration: 3500
            });
            toast.present();
          }
          else if (this.responseAfterSubmit.SubmittedState == 'Once') {
            let toast = this.toastCtrl.create({
              message: this.responseAfterSubmit.Message,
              duration: 3500
            });
            toast.present();
            this.navCtrl.setRoot(DashboardPage);
          }
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            alert('Error in retrieving');
          }
        });
  }

  save() {
    const onLoadBuildObject = {
      timesheets: {
        UserID: this.capturedUserID,
        TaskDate: this.selectedYear + '/' + this.monthNumber + '/' + "1",
        comments: 'Worked in ' + this.namesofMonth + ', ' + this.selectedYear,
        projectID: this.capturedProjectID,
        SubmittedType: "Save"
      },
      listtimesheetdetails: []
    }
    onLoadBuildObject.listtimesheetdetails = this.namesofallDays.buildingJsonData;
    console.log(onLoadBuildObject);
    this.finalRequest = onLoadBuildObject;
    //alert(JSON.stringify(this.finalRequest));
    //console.log(this.finalRequest);
    this.sp.postSheet(this.finalRequest)
      .subscribe(res => {
        this.responseAfterSubmit = res;
        console.log(this.responseAfterSubmit);
        if (this.responseAfterSubmit.status.StatusCode == 200) {
          if (this.responseAfterSubmit.SubmittedType == 'Save') {
            let toast = this.toastCtrl.create({
              message: this.responseAfterSubmit.Message,
              duration: 3500
            });
            toast.present();
          }
          this.navCtrl.setRoot(DashboardPage);
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            alert('Error in retrieving');
          }
        });
  }
}
