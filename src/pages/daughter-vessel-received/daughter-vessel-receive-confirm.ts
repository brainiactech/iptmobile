import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import { DaughterVesselHomePage } from '../daughter-vessel-home/daughter-vessel-home';

/**
 * Generated class for the MotherVesselReceiveConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'daughter-mother-vessel-receive-confirm',
  templateUrl: 'daughter-vessel-receive-confirm.html',
})
export class DaughterVesselReceiveConfirmPage {
  data = this.navParams.get('data');
  constructor(public navCtrl: NavController, public authHttp: AuthHttp, public viewCtrl: ViewController,
              public navParams: NavParams, public global: Globals, private alertCtrl: AlertController) {
                //console.log(this.data);
  }

  confirm() {
    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'daughter_vessel_receiveds', this.data)
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
          //  this.navCtrl.setRoot(DaughterVesselHomePage);
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
    
  }

  ionViewDidLoad() {

  }

}
