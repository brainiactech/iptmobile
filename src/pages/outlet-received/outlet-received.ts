import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";

import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {OutletReceiveListPage} from "../outlet-receive-list/outlet-receive-list";
import {OutletReceivedFinalPage} from "./outlet-received-final";

/**
 * Generated class for the OutletReceivedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-outlet-received',
  templateUrl: 'outlet-received.html',
})
export class OutletReceivedPage {
  data = this.navParams.get('data');
  private UUID: any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, private uniqueDeviceID: UniqueDeviceID) {


  }

  reject() {
    this.navCtrl.push(OutletReceiveListPage);
  }

  confirmReceive(data) {
    this.navCtrl.push(OutletReceivedFinalPage, {data: this.data});
  }

  ionViewDidLoad() {

  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
