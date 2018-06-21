import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {OutletDailyLogPage} from "../outlet-daily-log/outlet-daily-log";
import {OutletReceiveListPage} from "../outlet-receive-list/outlet-receive-list";
import {DepotVesselHomePage} from "../depot-vessel-home/depot-vessel-home";
import {MarketerPage} from "../marketer/marketer";
import {MotherVesselHomePage} from "../mother-vessel-home/mother-vessel-home";
import {DaughterVesselHomePage} from "../daughter-vessel-home/daughter-vessel-home";
import {HomePage} from "../home/home";
import {Storage} from "@ionic/storage";


/**
 * Generated class for the OutletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-outlet',
  templateUrl: 'outlet.html',
})
export class OutletPage {

  constructor(public navCtrl: NavController, public storage: Storage) {
      
  }

  test() {
    let res = this.storage.get('user').then(user => {
      let datas = user;
      let pages;
      switch (datas.roles[0].name) {
        case "terminal-auditor" : {
          pages = HomePage;
        }
          break;

        case "outlet-manager" : {
          pages = OutletPage;
        }
          break;


        case "outlet-admin" : {
          pages = MarketerPage;
        }
          break;


        case "mother-vessel-auditor" : {
          pages = MotherVesselHomePage;
        }
          break;


        case "daughter-vessel-auditor" : {
          pages = DaughterVesselHomePage;
        }
          break;

        case "depot-auditor" : {
          pages = (DepotVesselHomePage);
        }
          break;
      }
      return Promise.resolve(pages);
    }).catch(error => {

    });


    res.then(result => {
      console.log(result)
    })

  }

  gotoQuantityReceived() {
    this.navCtrl.push(OutletReceiveListPage);
  }

  gotoDailyLogs() {
    this.navCtrl.push(OutletDailyLogPage);
  }

  ionViewDidLoad() {
  }

}
