import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {Globals} from "../../config/global";
import {AuthHttp} from "angular2-jwt";
import {Network} from "@ionic-native/network";
import {AlertController} from "ionic-angular";
import {Observable} from "rxjs/Observable";



@Injectable()
export class GeneralServiceProvider {

  terminalList = [];

  constructor(public http: Http,  public authHttp: AuthHttp,public global: Globals, public network: Network,
              private alertCtrl: AlertController) {

  }




  public parseData(res) {
    let datas = JSON.parse(res.text());
    let datum = this.global.jsonToArray(datas.data);
    return datum;
  }

  public showError(text) {
    this.global.dismissLoading();
    if (text == "" || this.network.type == "none") {
      text = "Check your internet connection";
    }
    let alert = this.alertCtrl.create({
      title: 'Whoops!',
      subTitle: text, //"Incorrect username or password ",
      buttons: ['OK']
    });
    alert.present();
  }

  public handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }




  private extractDatas(res: Response) {
    let body = res.text();
    //console.log(body);
    return body || {};
  }




}
