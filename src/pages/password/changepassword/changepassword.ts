import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Response} from '@angular/http';
import { Globals } from '../../../config/global';
import { HomePage } from '../../home/home';

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  private data: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public storage: Storage, 
              public global: Globals,
              public authHttp: AuthHttp,) {

    this.data = this.formBuilder.group({
      newPassword: ['', Validators.required],
      oldPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  submitForm() {

    var data = {
      old_password: this.data.value.oldPassword,
      new_password: this.data.value.newPassword,
      confirm_password: this.data.value.confirmPassword,

    };

    console.log(data);
    this.authHttp.post(this.global.public_url + 'change-password', data)
      .map((res: Response) => res.json())
      .subscribe(data => {
        console.log(data);
        this.global.showErrorToast(data.message);
        this.navCtrl.setRoot(HomePage);
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
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }
}
