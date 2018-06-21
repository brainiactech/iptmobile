import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage} from '@ionic/storage';
import {DepotOutletPage} from "../depot-outlet/depot-outlet";
import {DepotReceivePage} from '../depot-receive/depot-receive';
/**
 * Generated class for the DepotVesselHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-depot-vessel-home',
  templateUrl: 'depot-vessel-home.html',
})
export class DepotVesselHomePage {

  constructor(public navCtrl: NavController,
    public storage: Storage,
    public authHttp: AuthHttp
) {

}

gotoReceive() {
this.navCtrl.push(DepotReceivePage);
}

gotoDispatch() {
this.navCtrl.push(DepotOutletPage);
}

ionViewCanEnter() {
return this.storage.get('token').then(token => {
return tokenNotExpired(null, token);
});
}

}
