import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Response} from "@angular/http";
import {Globals} from "../../config/global";
import {OutletReceivedPage} from "./outlet-received";
import {OutletReceiveListPage} from "../outlet-receive-list/outlet-receive-list";

/**
 * Generated class for the OutletReceivedFinalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-outlet-received-final',
  templateUrl: 'outlet-received-final.html',
})
export class OutletReceivedFinalPage {
  theData = this.navParams.get('data');
  private data: FormGroup;

  constructor(public storage: Storage,
              public authHttp: AuthHttp,
              public global: Globals,
              public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder,
              private alertCtrl: AlertController) {
    console.log(this.theData);

    this.data = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  ionViewDidLoad() {

  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentPrompt(message) {

    let alert = this.alertCtrl.create({
      title: 'Successful',
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.refreshPage();
          }
        },

      ],

    });
    alert.present();
  }

  saveOutletReceive() {
    console.log(this.theData.retail_outlet_id);
    this.authHttp.post(this.global.public_url + 'receives/save', this.theData)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.presentPrompt(data.message);
          this.global.dismissLoading();
          this.navCtrl.setRoot(OutletReceiveListPage);
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            this.global.handleMessage(data);
            this.global.dismissLoading();
          }
        });

  }

  submit() {
    let datas = this.data.value;
    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'validate-password', datas)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.saveOutletReceive();
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            this.global.handleMessage(data);
            this.global.dismissLoading();
          }
        });
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
