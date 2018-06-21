import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Globals} from "../../config/global";
import {AuthHttp} from "angular2-jwt";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarketerRequestConfirmPage} from "./marketer-request-confirm";
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
/**
 * Generated class for the MarketerRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-marketer-request',
  templateUrl: 'marketer-request.html',
})
export class MarketerRequestPage {
  private type_id: any;
  private productBool: boolean;
  private data: FormGroup;
  private outlets: any;
  private retail_outlet_id: any;
  private product_id: any;
  private outletBool: boolean;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals, private alertCtrl: AlertController) {
    this.loading();
    this.getProduct();
    this.getOutlets();


    this.data = this.formBuilder.group({
      type_id: ['', Validators.required],
      retail_outlet_id: ['', Validators.required],
      product_vol: [''],
    });

  }


  getProduct() {
    this.loading();
    this.productBool = false;
    this.authHttp.get(this.global.public_url + 'types/category/1')
        .subscribe(res => {
          console.log(res);
          this.type_id = this.getFunction.parseData(res);
          this.productBool = true;
          this.loading()
        });

  }


  loading() {
    this.global.showLoading();
    if (this.productBool) {
      this.global.dismissLoading();
    }
  }


  getOutlets() {
    this.outletBool = false;
    this.loading();
    this.authHttp.get(this.global.public_url + 'retail_outlets')
        .subscribe(res => {
          this.outlets = this.getFunction.parseData(res);
          console.log(this.outlets);
          this.outletBool = true;
          this.loading()
        });

  }



    presentProfileModal() {
        let data = this.data.value;

        if(data.retail_outlet_id){
            let typeFilter = this.outlets.filter(p => p[1].id == data.retail_outlet_id);
            data.retail = typeFilter[0][1].name;
        }


        let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
        data.product = typeFilter[0][1].name;


        let profileModal = this.modalCtrl.create(MarketerRequestConfirmPage, data);
        profileModal.onDidDismiss(data => {
            console.log(data);
        });
        profileModal.present();
    }

    ionViewCanEnter() {
      return this.storage.get('token').then(token => {
        return tokenNotExpired(null, token);
      });
    }
}
