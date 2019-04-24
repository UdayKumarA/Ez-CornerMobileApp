import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SubmittimesheetProvider } from '../../providers/submittimesheet/submittimesheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  public pwdChangeForm: FormGroup;
  UsrP_UserID:any;
  UsrFstName:any;
  UsrLstName:any;
  UsrP_EmailID: any;
  UsrP_EmployeeID:any;
  UsrP_MobNum:any;
  UsrP_PhoneNumber:any;
  UsrP_DOB: any;
  UsrP_DOJ:any;
  imgURL:any;
  editedResObj:any;
  storedUserID:any;storedEmpID: any;storedEmail;any;storedDOJ:any;storedFN:any;storedLN:any;

  constructor(public storage:Storage, public toastCtrl:ToastController, public navCtrl: NavController, public navParams: NavParams, private sp:SubmittimesheetProvider, public formBuilder: FormBuilder) {

    this.storage.get('globalData').then((data) => {
      console.log(data);
      this.storedUserID = data.EmpInfobyLogin.userid;
      this.storedEmpID = data.EmpInfobyLogin.EmpId;
      this.storedEmail = data.EmpInfobyLogin.EmpEmailId;
      this.storedDOJ = data.EmpInfobyLogin.DOJ;
      this.storedFN = data.EmpInfobyLogin.EmpFirstName;
      this.storedLN = data.EmpInfobyLogin.EmpLastName;
      console.log(this.storedUserID+ ' '+this.storedEmpID+' '+this.storedEmail+' '+this.storedDOJ+' '+this.storedFN+' '+this.storedLN);
    })

    this.imgURL = "https://cdn2.iconfinder.com/data/icons/website-icons/512/User_Avatar-512.png";
    //const emailRegExp = '^[a-z0-9A-Z_]+(\.[_a-z0-9A-Z]+)*@[a-z0-9-A-Z]+(\.[a-z0-9-A-Z]+)*(\.[a-zA-Z]{2,15})$';
    // const nameExp = '[a-zA-Z][a-zA-Z ]';
    //const empID = '[a-zA-Z][a-zA-Z ]+[0-9]*';
    //const usrid = '[0-9]*';
    const numbers = '[0-9]*';

    this.pwdChangeForm = formBuilder.group({
      UsrP_UserID: [],
      UsrFstName: ['', Validators.compose([Validators.required])],
      UsrLstName: ['', Validators.compose([Validators.required])],
      UsrP_EmailID: [],
      UsrP_EmployeeID:[],
      UsrP_MobNum:['', Validators.compose([Validators.required, Validators.pattern(numbers), Validators.minLength(10), Validators.maxLength(10)])],
      UsrP_PhoneNumber:['', Validators.compose([Validators.required, Validators.pattern(numbers), Validators.minLength(10), Validators.maxLength(10)])],
      UsrP_DOB: ['', Validators.compose([Validators.required])],
      UsrP_DOJ: []
    })  
  }

  updateProfile(){
    const editingObject = {
      "UsrP_UserID": this.storedUserID,
      "UsrFstName": this.storedFN,
      "UsrLstName": this.storedLN,
      "UsrP_EmailID":this.storedEmpID,
      "UsrP_EmployeeID":this.storedEmpID,
      "UsrP_MobNum":this.UsrP_MobNum,
      "UsrP_PhoneNumber":this.UsrP_PhoneNumber,
      "UsrP_ProfilePicture":this.imgURL,
      "UsrP_DOB": this.UsrP_DOB,
      "UsrP_DOJ": this.storedDOJ
    }
    //console.log(editingObject);
    this.sp.editProfile(editingObject).subscribe((res)=> {
      //console.log(res);
      this.editedResObj = res;
      if(this.editedResObj.StatusCode == 200) {
        let toast = this.toastCtrl.create({
          message: this.editedResObj.StatusMessage,
          duration: 2500
        });
        toast.present();
        this.navCtrl.popToRoot();
      }
    },
		(err: any) => 
		{
			if(err.error.StatusCode != 200){ 
				console.log(err.error);
				alert('Please Enter the Valid Information');
			}
    });
  }
  changePhoto() {
    console.log('Change Pic clicked');
  }
}
