
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AuthHttp, tokenNotExpired} from "angular2-jwt";
import {Storage} from "@ionic/storage";
import {Globals} from "../../config/global";
import {WelcomePage} from "../welcome/welcome";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {OutletReceivedPage} from "../outlet-received/outlet-received";


/**
 * Generated class for the OutletReceiveListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-outlet-receive-list',
  templateUrl: 'outlet-receive-list.html',
})
export class OutletReceiveListPage {
  private theReceived: boolean;
  private theUser: any;
  private theReceivedList: any;

  constructor(public navCtrl: NavController,
              public auth: AuthServiceProvider,
              public storage: Storage, public global: Globals,
              public authHttp: AuthHttp,
              public navParams: NavParams, public getFunction: GeneralServiceProvider) {
    this.getReceived();
  }

  gotoReceive(data) {
    this.navCtrl.push(OutletReceivedPage, {data: data});
  }

  getReceived() {
    this.loading();
    this.theReceived = false;
    this.storage.get('user').then(user => {
      this.theUser = user;
      console.log(user.outlet[0].id);
      this.authHttp.get(this.global.public_url + 'outlet_receives/sent/' + user.outlet[0].id)
        .subscribe(res => {
          this.theReceivedList = this.getFunction.parseData(res);
          console.log(this.theReceivedList);
          this.theReceived = true;
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

  loading() {
    this.global.showLoading();
    if (this.theReceived) {
      this.global.dismissLoading();
    }
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      if (!tokenNotExpired(null, token)) {
        this.navCtrl.setRoot(HomePage);
      }
    });

  }

}
