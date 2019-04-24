import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeventsPage } from './listevents';

@NgModule({
  declarations: [
    ListeventsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeventsPage),
  ],
})
export class ListeventsPageModule {}
