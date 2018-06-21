import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';
import {TerminalReceiveConfirmPage} from "../terminal-receive/terminal-receive-confirm";
import {DepotOutletConfirmPage} from "./depot-outlet-confirm";


@IonicPage()
@Component({
  selector: 'page-depot-outlet',
  templateUrl: 'depot-outlet.html',
})
export class DepotOutletPage {

  private depot_id: any;
  private retail_outlet_id: any;
  private type_id: any;
  private data: FormGroup;
  private depotBool: boolean;
  private outletBool: boolean;
  private productBool: boolean;
  private depotTotalReceived:any;
  private depotTotalDispatches:any;
  private lastQuantityReceived:any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals, private alertCtrl: AlertController) {

    this.loading();
    this.getDepot();
    this.getRetailOutlet();
    this.getProduct();

    this.data = this.formBuilder.group({
      retail_outlet_id: ['', [Validators.required]],
      depot_id: ['', Validators.required],
      type_id: ['', Validators.required],
      loading_date: ['', Validators.required],
      transporter_name: [''],
      truck_number: ['', Validators.required],
      meter_ticket_number: ['', Validators.required],
      product_qty: ['', Validators.required],
      waybill_no: ['', Validators.required],
      waybill_qty: ['', Validators.required],
      date_of_arrival: ['', Validators.required],
      driver_name: [''],
      driver_number: [''],
    });

    this.depotTotalReceived = "0.00";
    this.depotTotalDispatches = "0.00";
    this.lastQuantityReceived = "0.00";

  }

  loading() {
    this.global.showLoading();
    if (this.depotBool && this.outletBool && this.productBool) {
      this.global.dismissLoading();
    }
  }

  getProduct() {
    this.loading()
    this.productBool = false;
    this.authHttp.get(this.global.public_url + 'types/category/1')
      .subscribe(res => {
        this.type_id = this.getFunction.parseData(res);
        this.productBool = true;
        this.loading()
      });

  }

  onChange(CValue, DValue) {

    if(CValue != "" && DValue !=""){
      this.getDashboardMetrics(CValue, DValue);
    }
  }

  onChange2(CValue, DValue) {
    console.log(CValue);
    console.log(CValue);

    if(CValue != "" && DValue !=""){
      this.getDashboardMetrics(CValue, DValue);
    }
  }

  getDashboardMetrics(depot_id, type_id ) {
    this.loading()
    this.depotBool = false;
    this.authHttp.get(this.global.public_url + 'depot_metrics?depot_id='+depot_id+"&type_id="+type_id)
      .subscribe(res => {
        let datas = JSON.parse(res.text());
        this.depotTotalReceived = datas.data.depotTotalReceived//.toLocaleString();
        this.depotTotalDispatches = datas.data.depotTotalDispatches//.toLocaleString();
        this.lastQuantityReceived = datas.data.lastQuantityReceived//.toLocaleString();

        console.log(datas.data);
        this.depotBool = true;
        this.loading()
      });

  }

  getDepot() {
    this.loading()
    this.depotBool = false;
    this.authHttp.get(this.global.public_url + 'depots')
      .subscribe(res => {
        this.depot_id = this.getFunction.parseData(res);
        this.depotBool = true;
        this.loading()
      });

  }


  getRetailOutlet() {
    this.loading()
    this.outletBool = false;
    this.authHttp.get(this.global.public_url + 'retail_outlets')
      .subscribe(res => {
        this.retail_outlet_id = this.getFunction.parseData(res);
        console.log(this.retail_outlet_id);
        this.outletBool = true;
        this.loading()
      });

  }

  presentProfileModal() {
    let data = this.data.value;
    console.log(data)
    let retailOutletFilter = this.retail_outlet_id.filter(p => p[1].id == data.retail_outlet_id);
    let depotFilter = this.depot_id.filter(p => p[1].id == data.depot_id);
    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
    data.retail_outlet_name = retailOutletFilter[0][1].name;
    data.depot_name = depotFilter[0][1].name;
    data.product = typeFilter[0][1].name;


    let profileModal = this.modalCtrl.create(DepotOutletConfirmPage, {"data": data});
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
    });
    profileModal.present();
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
