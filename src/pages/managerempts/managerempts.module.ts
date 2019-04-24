import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageremptsPage } from './managerempts';

@NgModule({
  declarations: [
    ManageremptsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageremptsPage),
  ],
})
export class ManageremptsPageModule {}
