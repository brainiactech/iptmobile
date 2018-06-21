import {Component} from "@angular/core";
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import {SuccessPage} from "../terminal-success/success";
import { HomePage } from "../home/home";

@Component({
  selector: 'page-terminal-dispatch-confirm',
  templateUrl: 'terminal-dispatch-confirm.html',
})
export class TerminalDispatchConfirmPage {

  dispatch_type_id = this.navParams.get('dispatch_type_id');
  depot = this.navParams.get('depot');
  depot_id = this.navParams.get('depot_id');
  terminal_id = this.navParams.get('terminal_id');
  retail_outlet_id = this.navParams.get('retail_outlet_id');
  loading_date = this.navParams.get('loading_date');
  type_id = this.navParams.get('type_id');
  product = this.navParams.get('product');
  driver_name = this.navParams.get('driver_name');
  meter_ticket_no = this.navParams.get('meter_ticket_no');
  product_qty = this.navParams.get('product_qty');
  waybill_no = this.navParams.get('waybill_no');
  est_date_of_arrival = this.navParams.get('est_date_of_arrival');
  acquila_code = this.navParams.get('acquila_code');
  truck_no = this.navParams.get('truck_no');
  driver_no = this.navParams.get('driver_no');
  terminal = this.navParams.get('terminal');
  retail = this.navParams.get('retail');
  dispatchType = this.navParams.get('dispatch');
  status_id =6;

  constructor(public navCtrl: NavController, public authHttp: AuthHttp, public viewCtrl: ViewController,
              public navParams: NavParams, public global: Globals, private alertCtrl: AlertController) {

  }

  dismiss() {
    let data = {'foo': 'bar'};
    this.viewCtrl.dismiss(data);
  }

  confirm() {


    let data = {
      "retail_outlet_id": this.retail_outlet_id,
      "terminal_id": this.terminal_id,
      "depot_id": this.depot_id,
      "dispatch_type_id": this.dispatch_type_id,
      "loading_date": this.loading_date,
      "type_id": this.type_id,
      "driver_name": this.driver_name,
      "meter_ticket_no": this.meter_ticket_no,
      "product_qty": this.product_qty,
      "waybill_no": this.waybill_no,
      "est_date_of_arrival": this.est_date_of_arrival,
      "acquila_code": this.acquila_code,
      "truck_no": this.truck_no,
      "driver_no": this.driver_no,
      "status_id": this.status_id,

    };
//console.log(data);

    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'terminal_dispatches', data)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.presentPrompt(data.message);
          this.global.dismissLoading();
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            this.global.handleMessage(data);

          }
          this.global.dismissLoading();
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
            // this.navCtrl.setRoot(HomePage);
            let data = {'returnData': 'save'};
            this.viewCtrl.dismiss(data);
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
