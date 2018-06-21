import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public profile;
  public email;
  public rolesName;
  public roleDisplayName;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, 
    public authHttp: AuthHttp,  public global: Globals, 
    public getFunction: GeneralServiceProvider) {

  }



  getTheUserProfile() {
   // this.loading();
   this.global.showLoading();
   console.log('getting user...');
    
    this.authHttp.get(this.global.public_url + 'get-details')
      .subscribe( 

        data2 => { 
          let data = data2.json();
            
            console.log('successfully gotten user profile '); 
            console.log(JSON.stringify(data,null, 4)); 
            console.log(data.data.profile[0]['first_name']);
            console.log(data.data.user['email']);
            
            this.profile = data.data.profile[0];
            this.email = data.data.user['email'];
            this.rolesName = data.data.roles[0]['name'];
            this.roleDisplayName = data.data.roles[0]['display_name'];
            this.global.dismissLoading();
            
        },
        err => {
            this.global.dismissLoading();
            console.log("Oops! Error getting user profile",err);
        }



      );
  } 

  ionViewDidLoad() {
    this.getTheUserProfile();
    console.log('ionViewDidLoad ProfilePage');

  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
