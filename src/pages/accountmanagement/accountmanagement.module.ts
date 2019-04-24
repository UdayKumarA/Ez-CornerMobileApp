import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountmanagementPage } from './accountmanagement';

@NgModule({
  declarations: [
    AccountmanagementPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountmanagementPage),
  ],
})
export class AccountmanagementPageModule {}
