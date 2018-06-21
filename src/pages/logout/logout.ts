import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Globals } from '../../config/global';
import { SignupPage } from '../signup/signup';


@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthServiceProvider,
              public global: Globals,
            )
            { this.logout();
  }

  logout() {
    this.auth.logout().subscribe(succ => {
      this.global.showErrorToast('You are log out');
      this.navCtrl.setRoot(SignupPage)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
