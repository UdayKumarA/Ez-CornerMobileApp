import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveformPage } from './leaveform';

@NgModule({
  declarations: [
    LeaveformPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveformPage),
  ],
})
export class LeaveformPageModule {}
