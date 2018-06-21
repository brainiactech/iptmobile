import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {NotificationPage} from '../pages/notification/notification';
import {ProfilePage} from '../pages/profile/profile';
import {ReceivePage} from '../pages/receive/receive';
import {DispatchPage} from '../pages/dispatch/dispatch';
import {LogsPage} from '../pages/logs/logs';
import {SettingsPage} from '../pages/settings/settings';
import {SupportPage} from '../pages/support/support';
import {WelcomePage} from '../pages/welcome/welcome';
import {TerminalReceivePage} from "../pages/terminal-receive/terminal-receive";
import {TerminalReceiveConfirmPage} from "../pages/terminal-receive/terminal-receive-confirm";
import {DepotOutletPage} from "../pages/depot-outlet/depot-outlet";

import {SuccessPageDepotOutlet} from "../pages/depot-success/success";

import {TerminalDispatchPage} from "../pages/terminal-dispatch/terminal-dispatch";
import {MarketerPage} from "../pages/marketer/marketer";
import {SetprofilePage} from '../pages/setprofile/setprofile';
import {LogoutPage} from '../pages/logout/logout';
import {ChangepasswordPage} from '../pages/password/changepassword/changepassword';
import {MotherVesselReceivePage} from '../pages/mother-vessel-receive/mother-vessel-receive';
import {DepotReceivePage} from '../pages/depot-receive/depot-receive';
import {OutletPage} from '../pages/outlet/outlet';
import {MarketerRequestPage} from "../pages/marketer-request/marketer-request";
import {OutletReceiveListPage} from "../pages/outlet-receive-list/outlet-receive-list";
import {DaughterVesselReceivedPage} from '../pages/daughter-vessel-received/daughter-vessel-received';
import {Network} from "@ionic-native/network";
import {Globals} from "../config/global";
import {DaughterVesselHomePage} from "../pages/daughter-vessel-home/daughter-vessel-home";
import {DepotVesselHomePage} from "../pages/depot-vessel-home/depot-vessel-home";
import {MotherVesselHomePage} from "../pages/mother-vessel-home/mother-vessel-home";
import {Storage} from "@ionic/storage";
import { DepotOutletPageModule } from '../pages/depot-outlet/depot-outlet.module';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = MotherVesselHomePage;
  //rootPage: any = OutletReceivedFinalPage; DaughterVesselDispatchPage
  rootPage: any = WelcomePage;


  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public global: Globals,
              public storage: Storage,
              public platform: Platform, public network: Network,
              statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      

      // OneSignal Code start:
      // Enable to debug issues:
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


      if (this.global.environment == "production") {
        var notificationOpenedCallback = function (jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };


        window["plugins"].OneSignal
          .startInit("f30c847a-5ee3-4754-aa32-ced58ec89e68", "265180922876")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }

    });


    this.storage.get('user').then(user => {
      let datas = user;
      let pages;
      switch (datas.roles[0].name) {
        case "terminal-auditor" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: HomePage, icon: 'home'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;

        case "outlet-manager" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: OutletPage, icon: 'home'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;


        case "outlet-admin" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: MarketerPage, icon: 'home'},
            {title: 'Marketer Request', component: MarketerRequestPage, icon: 'star'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;


        case "mother-vessel-auditor" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: MotherVesselHomePage, icon: 'home'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;


        case "daughter-vessel-auditor" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: DaughterVesselHomePage, icon: 'home'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;

        case "depot-auditor" : {
          // used for an example of ngFor and navigationzz
          this.pages = [
            {title: 'Home', component: DepotVesselHomePage, icon: 'home'},
            {title: 'Notifications', component: NotificationPage, icon: 'notifications'},
            {title: 'Profile', component: ProfilePage, icon: 'contact'},
            {title: 'Logs', component: LogsPage, icon: 'clipboard'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'},
            {title: 'Logout', component: LogoutPage, icon: 'exit'},
            {title: 'Support', component: SupportPage, icon: 'help-circle'},
            {title: 'Change Password', component: ChangepasswordPage, icon: 'lock'},

          ];
        }
          break;
      }
      return Promise.resolve(this.pages);
    }).catch(error => {

    });


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
      

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
