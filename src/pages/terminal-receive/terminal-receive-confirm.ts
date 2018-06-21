import {Component} from "@angular/core";
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {SuccessPage} from "../terminal-success/success";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import { HomePage } from "../home/home";


@Component({
  selector: 'page-terminal-receive-confirm',
  templateUrl: 'terminal-receive-confirm.html',
})
export class TerminalReceiveConfirmPage {
  type_id = this.navParams.get('type_id');
  terminal_id = this.navParams.get('terminal_id');
  bill_date = this.navParams.get('bill_date');
  qty_dispatch = this.navParams.get('qty_dispatch');
  daughter_vessel = this.navParams.get('daughterVessel');
  daughter_vessel_id = this.navParams.get('daughter_vessel_id');
  terminal = this.navParams.get('terminal');
  product = this.navParams.get('product');
  bill_of_laden_no = this.navParams.get('bill_of_laden_no');

  constructor(public navCtrl: NavController, public authHttp: AuthHttp, public viewCtrl: ViewController,
              public navParams: NavParams, public global: Globals, private alertCtrl: AlertController) {
    //console.log(this.type_id)
  }


  confirm() {
    let data = {
      "type_id": this.type_id,
      "terminal_id": this.terminal_id,
      "bill_date": this.bill_date,
      "qty_dispatch": this.qty_dispatch,
      "daughter_vessel_id": this.daughter_vessel_id,
      "bill_of_laden_no": this.bill_of_laden_no,

    };

    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'terminal_receives', data)
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
            // this.navCtrl.setRoot(HomePage);
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

}
