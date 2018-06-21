import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import { MotherVesselHomePage } from '../mother-vessel-home/mother-vessel-home';

/**
 * Generated class for the MotherVesselReceiveConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-vessel-receive-confirm',
  templateUrl: 'mother-vessel-receive-confirm.html',
})
export class MotherVesselReceiveConfirmPage {
  type_id = this.navParams.get('type_id');
  mother_vessel_id = this.navParams.get('mother_vessel_id');
  bill_of_laden_no = this.navParams.get('bill_of_laden_no');
  arrival_date = this.navParams.get('arrival_date');
  bill_of_laden_qty = this.navParams.get('bill_of_laden_qty');
  out_turn_qty = this.navParams.get('out_turn_qty');
  product = this.navParams.get('product');
  motherVessel = this.navParams.get('motherVessel');
  motherVesselTotalDispatches = this.navParams.get('motherVesselTotalDispatches');
  motherVesselTotalReceived = this.navParams.get('motherVesselTotalReceived');
  

  constructor(public navCtrl: NavController, public authHttp: AuthHttp, public viewCtrl: ViewController,
              public navParams: NavParams, public global: Globals, private alertCtrl: AlertController) {
    console.log(this.type_id)
  }

  dismiss() {
    let data = {'foo': 'bar'};
    this.viewCtrl.dismiss(data);
  }

  confirm() {


    let data = {
      "type_id": this.type_id,
      "bill_of_laden_no": this.bill_of_laden_no,
      "arrival_date": this.arrival_date,
      "bill_of_laden_qty": this.bill_of_laden_qty,
      "out_turn_qty": this.out_turn_qty,
      "mother_vessel_id": this.mother_vessel_id,
      "motherVessel": this.motherVessel,
      "motherVesselTotalDispatches": this.motherVesselTotalDispatches,
      "motherVesselTotalReceived": this.motherVesselTotalReceived,

    };
    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'mother_vessel_receives', data)
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
            this.navCtrl.setRoot(MotherVesselHomePage);
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
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MotherVesselReceiveConfirmPage');
  }

}
