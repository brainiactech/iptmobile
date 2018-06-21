import { Component } from '@angular/core';
import {Globals} from "../../../config/global";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ResetpasswordPage } from '../resetpassword/resetpassword';
import { AuthServiceProvider } from '../../../providers/auth-service/auth-service';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Response, Http} from '@angular/http';
import { Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-verifycode',
  templateUrl: 'verifycode.html',
})
export class VerifycodePage {

  public resetPasswordPage = ResetpasswordPage;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public global: Globals,
              public http: Http,
              public storage: Storage, 
            ) {
  }

  public onSubmit(data) {
    this.global.showLoading();
    var formData = {code: data.code };

    this.http.post(this.global.public_url + 'verify-code', formData)
      .map((res: Response) => res.json())
      .subscribe(data => {
        this.global.dismissLoading();
        this.storage.set('verificationCode', data.verify_code);
        this.global.showMessageSuccess(data.message);
        this.navCtrl.setRoot(ResetpasswordPage);
    },
    error => {
      this.global.dismissLoading();
      if (error.status !== 200) {
        var data = error._body;
        var parsedData = JSON.parse(data);
        this.global.showErrorPop(parsedData.message);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifycodePage');
  }

}
