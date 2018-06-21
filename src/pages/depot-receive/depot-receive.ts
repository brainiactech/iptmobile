import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {GeneralServiceProvider} from '../../providers/general-service/general-service';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {Globals} from '../../config/global';
import {Response} from '@angular/http';
import { DepotReceiveConfirmPage } from './depot-receive-confirm';


@IonicPage()
@Component({
  selector: 'page-depot-receive',
  templateUrl: 'depot-receive.html',
})
export class DepotReceivePage {

  private products: any;
  private depots: any;
  private terminals: any;
  private data: FormGroup;

  private terminalBool: boolean;
  private productBool: boolean;
  private depotBool: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals,
              private alertCtrl: AlertController,
              public storage: Storage,) {

    this.loading();
    this.getTerminals();
    this.getProducts();
    this.getDepots();

    this.data = this.formBuilder.group({
      product_type_id: ['', [Validators.required]],
      // terminal_name:['',[Validators.required]],
      terminal_id: ['', Validators.required],
      depot_id: ['', Validators.required],
      loading_date: ['', Validators.required],
      driver_name: [''],
      driver_no: [''],
      meter_ticket_no: ['', Validators.required],
      product_qty: ['', Validators.required],
      waybill_no: ['', Validators.required],
      waybill_qty: ['', Validators.required],
      date_of_arrival: ['', Validators.required],
      acquila_code: ['', Validators.required],
      truck_no: ['', Validators.required],
    });
  }

  // submitForm() {
  //   console.log(this.data.value)
  //   let data = this.data.value;
  //   this.authHttp.post(this.global.public_url + 'depot_receiveds', data)
  //     .map((res: Response) => res.json())
  //     .subscribe(data => {
  //         this.presentPrompt(data.message);
  //       },
  //       error => {
  //         if (error.status !== 200) {
  //           var data = error._body;
  //           this.global.handleMessage(data);
  //         }
  //       });
  // }

  loading() {
    this.global.showLoading();
    if (this.productBool && this.terminalBool) {
      this.global.dismissLoading();
    }
  }

  getTerminals() {
    this.loading()
    this.terminalBool = false;
    this.authHttp.get(this.global.public_url + 'terminals')
      .subscribe(res => {
        this.terminals = this.getFunction.parseData(res);
        this.terminalBool = true;
        this.loading()
      });
  }

  getDepots() {
    this.loading()
    this.depotBool = false;
    this.authHttp.get(this.global.public_url + 'depots')
      .subscribe(res => {
        this.depots = this.getFunction.parseData(res);
        this.depotBool = true;
        this.loading()
      });
  }

  getProducts() {
    this.loading()
    this.productBool = false;
    this.authHttp.get(this.global.public_url + 'types/category/1')
      .subscribe(res => {
        this.products = this.getFunction.parseData(res);
        this.productBool = true;
        this.loading()
      });
  }

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

  presentationModal() {
    let data = this.data.value;

    let terminalFilter = this.terminals.filter(p => p[1].id == data.terminal_id);
    let productTypeFilter = this.products.filter(p => p[1].id == data.product_type_id);

    if(data.depot_id){
      let depotFilter = this.depots.filter(p => p[1].id == data.depot_id);
      data.depot = depotFilter[0][1].name;
    }

    data.terminal = terminalFilter[0][1].name;
    data.productType = productTypeFilter[0][1].name;
    console.log(data);
    let presentModal = this.modalCtrl.create(DepotReceiveConfirmPage, data);
    presentModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
    });
    presentModal.present();
  }

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DepotReceivePage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
