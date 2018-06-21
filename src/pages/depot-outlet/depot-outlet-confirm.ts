import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {AuthHttp, tokenNotExpired} from "angular2-jwt";
import {Globals} from "../../config/global";
import {TerminalReceiveConfirmPage} from "../terminal-receive/terminal-receive-confirm";
import {Response} from "@angular/http";
import {SuccessPageDepotOutlet} from "../depot-success/success";
import {Storage} from "@ionic/storage";
import { DepotVesselHomePage } from '../depot-vessel-home/depot-vessel-home';

/**
 * Generated class for the DepotOutletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-depot-outlet-confirm',
  templateUrl: 'depot-outlet-confirm.html',
})
export class DepotOutletConfirmPage {

  data = this.navParams.get('data');


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, private formBuilder: FormBuilder,
              public authHttp: AuthHttp, public global: Globals, private alertCtrl: AlertController, public storage: Storage) {

  }

  confirm() {

    this.global.showLoading();
    console.log(this.data);
    this.authHttp.post(this.global.public_url + 'depot_outlets', this.data)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.presentPrompt(data.message);
          this.global.dismissLoading();
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            this.global.handleMessage(data);
            this.global.dismissLoading();
          }
        });
    // this.navCtrl.setRoot(SuccessPage);
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
            let data = {'returnData': 'save'};
            this.viewCtrl.dismiss(data);
            //this.navCtrl.setRoot(DepotVesselHomePage);
          }
        },

      ],

    });
    alert.present();
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  reject() {
    let data = {'returnData': 'cancel'};
    this.viewCtrl.dismiss(data); 
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }


}
