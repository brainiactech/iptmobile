import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, App} from 'ionic-angular';
import {SetprofilePage} from '../setprofile/setprofile';
import {Globals} from "../../config/global";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Network} from '@ionic-native/network';
import {HomePage} from '../home/home';
import {AuthHttp, tokenNotExpired} from "angular2-jwt";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {Storage} from "@ionic/storage";


import {Response} from "@angular/http";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {ResetpasswordPage} from '../password/resetpassword/resetpassword';
import {VerifycodePage} from '../password/verifycode/verifycode';
import {ViewChild} from "angular2/core";
import {FormGroup} from "@angular/forms";
import {WelcomePage} from "../welcome/welcome";
import {OutletPage} from "../outlet/outlet";
import {MarketerPage} from "../marketer/marketer";
import {MotherVesselHomePage} from "../mother-vessel-home/mother-vessel-home";
import {DaughterVesselHomePage} from "../daughter-vessel-home/daughter-vessel-home";
import {DepotVesselHomePage} from "../depot-vessel-home/depot-vessel-home";


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public setProfilePage = SetprofilePage;
  public verifyCodePage = VerifycodePage;
  public details;
  private oneSignalPlayerID: any;

  constructor(public getFunction: GeneralServiceProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public global: Globals,
              private alertCtrl: AlertController,
              private auth: AuthServiceProvider,
              public network: Network, public authHttp: AuthHttp, public storage: Storage,
              private uniqueDeviceID: UniqueDeviceID) {


  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      if (tokenNotExpired(null, token)) {
        // this.validate();
      }
    });
  }


  ionViewDidLoad() {
    if (this.auth.loggedIn()) {
      //this.pushPages(HomePage);
      this.validate();
    }
  }

  public validate() {
    this.global.showLoading();
    this.storage.get('user').then(user => {
      let datas = user;
      if (datas.roles.length == 0) {
        this.auth.logout().subscribe(succ => {
          this.global.showErrorToast('You are log out');
          this.pushPages(WelcomePage)
        });
      }
      this.global.dismissLoading();
      switch (datas.roles[0].name) {
        case "terminal-auditor" : {
          this.pushPages(HomePage);
        }
          break;

        case "outlet-manager" : {
          this.pushPages(OutletPage);
        }
          break;


        case "outlet-admin" : {
          this.pushPages(MarketerPage);
        }
          break;


        case "mother-vessel-auditor" : {
          this.pushPages(MotherVesselHomePage);
        }
          break;


        case "daughter-vessel-auditor" : {
          this.pushPages(DaughterVesselHomePage);
        }
          break;

        case "depot-auditor" : {
          this.pushPages(DepotVesselHomePage);
        }
          break;

        default: {
          this.auth.logout().subscribe(succ => {
            this.global.showErrorToast('You are log out');
            this.pushPages(WelcomePage)
          });
        }
          break;
      }

    }).catch(error => {
      this.global.dismissLoading();
     this.navCtrl.setRoot(SetprofilePage);
    });


  }

  ionViewWillEnter() {
    return this.storage.get('token').then(token => {
      if (tokenNotExpired(null, token)) {
        //this.pushPages(HomePage);
        this.validate();
      }
    });
  }

  pushPages(page) {
    this.navCtrl.setRoot(page);
  }


  showError(text) {
    this.global.dismissLoading();
    if (text == "" || this.network.type == "none") {
      text = "Check your internet connection";
    }
    let alert = this.alertCtrl.create({
      title: 'Whoops!',
      subTitle: text, //"Incorrect username or password ",
      buttons: ['OK']
    });
    alert.present();
  }

  public onRealSubmit(data) {
    this.global.showLoading();


  }

  checkRedirect() {
    this.storage.get('user').then(user => {
      this.validate();

    }).catch(error => {
      this.navCtrl.setRoot(SetprofilePage);

    });
  }

  live(data) {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.auth.login({
            "verification_code": data.code,
            "password": data.password,
            "imei": uuid
          }
        ).subscribe(data => {
            this.global.dismissLoading();
            if (data !== '') {
              this.global.dismissLoading();
              this.checkRedirect();
            } else {
              this.showError("Access Denied");
            }
          },
          error => {
            this.global.dismissLoading();
            let body = error.json();
            let errorBody;
            errorBody = body.message;
            if (error.status == 0) {
              errorBody = "Application not connected to internet";
            }
            this.showError(errorBody);
          });
      })
      .catch((error: any) => {
        this.global.dismissLoading();
        this.global.showErrorToast(error);
      });
  }

  test(data) {
    this.auth.login({
        "verification_code": data.code,
        "password": data.password,
        "imei": this.global.mockUUID()
      }
    ).subscribe(data => {
        this.global.dismissLoading();
        if (data !== '') {
          this.global.dismissLoading();
          this.checkRedirect();
        } else {
          this.showError("Access Denied");
        }
      },
      error => {
        this.global.dismissLoading();
        let body = error.json();
        console.log(body);
        let errorBody = body.message;
        this.showError(errorBody);
      });
  }

  public onSubmit(data) {
    this.global.showLoading();
    switch (this.global.environment) {
      case "production" : {
        this.live(data);
      }
        break;
      case "test" : {
        this.test(data);
      }
        break;
    }
  }

  onOnline() {
    // Handle the online event
    var networkState = this.network.type;
    if (networkState == "none") {
      this.global.showErrorToast("no network");
    }
  }

}
