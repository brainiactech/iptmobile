import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage} from '@ionic/storage';
import {DaughterVesselReceivedPage} from "../daughter-vessel-received/daughter-vessel-received";
import {DaughterVesselDispatchPage} from "../daughter-vessel-dispatch/daughter-vessel-dispatch";
/**
 * Generated class for the DaughterVesselHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daughter-vessel-home',
  templateUrl: 'daughter-vessel-home.html',
})
export class DaughterVesselHomePage {

  constructor(public navCtrl: NavController,
    public storage: Storage,
    public authHttp: AuthHttp,public menuCtrl: MenuController
) {

}
gotoReceive() {
this.navCtrl.push(DaughterVesselReceivedPage);
}

gotoDispatch() {
this.navCtrl.push(DaughterVesselDispatchPage);
}

ionViewCanEnter() {
    return this.storage.get('token').then(token => {
    return tokenNotExpired(null, token);
    });
  }
}
