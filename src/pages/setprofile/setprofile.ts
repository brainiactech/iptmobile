import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';

import {Globals} from '../../config/global';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Response} from '@angular/http';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {OutletPage} from '../outlet/outlet';
import {MarketerPage} from '../marketer/marketer';
import {MotherVesselHomePage} from '../mother-vessel-home/mother-vessel-home';
import {DaughterVesselHomePage} from '../daughter-vessel-home/daughter-vessel-home';
import {DepotVesselHomePage} from '../depot-vessel-home/depot-vessel-home';
import {ViewChild} from "angular2/core";
import {WelcomePage} from "../welcome/welcome";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-setprofile',
  templateUrl: 'setprofile.html',
})

export class SetprofilePage {
  public homePage = HomePage;
  private data: FormGroup;
  private userDetails: any;
  private UUID: any;
  public details;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private auth: AuthServiceProvider,
              // public special: TheSpecialProvider,
              private formBuilder: FormBuilder,
              public storage: Storage,
              public global: Globals,
              public authHttp: AuthHttp, public getFunction: GeneralServiceProvider,
              private uniqueDeviceID: UniqueDeviceID) {

    this.getUser();
    this.data = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  getUser() {
    this.global.showLoading();
    this.authHttp.get(this.global.public_url + 'get-details')
      .subscribe(res => {
        let datas = JSON.parse(res.text());
        let datum = datas.data;
        this.userDetails = datum.profile[0];


        if (this.userDetails) {
          this.data.get('firstName').setValue(this.userDetails.first_name);
          this.data.get('lastName').setValue(this.userDetails.last_name);
          this.data.get('phone').setValue(this.userDetails.phone);
        }

        this.global.dismissLoading();
      });
  }


  submitForm() {

    var data = {
      last_name: this.data.value.lastName,
      first_name: this.data.value.firstName,
      phone: this.data.value.phone,
      password: this.data.value.password,
      confirm_password: this.data.value.confirmPassword,
    };

    this.global.showLoading();
    this.authHttp.post(this.global.public_url + 'set-profile', data)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.global.showErrorToast(data.message);
          this.beforeRedirect();
          this.global.dismissLoading();
        },
        error => {
          console.log(error);
          if (error.status !== 200) {
            var data = error._body;
            var parsedData = JSON.parse(data);
            this.global.showErrorToast(parsedData.message);
            this.global.dismissLoading();
          }
        });

  }

  linkDevice() {
    switch (this.global.environment) {
      case "production" : {
        this.live();
      }
        break;
      case "test" : {
        this.test();
      }
        break;
    }

  }

  test() {
    var data = {
      imei: this.global.mockUUID(),
    };
    this.authHttp.post(this.global.public_url + 'imei_mappings', data)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.afterRedirect();
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            var parsedData = JSON.parse(data);
            this.global.showErrorToast(parsedData.message);
          }
        });
  }

  live() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        var data = {
          imei: uuid,
        };

        this.authHttp.post(this.global.public_url + 'imei_mappings', data)
          .map((res: Response) => res.json())
          .subscribe(data => {
              this.afterRedirect();
            },
            error => {
              if (error.status !== 200) {
                var data = error._body;
                var parsedData = JSON.parse(data);
                this.global.showErrorToast(parsedData.message);
              }
            });
      })
      .catch((error: any) => {
        this.navCtrl.setRoot(HomePage);
      });
  }

  beforeRedirect() {
    this.linkDevice();

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
      this.global.showLoading();
      this.authHttp.get(this.global.public_url + 'get-details')
        .map((res: Response) => res.json())
        .subscribe(data => {
            this.storage.set('user', data.data)
            this.global.dismissLoading();
            this.validate();
          },
          error => {
          });

    });

  }

  afterRedirect() {
    this.validate();
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

  pushPages(page) {
    this.navCtrl.setRoot(page);
  }


}
