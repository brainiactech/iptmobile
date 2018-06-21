
import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import { MotherVesselHomePage } from '../mother-vessel-home/mother-vessel-home';


/**
 * Generated class for the MotherVesselConfirmDispatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-vessel-confirm-dispatch',
  templateUrl: 'mother-vessel-confirm-dispatch.html',
})
export class MotherVesselConfirmDispatchPage {
  daughter_vessel_id = this.navParams.get('daughter_vessel_id');
  mother_vessel_id = this.navParams.get('mother_vessel_id');
  product_id = this.navParams.get('product_id');
  bill_of_laden_qty = this.navParams.get('bill_of_laden_qty');
  dispatch_date = this.navParams.get('dispatch_date');
  product = this.navParams.get('product_name');
  mother = this.navParams.get('mother_name');
  daughter = this.navParams.get('daughter_name');
  bill_of_laden_no = this.navParams.get('bill_of_laden_no');
  status_id = 6; //this.navParams.get('status_id');

  constructor(public storage: Storage,
    public navCtrl: NavController, public authHttp: AuthHttp, public viewCtrl: ViewController,
    public navParams: NavParams, public global: Globals, private alertCtrl: AlertController) {
  }


  confirm() {
    let data = {
      "daughter_vessel_id": this.daughter_vessel_id,
      "mother_vessel_id": this.mother_vessel_id,
      "type_id": this.product_id,
      "bill_of_laden_qty": this.bill_of_laden_qty,
      "dispatch_date": this.dispatch_date,
      "bill_of_laden_no": this.bill_of_laden_no,
      "status_id": this.status_id

    };


    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'mother_vessel_dispatches', data)
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
            // this.navCtrl.setRoot(MotherVesselHomePage);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MotherVesselConfirmDispatchPage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
