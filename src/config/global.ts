import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Loading, LoadingController, ToastController, AlertController, NavController, App} from "ionic-angular";
import {DepotVesselHomePage} from '../pages/depot-vessel-home/depot-vessel-home';
import {HomePage} from '../pages/home/home';
import {DaughterVesselHomePage} from '../pages/daughter-vessel-home/daughter-vessel-home';
import {MotherVesselHomePage} from '../pages/mother-vessel-home/mother-vessel-home';
import {MarketerPage} from '../pages/marketer/marketer';
import {OutletPage} from '../pages/outlet/outlet';
import {AuthHttp} from 'angular2-jwt';
import {GeneralServiceProvider} from '../providers/general-service/general-service';
import {ViewChild} from "angular2/core";


@Injectable()
export class Globals {
  loading: Loading;
  errorMessage: String;


  constructor(public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController) {

  }


  //url: string = "http://api.ipt.ikooba.com/api";
  // url: string = "http://127.0.0.1:8000/api";
  url: string = "http://localhost/ikooba/api/public/api";
  public_url: string = this.url + "/";
  public details;

  /**
   *
   * @type {string} either value 'production' or 'test'
   */
  environment: string = "test";

  mockUUID() {
    return "123WE1092883883";
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        spinner: 'ios'
      });
      this.loading.present();
    }
  }

  jsonToArray(data) {
    var json_data = data;
    var result = [];
    for (var i in json_data)
      result.push([i, json_data [i]]);

    return result;
  }


  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  setError(message) {
    this.errorMessage = message;
  }

  getError() {
    return this.errorMessage;
  }

  validateDateModel(data) {

    if (data.begins.length === 0) {
      this.setError("Invalid date");
      return false;
    }
    if (data.ends.length === 0) {
      this.setError("Invalid date");
      return false;
    }

    return true;
  }

  showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  showErrorPop(text) {
    this.dismissLoading();
    let alert = this.alertCtrl.create({
      title: 'Whoops!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showMessageSuccess(text) {
    this.dismissLoading();
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  handleMessage(data) {
    var parsedData = JSON.parse(data);
    if (parsedData.message) {
      this.showErrorToast(parsedData.message);
    }

  }


}
