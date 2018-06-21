import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../../signup/signup';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../../../config/global';
import {Response, Http} from '@angular/http';
import { Storage} from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {

  public signinPage = SignupPage;
  private data: FormGroup;
  private verifyCode: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public global: Globals,
              public storage: Storage,
              public http: Http) {

    this.data = this.formBuilder.group({
      newPassword: ['', Validators.required],
      passwordResetCode: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  submitForm() {

     this.storage.get('verificationCode').then((code)=>{
           this.verifyCode= code;

           var formData = {
            password_reset_code: this.data.value.passwordResetCode,
            new_password: this.data.value.newPassword,
            confirm_password: this.data.value.confirmPassword,
            code: this.verifyCode,
          };

          console.log(formData);
          this.http.post(this.global.public_url + 'update-password', formData)
            .map((res: Response) => res.json())
            .subscribe(data => {
              console.log(data);
              this.global.showMessageSuccess(data.message);
              this.navCtrl.setRoot(SignupPage);
            },

            error => {
              console.log(error);
              if (error.status !== 200) {
                var data = error._body;
                console.log(data.message);
                var parsedData = JSON.parse(data);
                this.global.showErrorPop(parsedData.message);
              }
          });
    });

  }


}
