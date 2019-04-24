import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { fbConfig } from '../app/firebase.credentials';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { FCM } from '@ionic-native/fcm';
import { Firebase } from '@ionic-native/firebase';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AccountmanagementPage } from '../pages/accountmanagement/accountmanagement';
//submenu
import { UsertypePage } from '../pages/usertype/usertype';
import { UsersPage } from '../pages/users/users';
import { AddeditrolePage } from '../pages/addeditrole/addeditrole';
import { AssociatemodulesPage } from '../pages/associatemodules/associatemodules';
import { AddeditprojectsPage } from '../pages/addeditprojects/addeditprojects';
import { AssociateusersPage } from '../pages/associateusers/associateusers';
import { SubmittimesheetPage } from '../pages/submittimesheet/submittimesheet';
import { LeavecalendarPage } from '../pages/leavecalendar/leavecalendar';
import { ViewtimesheetPage } from '../pages/viewtimesheet/viewtimesheet';
import { AddeventPage } from '../pages/addevent/addevent';
import { ListeventsPage } from '../pages/listevents/listevents';
import { ApprovalsrejectionsPage } from '../pages/approvalsrejections/approvalsrejections';
import { PreviewtimesheetPage } from '../pages/previewtimesheet/previewtimesheet';
import { EdittimesheetPage } from '../pages/edittimesheet/edittimesheet';
import { ManageremptsPage } from '../pages/managerempts/managerempts';
import { ManagerempscrollsheetPage } from '../pages/managerempscrollsheet/managerempscrollsheet';
import { ForgetpwdPage } from '../pages/forgetpwd/forgetpwd';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { LeaveformPage } from '../pages/leaveform/leaveform';

//Components
import { BlueComponent } from '../components/blue/blue';
import { GreenComponent } from '../components/green/green';
import { OrangeComponent } from '../components/orange/orange';
import { PeachComponent } from '../components/peach/peach';
import { RedComponent } from '../components/red/red';
import { YellowComponent } from '../components/yellow/yellow';

import { HttpClientModule } from '@angular/common/http';
import { SubmittimesheetProvider } from '../providers/submittimesheet/submittimesheet';
import { CalendarModule } from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    DashboardPage,
    AccountmanagementPage,
    //submenu
    UsertypePage,
    UsersPage,
    AddeditrolePage,
    AddeventPage,
    ListeventsPage,
    AssociatemodulesPage,
    AddeditprojectsPage,
    AssociateusersPage,
    SubmittimesheetPage,
    LeavecalendarPage,
    ViewtimesheetPage,
    ApprovalsrejectionsPage,
    PreviewtimesheetPage,
    EdittimesheetPage,
    ManageremptsPage,LeaveformPage,
    ManagerempscrollsheetPage,
    ForgetpwdPage, EditprofilePage,
    //Components
    BlueComponent,GreenComponent,OrangeComponent,PeachComponent,RedComponent,YellowComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    NgxTwitterTimelineModule.forRoot(),
    FormsModule,
    IonicStorageModule.forRoot(),
    AngularFireAuthModule,   
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(fbConfig),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    DashboardPage,
    AccountmanagementPage,
    //submenu
    UsertypePage,
    UsersPage,
    AddeditrolePage,
    AddeventPage,
    ListeventsPage,
    AssociatemodulesPage,
    AddeditprojectsPage,
    AssociateusersPage,
    SubmittimesheetPage,
    LeavecalendarPage,
    ViewtimesheetPage,
    ApprovalsrejectionsPage,
    PreviewtimesheetPage,
    EdittimesheetPage,
    ManageremptsPage,LeaveformPage,
    ManagerempscrollsheetPage,
    ForgetpwdPage, EditprofilePage,
    //Components
    BlueComponent,GreenComponent,OrangeComponent,PeachComponent,RedComponent,YellowComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SubmittimesheetProvider,
    //FCM,
    Firebase
  ]
})
export class AppModule {}
