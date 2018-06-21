import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {NotificationPage} from '../pages/notification/notification';
import {ProfilePage} from '../pages/profile/profile';
import {ReceivePage} from '../pages/receive/receive';
import {DispatchPage} from '../pages/dispatch/dispatch';
import {LogsPage} from '../pages/logs/logs';
import {SettingsPage} from '../pages/settings/settings';
import {SupportPage} from '../pages/support/support';
import {LogoutPage} from '../pages/logout/logout';


import {TerminalReceivePage} from "../pages/terminal-receive/terminal-receive";
import {TerminalReceiveConfirmPage} from "../pages/terminal-receive/terminal-receive-confirm";
import {SuccessPage} from "../pages/terminal-success/success";
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {WelcomePage} from '../pages/welcome/welcome';
import {SignupPage} from '../pages/signup/signup';
import {SetprofilePage} from '../pages/setprofile/setprofile';
import {TerminalDispatchPage} from '../pages/terminal-dispatch/terminal-dispatch';
import {TerminalDispatchConfirmPage} from '../pages/terminal-dispatch/terminal-dispatch-confirm';
import {MarketerPage} from '../pages/marketer/marketer';
import {AuthObject, AuthServiceProvider} from "../providers/auth-service/auth-service";
import {Globals} from "../config/global";
import {Http, HttpModule} from "@angular/http";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {Storage, IonicStorageModule} from '@ionic/storage';
import {Network} from "@ionic-native/network";
import {GeneralServiceProvider} from "../providers/general-service/general-service";
import {DepotOutletPage} from "../pages/depot-outlet/depot-outlet";
import {DepotOutletConfirmPage} from "../pages/depot-outlet/depot-outlet-confirm";
import {SuccessPageDepotOutlet} from "../pages/depot-success/success";
import {NotificationAllPage} from "../pages/notification-all/notification-all";
import {NotificationReadPage} from "../pages/notification-read/notification-read";
import {NotificationUnreadPage} from "../pages/notification-unread/notification-unread";


import {ResetpasswordPage} from '../pages/password/resetpassword/resetpassword';
import {ChangepasswordPage} from '../pages/password/changepassword/changepassword';
import {VerifycodePage} from '../pages/password/verifycode/verifycode';
import {MotherVesselReceivePage} from '../pages/mother-vessel-receive/mother-vessel-receive';
import {MotherVesselReceiveConfirmPage} from '../pages/mother-vessel-receive/mother-vessel-receive-confirm';
import {DepotReceivePage} from '../pages/depot-receive/depot-receive';
import {OutletPage} from '../pages/outlet/outlet';
import {OutletDailyLogPage} from '../pages/outlet-daily-log/outlet-daily-log';
import {OutletReceivedPage} from '../pages/outlet-received/outlet-received';
import {OutletReceivedFinalPage} from '../pages/outlet-received/outlet-received-final';
import {MotherVesselSuccessPage} from "../pages/mother-vessel-success/success";
import {DaughterVesselReceivedPage} from "../pages/daughter-vessel-received/daughter-vessel-received";
import {DaughterVesselSuccessPage} from "../pages/daughter-vessel-success/success";
import {DaughterVesselReceiveConfirmPage} from "../pages/daughter-vessel-received/daughter-vessel-receive-confirm";
import { DepotReceiveConfirmPage } from '../pages/depot-receive/depot-receive-confirm';
import { MotherVesselDispatchPage } from '../pages/mother-vessel-dispatch/mother-vessel-dispatch';
import { MotherVesselConfirmDispatchPage } from '../pages/mother-vessel-confirm-dispatch/mother-vessel-confirm-dispatch';
import {DaughterVesselDispatchConfirm} from "../pages/daughter-vessel-dispatch/daughter-vessel-dispatch-confirm";
import {DaughterVesselDispatchPage} from "../pages/daughter-vessel-dispatch/daughter-vessel-dispatch";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {MarketerRequestPage} from "../pages/marketer-request/marketer-request";
import {MarketerRequestConfirmPage} from "../pages/marketer-request/marketer-request-confirm";
import {OutletReceiveListPage } from '../pages/outlet-receive-list/outlet-receive-list';
import{DaughterVesselHomePage} from '../pages/daughter-vessel-home/daughter-vessel-home';
import{DepotVesselHomePage} from'../pages/depot-vessel-home/depot-vessel-home';
import{MotherVesselHomePage} from '../pages/mother-vessel-home/mother-vessel-home';

export function getAuthHttp(http, storage) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }],
    tokenGetter: (() => storage.get('token').then((token: string) => token)),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    WelcomePage,
    SignupPage,
    SetprofilePage,
    NotificationPage,
    ProfilePage,
    ReceivePage,
    DispatchPage,
    LogsPage,
    SettingsPage,
    LogoutPage,
    SupportPage,
    TerminalReceivePage,
    TerminalReceiveConfirmPage,
    SuccessPage,
    ResetpasswordPage,
    ChangepasswordPage,
    TerminalDispatchPage,
    TerminalDispatchConfirmPage,
    MarketerPage,
    SuccessPageDepotOutlet,
    DepotOutletPage,
    DepotOutletConfirmPage,
    NotificationAllPage,
    NotificationReadPage,
    NotificationUnreadPage,
    VerifycodePage,
    MotherVesselReceivePage,
    MotherVesselReceiveConfirmPage,
    DepotReceivePage,
    OutletPage,
    OutletDailyLogPage,
    OutletReceivedPage,
    OutletReceivedFinalPage,
    MotherVesselSuccessPage,
    DaughterVesselReceivedPage,
    DaughterVesselSuccessPage,
    DaughterVesselReceiveConfirmPage,
    DepotReceiveConfirmPage,
    MotherVesselDispatchPage,
    MotherVesselConfirmDispatchPage,
    DaughterVesselDispatchConfirm,
    DaughterVesselDispatchPage,
      MarketerRequestPage,
      MarketerRequestConfirmPage,
      OutletReceiveListPage,
      DaughterVesselHomePage,
      DepotVesselHomePage,
      MotherVesselHomePage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SignupPage,
    SetprofilePage,
    NotificationPage,
    ProfilePage,
    ReceivePage,
    DispatchPage,
    LogsPage,
    SettingsPage,
    LogoutPage,
    SupportPage,
    WelcomePage,
    TerminalReceivePage,
    TerminalReceiveConfirmPage,
    SuccessPage,
    ResetpasswordPage,
    ChangepasswordPage,
    TerminalDispatchPage,
    TerminalDispatchConfirmPage,
    MarketerPage,
    SuccessPageDepotOutlet,
    DepotOutletPage,
    DepotOutletConfirmPage,
    NotificationAllPage,
    NotificationReadPage,
    NotificationUnreadPage,
    VerifycodePage,
    MotherVesselReceivePage,
    MotherVesselReceiveConfirmPage,
    DepotReceivePage,
    OutletPage,
    OutletDailyLogPage,
    OutletReceivedPage,
    OutletReceivedFinalPage,
    MotherVesselSuccessPage,
    DaughterVesselReceivedPage,
    DaughterVesselSuccessPage,
    DaughterVesselReceiveConfirmPage,
    DepotReceiveConfirmPage,
    MotherVesselDispatchPage,
    MotherVesselConfirmDispatchPage,
    DaughterVesselDispatchConfirm,
    DaughterVesselDispatchPage,
    MarketerRequestPage,
    MarketerRequestConfirmPage,
    OutletReceiveListPage,
    DaughterVesselHomePage,
    DepotVesselHomePage,
    MotherVesselHomePage
  ],
  providers: [
    UniqueDeviceID,
    StatusBar,
    SplashScreen,
    AuthServiceProvider,
    GeneralServiceProvider,
    Globals,
    AuthObject,
    Network,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, Storage]
    },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
