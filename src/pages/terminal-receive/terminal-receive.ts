import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {TerminalReceiveConfirmPage} from "./terminal-receive-confirm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {AuthHttp} from "angular2-jwt";
import {Globals} from "../../config/global";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Response} from '@angular/http';
import {DatePipe} from '@angular/common';
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from 'angular2-jwt';

/**
 * Generated class for the TerminalReceivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terminal-receive',
  templateUrl: 'terminal-receive.html',
})
export class TerminalReceivePage {

  private terminal_id: any;
  private type_id: any;
  private data: FormGroup;
  private terminalBool: boolean;
  private productBool: boolean;
  private terminalTotalReceived: any;
  private terminalTotalDispatches: any;
  private dVesselBool: boolean;
  private daughter_vessel_id: any;
  private dVesselCreated: any;


  constructor(public storage: Storage,
              public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals, private alertCtrl: AlertController) {

    this.loading();
    this.getTerminal();
    this.getProduct();
    this.getDaughterVessel();

    this.data = this.formBuilder.group({
      daughter_vessel_id: ['', [Validators.required]],
      terminal_id: ['', Validators.required],
      bill_date: ['', Validators.required],
      qty_dispatch: ['', Validators.required],
      bill_of_laden_no: ['', Validators.required],
      type_id: ['', Validators.required]
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

  loading() {
    this.global.showLoading();
    if (this.productBool && this.terminalBool && this.dVesselBool) {
      this.global.dismissLoading();
    }
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

  getDaughterVessel() {
    this.loading();
    this.dVesselBool = false;
    this.authHttp.get(this.global.public_url + 'daughter_vessels')
      .subscribe(res => {
        this.daughter_vessel_id = this.getFunction.parseData(res);
        this.dVesselBool = true;
        this.loading()
      });
  }

  /* daughter vessel create */
  public createDaughterVessel(name) {
    this.loading();
    this.dVesselCreated = null;
    return this.authHttp.post(this.global.public_url + 'daughter_vessels', name)
      .subscribe(
        data2 => {
          let data = data2.json();
          this.dVesselCreated = data.data;
          this.global.showErrorToast('Daughter vessel created');
          this.getDaughterVessel(); //to repopulate the daughter vessels
        },
        err => {
          this.global.showErrorToast("Oops! Error creating daughter vessel");
          console.log("Oops! Error creating daughter vessel", err);
        }
      );
  }

  /** handles create-daughter-vessel alert */
  presentDaughterVesselCreate() {
    let alert = this.alertCtrl.create({
      title: 'Create Daughter Vessel',
      inputs: [
        {
          name: 'name',
          placeholder: 'vessel name'
        },
        {
          name: 'vessel_no',
          placeholder: 'vessel number'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Create',
          handler: data => {
            this.createDaughterVessel(data);
          }
        }
      ]
    });
    alert.present();
  }

  onChange(CValue, DValue) {
    if(CValue != "" && DValue !=""){
        this.getDashboardMetrics(CValue, DValue);
    }
  }

  onChange2(CValue, DValue) {

    if(CValue != "" && DValue !=""){
      this.getDashboardMetrics(CValue, DValue);
    }
  }

  getDashboardMetrics(terminal_id, type_id) {
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
    let daughterVesselFilter = this.daughter_vessel_id.filter(p => p[1].id == data.daughter_vessel_id);
    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);

    data.terminal = terminalFilter[0][1].name;
    data.product = typeFilter[0][1].name;
    data.daughterVessel = daughterVesselFilter[0][1].name;

    let profileModal = this.modalCtrl.create(TerminalReceiveConfirmPage, data);
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
    });
    profileModal.present();
  }

  ionViewDidLoad() {

  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}



