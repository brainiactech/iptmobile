import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Globals} from "../../config/global";
import {Response} from '@angular/http';
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {HomePage} from "../home/home";
import {WelcomePage} from "../welcome/welcome";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MotherVesselReceiveConfirmPage} from "../mother-vessel-receive/mother-vessel-receive-confirm";
import {MotherVesselSuccessPage} from "../mother-vessel-success/success";
import {SignupPage} from "../signup/signup";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";

/**
 * Generated class for the OutletDailyLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-outlet-daily-log',
  templateUrl: 'outlet-daily-log.html',
})
export class OutletDailyLogPage {
  private theTank: boolean;
  private outlet_tank_id: any;
  private data: FormGroup;
  private theUser: any;

  constructor(private formBuilder: FormBuilder,
              public auth: AuthServiceProvider,
              public alertCtrl: AlertController,
              public storage: Storage, public navCtrl: NavController,
              public navParams: NavParams, public global: Globals,
              public authHttp: AuthHttp, public getFunction: GeneralServiceProvider) {

    this.getTank();
    this.data = this.formBuilder.group({
      vol: ['', [Validators.required]],
      outlet_tank_id: ['', [Validators.required]],
    });
  }

  ionViewDidLoad() {
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      if (!tokenNotExpired(null, token)) {
        this.navCtrl.setRoot(HomePage);
      }
    });

  }

  loading() {
    this.global.showLoading();
    if (this.theTank) {
      this.global.dismissLoading();
    }
  }

  getTank() {
    this.loading();
    this.theTank = false;
    this.storage.get('user').then(user => {
      this.theUser = user;
      this.authHttp.get(this.global.public_url + 'outlet_tanks/outlet/' + user.outlet[0].id)
        .subscribe(res => {
          this.outlet_tank_id = this.getFunction.parseData(res);
          this.theTank = true;
          this.loading()
        });
    }).catch(error => {
      this.auth.logout().subscribe(succ => {
        this.global.showErrorToast('You are log out');
        this.navCtrl.setRoot(WelcomePage);
        this.global.dismissLoading();

      });

    });


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
            this.navCtrl.setRoot(OutletDailyLogPage);
          }
        },

      ],

    });
    alert.present();
  }

  presentProfileModal() {
    let data = this.data.value;
    if (!this.data.invalid) {
      this.global.showLoading();
      this.authHttp.post(this.global.public_url + 'outlet_hcmbs', data)
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
    }
    console.log(this.data.invalid)
  }

  createTank() {

    let alert = this.alertCtrl.create({
      title: 'Tank name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Enter a tank name'
        },
        {
          name: 'max_vol_qty',
          placeholder: 'Enter Maximum Volume Quantity',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Add',
          handler: data => {
            var datas = {
              outlet_id: this.theUser.outlet[0].id,
              name: data.name,
              max_vol_qty: data.max_vol_qty
            };
            this.global.showLoading();
            this.authHttp.post(this.global.public_url + 'outlet_tanks', datas)
              .map((res: Response) => res.json())
              .subscribe(() => {
                this.getTank();
              });
            //this.refreshPage();


          }
        }
      ]
    });
    alert.present();
  }

}
