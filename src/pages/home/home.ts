import {Component} from '@angular/core';
import {TerminalReceivePage} from "../terminal-receive/terminal-receive";
import {TerminalDispatchPage} from "../terminal-dispatch/terminal-dispatch";
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {Storage} from '@ionic/storage';
import {Globals} from '../../config/global';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Network} from '@ionic-native/network';
import {AlertController, IonicPage, NavParams, App} from 'ionic-angular';
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {NavController, Alert, Platform} from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private details: any;

  constructor(
              public getFunction: GeneralServiceProvider,
              public navCtrl: NavController,
              public navParams: NavParams, public global: Globals,
              public network: Network, public authHttp: AuthHttp, public storage: Storage) {

  }

  gotoReceive() {
    this.navCtrl.push(TerminalReceivePage);
  }

  pushPages(page) {
    this.navCtrl.setRoot(page);
  }



  gotoDispatch() {
    this.navCtrl.push(TerminalDispatchPage);
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }
}
