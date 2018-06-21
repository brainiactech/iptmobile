import {OnInit} from '@angular/core';

import {IonicPage, Platform, ToastController} from 'ionic-angular';
import {Component} from '@angular/core';
import {App, NavController, AlertController, Loading, ViewController} from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import {Network} from "@ionic-native/network";
import { Subscription} from 'rxjs/Subscription';

declare var navigator: any;
declare var Connection: any;

@IonicPage() @Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage implements OnInit {

  public signupPage = SignupPage;
  connected: Subscription;
  disconnected: Subscription;

  constructor(public viewCtrl: ViewController,
              public nav: NavController,
              private network: Network,
              private toast: ToastController) {
  }

  displayNetworkUpdate(connectionState: string) {
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }
  ngOnInit(){
    console.log('on ngOnChanges ');
  }

}
