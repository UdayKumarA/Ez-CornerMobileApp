import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, MenuController, AlertController } from 'ionic-angular';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-forgetpwd',
  templateUrl: 'forgetpwd.html',
})
export class ForgetpwdPage {
  public pwdChangeForm: FormGroup;
  username: any;
  oldPassword: any;
  newPassword: any;
  pwdChanged: any;

  constructor(public formBuilder: FormBuilder, public menuCtrl: MenuController, public navCtrl: NavController,public storage:Storage,
    public navParams: NavParams, public viewCtrl: ViewController, public sp: SubmittimesheetProvider, public alertCtrl: AlertController) {
    //var pwdRegExp = '/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/';
    this.menuCtrl.enable(false);
    this.pwdChangeForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      oldPassword: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    })
    this.storage.get('globalData').then((globalData) => {
      console.log('Forget Password Local Data ', globalData);
      //this.username = globalData.EmpInfobyLogin.EmpEmailId;
      //console.log(this.username);
    })
  }
  public closeModal() {
    this.viewCtrl.dismiss();
  }

  resetPassword() {
    if (this.oldPassword == this.newPassword) {
      let alert = this.alertCtrl.create({
        title:'Evolutyz Corner',
        message:'OldPassword and New Password cannot be same',
        buttons:['OK']
      })
      alert.present();
    } else {
      const forgetObject = {
        "username": this.username,
        "password": this.oldPassword,
        "NewPassword": this.newPassword
      }
      console.log(forgetObject);
      this.sp.forgetpwd(forgetObject).subscribe(res => {
        this.pwdChanged = res;
        console.log(this.pwdChanged);
        if (this.pwdChanged.StatusCode == 200) {
          //alert(this.pwdChanged.message.message);
          const alert = this.alertCtrl.create({
            title: 'Reset Password',
            subTitle: this.pwdChanged.message.message,
            buttons: ['OK']
          });
          alert.present();
          this.viewCtrl.dismiss();
        }
      },
        (err: any) => {
          if (err.error.StatusCode != 200) {
            console.log(err.error);
            //alert(err.error.message.message);
            const alert = this.alertCtrl.create({
              title: 'Reset Password',
              subTitle: 'Please Enter Valid ID and Password',
              buttons: ['OK']
            });
            alert.present();
          }
        });
    }
  }
}
