import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {TerminalDispatchConfirmPage} from './terminal-dispatch-confirm';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../config/global";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Response} from '@angular/http';
import {DatePipe} from '@angular/common';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';

@IonicPage()
@Component({
  selector: 'page-terminal-dispatch',
  templateUrl: 'terminal-dispatch.html',
})
export class TerminalDispatchPage {

  private dispatchType: any;
  private depot_id: any;
  private outlets: any;
  private terminal_id: any;
  private retail_outlet_id: any;
  private data: FormGroup;
  private dispatch: any;

  private isLoading: any;
  private terminalBool: boolean;
  private outletBool: boolean;
  private dispatchBool: boolean;
  private hideAquila: boolean;
  private depotBool: boolean;
  private terminalTotalReceived: any;
  private terminalTotalDispatches: any;
  private productBool: boolean;
  private type_id: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals,
              private alertCtrl: AlertController,
              public storage: Storage,) {


    this.loading();
    this.getTerminal();
    this.getOutlets();
    this.getProduct();
    this.getDispatchTypes();


    this.data = this.formBuilder.group({
      dispatch_type_id: ['', [Validators.required]],
      type_id: ['', [Validators.required]],
      terminal_id: ['', Validators.required],
      retail_outlet_id: [''],
      loading_date: ['', Validators.required],
      //marketing_company: ['', Validators.required],
      driver_name: ['', Validators.required],
      driver_no: ['', Validators.required],
      meter_ticket_no: ['', Validators.required],
      product_qty: ['', Validators.required],
      waybill_no: ['', Validators.required],
      est_date_of_arrival: ['', Validators.required],
      acquila_code: [''],
      truck_no: ['', Validators.required],
      depot_id: ['']
    });

    this.terminalTotalReceived = "0.00";
    this.terminalTotalDispatches = "0.00"
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


  onChange(data) {
    try{
        let dispatchTypeFilter = this.dispatch.filter(p => p[1].id == data);
        let dispatch = dispatchTypeFilter[0][1].name;

        if (dispatch == "Depot") {
          this.hideAquila = true;
          this.getDepot();
        } else {
          this.hideAquila = false;
        }
    }catch(err){

    }
  }

  onChange2(DValue, EValue) {
    if(DValue != "" && EValue !=""){
        this.getDashboardMetrics(DValue, EValue);
    }
  }

  onChange3(DValue, EValue) {
    if(DValue != "" && EValue !=""){
        this.getDashboardMetrics(DValue, EValue);
    }
  }


  getDashboardMetrics(terminal_id,type_id) {
    this.loading()
    this.terminalBool = false;
    this.authHttp.get(this.global.public_url + 'terminal_metrics?terminal_id='+terminal_id+'&type_id='+type_id)
      .subscribe(res => {
        let datas = JSON.parse(res.text());
        this.terminalTotalReceived = datas.data.terminalTotalReceived//.toLocaleString();
        this.terminalTotalDispatches = datas.data.terminalTotalDispatches//.toLocaleString();

        // console.log(datas.data);
        this.terminalBool = true;
        this.loading()
      });

  }

  loading() {
    this.global.showLoading();
    if (this.dispatchBool && this.terminalBool && this.outletBool && this.productBool) {
      this.global.dismissLoading();
    }
  }

  submitForm() {

    let data = this.data.value;
    this.authHttp.post(this.global.public_url + 'terminal_dispatches', data)
      .map((res: Response) => res.json())
      .subscribe(data => {
          this.presentPrompt(data.message);
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            this.global.handleMessage(data);
          }
        });
  }


  getDepot() {
    this.global.showLoading();
    this.authHttp.get(this.global.public_url + 'depots')
      .subscribe(res => {
        this.depot_id = this.getFunction.parseData(res);
        this.global.dismissLoading();
      });

  }

  getTerminal() {
    this.loading()
    this.terminalBool = false;
    this.authHttp.get(this.global.public_url + 'terminals')
      .subscribe(res => {
        this.terminal_id = this.getFunction.parseData(res);
        this.terminalBool = true;
        this.loading()
      });

  }

  getOutlets() {
    this.outletBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'retail_outlets')
      .subscribe(res => {
        this.outlets = this.getFunction.parseData(res);
        this.outletBool = true;
        this.loading()
      });

  }

  getDispatchTypes() {
    this.dispatchBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'dispatch_types')
      .subscribe(res => {
        this.dispatch = this.getFunction.parseData(res);
        this.dispatchBool = true;
        this.loading()
      });
  }

  // getProduct() {
  //     this.authHttp.get(this.global.public_url + 'types/category/1')
  //         .subscribe(res => {
  //             this.type_id = this.getFunction.parseData(res);
  //         });

  // }

  presentPrompt(message) {

    let alert = this.alertCtrl.create({
      title: 'Successful',
      subTitle: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.refreshPage();
          }
        },

      ],

    });
    alert.present();
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }


  presentProfileModal() {
    let data = this.data.value;

    let terminalFilter = this.terminal_id.filter(p => p[1].id == data.terminal_id);
    if (data.retail_outlet_id) {
      let typeFilter = this.outlets.filter(p => p[1].id == data.retail_outlet_id);
      data.retail = typeFilter[0][1].name;
    }

    if (data.depot_id) {
      let depotFilter = this.depot_id.filter(p => p[1].id == data.depot_id);
      data.depot = depotFilter[0][1].name;
    }

    let dispatchTypeFilter = this.dispatch.filter(p => p[1].id == data.dispatch_type_id);
    data.dispatch = dispatchTypeFilter[0][1].name;


    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
    data.product = typeFilter[0][1].name;

    data.terminal = terminalFilter[0][1].name;


    let profileModal = this.modalCtrl.create(TerminalDispatchConfirmPage, data);
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
    });
    profileModal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TerminalDispatchPage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
