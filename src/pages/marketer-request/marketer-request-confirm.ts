import {Component} from "@angular/core";
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import {SuccessPage} from "../terminal-success/success";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-marketer-request-confirm',
    templateUrl: 'marketer-request-confirm.html',
})
export class MarketerRequestConfirmPage {

    product = this.navParams.get('product');
    type_id = this.navParams.get('type_id');
    retail = this.navParams.get('retail');
    retail_outlet_id = this.navParams.get('retail_outlet_id');
    product_vol = this.navParams.get('product_vol');

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
            "type_id": this.type_id,
            "product_vol": this.product_vol,
        };
        console.log(data);
        this.global.showLoading();
        this.authHttp.post(this.global.public_url + 'marketer_requests', data)
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
                        this.navCtrl.setRoot(HomePage);
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

}

