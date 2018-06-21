import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { Globals } from '../../config/global';
import {Storage} from '@ionic/storage';
import { GeneralServiceProvider } from '../../providers/general-service/general-service';
import { FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-marketer',
  templateUrl: 'marketer.html',
})
export class MarketerPage {

  private outletBool: boolean;
  private retail_outlet_id: any;
  private data: FormGroup;
  public outletMPSBalanceRemaining: any;
  public outletTotalQTYReceived: any;
  public outletMPSCapacity: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authHttp: AuthHttp, 
              public global: Globals,
              public storage: Storage,
              public getFunction: GeneralServiceProvider,
              private formBuilder: FormBuilder,
              
            ) {

        this.loading();
        this.getRetailOutlet();
        this.outletMPSBalanceRemaining = '0000';
        this.outletTotalQTYReceived = '0000';
        this.outletMPSCapacity = '0000';

        this.data = this.formBuilder.group({
          retail_outlet_id: [''],
        });
    
  }

  loading() {
    this.global.showLoading();
    if (this.outletBool) {
      this.global.dismissLoading();
    }
  }

  onChange(CValue) {
   // console.log(CValue);
    this.getOutletData(CValue);
  }

  getRetailOutlet() {
    this.loading()
    this.outletBool = false;
    this.authHttp.get(this.global.public_url + 'marketer_outlets')
      .subscribe(res => {
        this.retail_outlet_id = this.getFunction.parseData(res);
       // console.log(this.retail_outlet_id);
        this.outletBool = true;
        this.loading()
      });
  }

  getOutletData(outletID) {
    this.loading()
    this.outletBool = false;
    this.authHttp.get(this.global.public_url + 'marketer_outlet_data/'+outletID)
      .subscribe(res => {  
        let datas = JSON.parse(res.text());
        this.outletMPSBalanceRemaining = datas.data.outletMPSBalanceRemaining.toLocaleString();
        this.outletTotalQTYReceived = datas.data.outletTotalQTYReceived.toLocaleString();
        this.outletMPSCapacity = datas.data.outletMPSCapacity.toLocaleString();
        console.log(datas.data);
        this.outletBool = true;
        this.loading()
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarketerPage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
