import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import {Globals} from "../../config/global";
import {DepotVesselHomePage} from "../../pages/depot-vessel-home/depot-vessel-home";
import {WelcomePage} from "../../pages/welcome/welcome";
import {MarketerPage} from "../../pages/marketer/marketer";
import {MotherVesselHomePage} from "../../pages/mother-vessel-home/mother-vessel-home";
import {SetprofilePage} from "../../pages/setprofile/setprofile";
import {HomePage} from "../../pages/home/home";
import {DaughterVesselHomePage} from "../../pages/daughter-vessel-home/daughter-vessel-home";
import {OutletPage} from "../../pages/outlet/outlet";

/*
 Generated class for the AuthServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class AuthObject {
  private _company: any;
  private _user: any;
  private _token: string;


  constructor() {
  }

  getcompany(): any {
    return this._company;
  }

  setcompany(value: any) {
    this._company = value;
  }

  getuser(): any {
    return this._user;
  }

  setuser(value: any) {
    this._user = value;
  }

  gettoken(): string {
    return this._token;
  }

  settoken(value: string) {
    this._token = value;
  }
}


@Injectable()
export class AuthServiceProvider {
  userToken = '';
  private _isValidToken: boolean;


  getValidToken(): boolean {
    return this._isValidToken;
  }

  setValidToken(value: boolean) {
    this._isValidToken = value;
  }

  constructor(public http: Http,
              public currentUser: AuthObject,
              public authHttp: AuthHttp, public storage: Storage,
              public global: Globals) {
  }

  // Login a user with email + password and store the JWT
  public login(credentials) {
    return this.http.post(this.global.public_url + 'login', credentials)
      .map(response => response.json())
      .map(data => {
        this.setCurrentUser(data.data.token);
        return data.data.token;
      });
  }

  // Store the token and current user information local
  private setCurrentUser(token) {
    this.userToken = token;
    this.currentUser = new AuthObject();

    this.currentUser.settoken(token);
    return this.storage.set('token', token);
  }

  public getUserInfo(): AuthObject {

    let auths = localStorage.getItem('AuthObject');
    return JSON.parse(auths);
    // return this.currentUser;
  }

  public getCompany() {
    let auths = localStorage.getItem('AuthObject');
    let parsed = JSON.parse(auths);
    return parsed.company;
    //return this.currentUser.getcompany();
  }

  public getUserEmail(): string {
    let auths = localStorage.getItem('AuthObject');
    let parsed = JSON.parse(auths);
    return parsed.user;
    //return this.currentUser.getuser();
  }

  public logout() {
    localStorage.setItem("AuthObject", JSON.stringify({}));
    return Observable.create(observer => {
      this.currentUser = null;
      this.deleteToken();
      observer.next(true);
      observer.complete();
    });
  }

  // Remove the JWT from our storage
  public deleteToken() {
    this.userToken = '';
    //this.storage.set('user', '');
    this.storage.get('user').then(user => {
      if (user.roles[0].name != "outlet-manager") {
        this.storage.set('user', '');
      }
    }).catch(error => {

    });


    return this.storage.set('token', '');

  }

  loggedIn() {
    this.storage.get('token').then((token: string) => {
      this.setValidToken(tokenNotExpired(null, token));
      console.log(this.getValidToken())
    });

  }

}
