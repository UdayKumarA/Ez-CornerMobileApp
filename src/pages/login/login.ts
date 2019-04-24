import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { DashboardPage } from '../../pages/dashboard/dashboard';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { ForgetpwdPage } from '../forgetpwd/forgetpwd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
//import { FCM } from '@ionic-native/fcm';
import { HttpClient } from '@angular/common/http';
import { t } from '@angular/core/src/render3';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  username: any;
  password: any;
  tok: any;
  afterLoginObject: any;
  generatedFCMToken: any;

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, //public fcm: FCM,
    public formBuilder: FormBuilder, public alertCtrl: AlertController, private menuCtrl: MenuController, private afAuth: AngularFireAuth,
    private sp: SubmittimesheetProvider, public loadingCtrl: LoadingController, public storage: Storage) {

    //this.onNotification();
    this.menuCtrl.enable(false);
    //const emailRegExp = '^[a-z0-9A-Z_]+(\.[_a-z0-9A-Z]+)*@[a-z0-9-A-Z]+(\.[a-z0-9-A-Z]+)*(\.[a-zA-Z]{2,15})$';
    //const pwdRegExp = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$';

    this.loginForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  forgetPassword() {
    // this.navCtrl.push(ForgetpwdPage);
    var forgetModalPage = this.modalCtrl.create(ForgetpwdPage);
    forgetModalPage.present();
  }
  loginUser() {
    // this.fcm.getToken().then(token => {
    //   alert(JSON.stringify(token));
    //   this.generatedFCMToken = token;
    //   console.log(token);
    // }); 

    const postLogin =
    {
      username: this.username,
      password: this.password,
      //token: this.generatedFCMToken
    }
    //console.log(postLogin);

    // this.afAuth.auth.signInWithEmailAndPassword(this.username, this.password)
    // 	.then(data => {
    // 		console.log(data);
    // 		//alert(JSON.stringify(data.user.refreshToken));
    // 		//alert(JSON.stringify(data.user.uid));
    // 	});
    //console.log(postLogin);
    this.sp.loginIN(postLogin).subscribe(res => {
      this.afterLoginObject = res;
      console.log(this.afterLoginObject);
      //alert(JSON.stringify(this.afterLoginObject));
      if (this.afterLoginObject.StatusCode == 200) {
        let loader = this.loadingCtrl.create({
          spinner: "bubbles",
          content: "Please Wait...!!!",
          duration: 1500
        });
        loader.present();
        this.setSendData();
        setTimeout(() => {
          this.navCtrl.setRoot(DashboardPage);
        }, 1000)
      }
    },
      (err: any) => {
        if (err.error.StatusCode == 404) {
          console.log(err.error);
          const alert = this.alertCtrl.create({
            title: 'Login',
            subTitle: 'Please verify your ID and Password!!!',
            buttons: ['OK']
          });
          alert.present();
        } else if (err.error.StatusCode == 500) {
          console.log(err.error);
          const alert = this.alertCtrl.create({
            title: 'Login',
            subTitle: 'Please try after sometimes.. Thanks for your patience',
            buttons: ['OK']
          })
          alert.present();
        }
      });
  }
  setSendData() {
    this.storage.set('globalData', this.afterLoginObject);
  }
  
}
