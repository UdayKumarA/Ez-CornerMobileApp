import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeavecalendarPage } from './leavecalendar';

@NgModule({
  declarations: [
    LeavecalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(LeavecalendarPage),
  ],
})
export class LeavecalendarPageModule {}
