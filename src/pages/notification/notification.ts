import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {NotificationAllPage } from '../notification-all/notification-all';
import {NotificationReadPage } from '../notification-read/notification-read';
import {NotificationUnreadPage } from '../notification-unread/notification-unread';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  tab1All = NotificationAllPage;
  tab2Read = NotificationReadPage;
  tab3Unread = NotificationUnreadPage;

  constructor(public storage: Storage,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
