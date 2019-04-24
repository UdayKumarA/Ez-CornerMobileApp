import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
//import { AccountmanagementPage } from '../pages/accountmanagement/accountmanagement';
import { EditprofilePage } from '../pages/editprofile/editprofile';
//submenu
// import { UsertypePage } from '../pages/usertype/usertype';
// import { UsersPage } from '../pages/users/users';
// import { AddeditrolePage } from '../pages/addeditrole/addeditrole';
// import { AssociatemodulesPage } from '../pages/associatemodules/associatemodules';
// import { AddeditprojectsPage } from '../pages/addeditprojects/addeditprojects';
// import { AssociateusersPage } from '../pages/associateusers/associateusers';
// import { LeavetypemasterPage } from '../pages/leavetypemaster/leavetypemaster';
// import { LeaveschemePage } from '../pages/leavescheme/leavescheme';
// import { LeaveworkflowPage } from '../pages/leaveworkflow/leaveworkflow';
import { SubmittimesheetPage } from '../pages/submittimesheet/submittimesheet';
import { ApprovalsrejectionsPage } from '../pages/approvalsrejections/approvalsrejections';
import { LeavecalendarPage } from '../pages/leavecalendar/leavecalendar';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  showSubmenu: boolean = false;
  showuserSubmenu: boolean = false;
  showroleSubmenu: boolean = false;
  showprojectSubmenu: boolean = false;
  showleaveSubmenu: boolean = false;
  apprRejSubmenu: boolean = false;

  usermenuHandler(): void {
    this.showuserSubmenu = !this.showuserSubmenu;
  }
  rolemenuItemHandler(): void {
    this.showroleSubmenu = !this.showroleSubmenu;
  }
  projectmenuItemHandler(): void {
    this.showprojectSubmenu = !this.showprojectSubmenu;
  }
  leavemenuItemHandler(): void {
    this.showleaveSubmenu = !this.showleaveSubmenu;
  }
  appRejItemHandler(): void {
    this.apprRejSubmenu = !this.apprRejSubmenu;
  }

  rootPage: any = LoginPage;
  public alertShown: boolean = false;
  componentJSON: any;
  appLocalStorage: any; userID: any; AccID: any;
  curMonthNumber: any; actionURL: any; holidayCalendar: any; monthtlyHoliday: any[] = [];

  pages: Array<{ title: string, component: any }>;
  usermenu: Array<{ title: string, component: any }>;
  rolemenu: Array<{ title: string, component: any }>;
  projectmenu: Array<{ title: string, component: any }>;
  leavemenu: Array<{ title: string, component: any }>;
  appRejmenu: Array<{ title: string, component: any }>;

  constructor(public _http: HttpClient, public storage: Storage, public platform: Platform, public alertCtrl: AlertController, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    
    this.actionURL = 'http://192.168.75.12:5022/api/ECorner/';
    //this.actionURL = 'http://192.168.75.12:6022/api/ECorner/';

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: DashboardPage },
      { title: 'Submit Timesheet', component: SubmittimesheetPage },
      { title: 'Apply Leave', component: LeavecalendarPage }
      // { title: 'Account Management', component: AccountmanagementPage },
    ];

    // this.usermenu = [
    //   {title: 'User Type', component: UsertypePage },
    //   {title: 'Users', component: UsersPage }
    // ];
    // this.rolemenu = [
    //   { title: 'Add/Edit Role', component: AddeditrolePage },
    //   { title: 'Associate Modules', component: AssociatemodulesPage }
    // ];
    // this.projectmenu = [
    //   { title: 'Add/Edit Projects', component: AddeditprojectsPage },
    //   { title: 'Associate User', component: AssociateusersPage }
    // ];
    // this.leavemenu = [
    //   { title: 'Apply Leave', component: LeavecalendarPage }
    // ];
    // this.appRejmenu = [
    //   { title: 'Submit Timesheet', component: SubmittimesheetPage }
    //   // { title: 'Approvals Rejections', component: ApprovalsrejectionsPage }
    // ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('globalData').then((globalData) => {
        this.appLocalStorage = globalData;
        console.log(this.appLocalStorage);
        this.userID = this.appLocalStorage.EmpInfobyLogin.userid;
        this.AccID = this.appLocalStorage.EmpInfobyLogin.AccountID;
        this.holiday();
      })
      // this.storage.get('globalData').then(loggedIN => {
      //   this.rootPage = loggedIN ? DashboardPage:LoginPage;
      // });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, { sendData: this.appLocalStorage, sendMonthHolidays: this.monthtlyHoliday });
  }
  holiday() {
    this.curMonthNumber = new Date().getMonth() + 1;
    this._http.post(this.actionURL + 'HolidayCalenderList/' + this.userID + '/' + this.AccID + '/' + new Date().getFullYear() + '-' + this.curMonthNumber, { headers: this.headers })
      .subscribe(res => {
        this.holidayCalendar = res;
        console.log(this.holidayCalendar);
        if (this.holidayCalendar.status.StatusCode == 200) {
          for (var i = 0; i < this.holidayCalendar.holidayDetails.length; i++) {
            //console.log(this.holidayCalendar.holidayDetails[i].HolidayDate);
            this.monthtlyHoliday.push(this.holidayCalendar.holidayDetails[i].HolidayDate);
          }
        }
        console.log(this.monthtlyHoliday);
      });
  }

  editProfile() {
    this.nav.push(EditprofilePage);
  }
  logout() {
    this.storage.clear();
    this.nav.setRoot(LoginPage);
    console.log(this.appLocalStorage);
  }
}
