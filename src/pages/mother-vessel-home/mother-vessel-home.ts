import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MotherVesselDispatchPage } from '../mother-vessel-dispatch/mother-vessel-dispatch';
import {MotherVesselReceivePage} from '../mother-vessel-receive/mother-vessel-receive';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Storage} from '@ionic/storage';
/**
 * Generated class for the MotherVesselHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-vessel-home',
  templateUrl: 'mother-vessel-home.html',
})
export class MotherVesselHomePage {

  constructor(public navCtrl: NavController,
    public storage: Storage,
    public authHttp: AuthHttp
) {

}
gotoReceive() {
this.navCtrl.push(MotherVesselReceivePage);
}

gotoDispatch() {
this.navCtrl.push(MotherVesselDispatchPage);
}

ionViewCanEnter() {
return this.storage.get('token').then(token => {
return tokenNotExpired(null, token);
});
}

}
