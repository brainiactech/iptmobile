import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../config/global";
import {AuthHttp, tokenNotExpired} from "angular2-jwt";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {DaughterVesselDispatchConfirm} from "./daughter-vessel-dispatch-confirm";
import {Storage} from "@ionic/storage";


/**
 * Generated class for the DaughterVesselReceivedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daughter-vessel-dispatch',
  templateUrl: 'daughter-vessel-dispatch.html',
})
export class DaughterVesselDispatchPage {
  private type_id: any;
  private daughter_vessel_id: any;
  private dispatch_type_id: any;
  private data: FormGroup;
  private productBool: boolean;
  private dVesselBool: boolean;
  private dispatchBool: boolean;
  private terminalBool: boolean;
  private terminal_id: any;
  private depot_id: any;
  private toggleDispatch: boolean;
  private dVesselCreated: any;
  private bill_of_laden_no: any;
  private status_id: any;

  private expectedQuantity: any;
  private daughterVesselTotalReceived: any;
  private daughterVesselTotalDispatches: any;
  

  constructor(public storage: Storage, public modalCtrl: ModalController,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals,
              public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder, private alertCtrl: AlertController) {


    this.loading();
    this.getTerminal();
    this.getProduct();
    this.getDaughterVessel();
    this.getDispatchTypes();


    this.data = this.formBuilder.group({
      qty_dispatched: ['', [Validators.required]],
      bill_of_laden_qty: ['', Validators.required],
      bill_of_laden_no: ['', Validators.required],
      bill_of_laden_date: ['', Validators.required],
      dispatch_date: ['', Validators.required],
      daughter_vessel_id: ['', Validators.required],
      //dispatch_type_id: ['', Validators.required],
      type_id: ['', Validators.required],
      // depot_id: [''],
      terminal_id: [''],
      status_id: ['']
    });

    this.expectedQuantity = "0.00";
    this.daughterVesselTotalReceived = "0.00";
    this.daughterVesselTotalDispatches = "0.00";
  }

  onChange2(DValue, PValue) {
    this.getDashboardMetrics(DValue, PValue);
  }

  onChangeProduct(DValue, PValue) {
    this.getDashboardMetrics(DValue, PValue);
  }


  getDashboardMetrics(daughter_id, type_id) {
    if (daughter_id != "" && type_id != "") {
      this.loading()
      this.dVesselBool = false;
      this.authHttp.get(this.global.public_url + 'daughter_vessel_metrics?daughter_id='+daughter_id+"&type_id="+type_id)
        .subscribe(res => {
          let datas = JSON.parse(res.text());
          console.log(datas);
          this.expectedQuantity = datas.data.expectedQuantity.toLocaleString();
          this.daughterVesselTotalReceived = datas.data.daughterVesselTotalReceived//.toLocaleString();
          this.daughterVesselTotalDispatches = datas.data.daughterVesselTotalDispatches//.toLocaleString();
          console.log(datas.data);
          this.dVesselBool = true;
          this.loading();
        },
        err => {
          console.log("Error getting metrics",err);
          this.global.showErrorToast('Error getting metrics '); 
          this.global.dismissLoading();
      }
  
      );
    }    
  }

  getDispatchTypes() {
    this.dispatchBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'dispatch_types')
      .subscribe(res => {
        this.dispatch_type_id = this.getFunction.parseData(res);
        this.dispatchBool = true;
        this.loading()
      },
      err => {
        console.log("Error getting dispatches",err);
        this.global.showErrorToast('Error getting dispatches'); 
        this.global.dismissLoading();
    }

    );
  }

  getDepot() {
    this.global.showLoading();
    this.authHttp.get(this.global.public_url + 'depots')
      .subscribe(res => {
        this.depot_id = this.getFunction.parseData(res);
        this.global.dismissLoading();
      },
      err => {
        console.log("Error getting depot",err);
        this.global.showErrorToast('Error getting depot'); 
        this.global.dismissLoading();
    }
);

  }

  getTerminal() {
    this.terminalBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'terminals')
      .subscribe(res => {
        this.terminal_id = this.getFunction.parseData(res);
        this.terminalBool = true;
        this.loading()
      },
      err => {
        console.log("Error getting terminal",err);
        this.global.showErrorToast('Error getting terminal'); 
        this.global.dismissLoading();
    }
);

  }

  onChange(data) {
    let dispatchTypeFilter = this.dispatch_type_id.filter(p => p[1].id == data);
    let dispatch = dispatchTypeFilter[0][1].name;

    if (dispatch == "Depot") {
      this.toggleDispatch = true;
      this.getDepot();
    } else {
      this.toggleDispatch = false;
      this.getTerminal();
    }

  }
  

  validateInput(value) {
    if (value === '' || value.length < 2) {
      return {
        isValid: false,
      };
    }
    else {
      return {
        isValid: true,
      }
    }
  }


  /** handles create-daughter-vessel alert */
  presentDaughterVesselCreate() {
    console.log('about to create daughter vessel');
    let alert = this.alertCtrl.create({
      title: 'Create Daughter Vessel',
      inputs: [
        {
          name: 'name',
          placeholder: 'vessel name'
        },
        {
          name: 'vessel_no',
          placeholder: 'IMO (7 digits)'
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

          handler: (data) => {
            if (!this.validateInput(data['name']).isValid) {
              console.log('vessel name is not valid');
              this.global.showErrorToast('vessel name is required');
            }
            if (!this.validateInput(data['vessel_no']).isValid) {
              console.log('vessel number is not valid');
              this.global.showErrorToast('vessel number is required');
            }

            if (this.validateInput(data['name']).isValid
              && this.validateInput(data['vessel_no']).isValid) {
              console.log('this is valid... creating ...');
              this.createDaughterVessel(data);
            }
          },


          /*
          handler: data => {
            console.log('creating...');
            console.log(data);
            this.createDaughterVessel(data);
          }
          */
        }
      ]
    });
    alert.present();
  }

  /* daughter vessel create */
  public createDaughterVessel(name) {
    this.loading();
    this.dVesselCreated = null;
    console.log('name: ');
    console.log(name);
    return this.authHttp.post(this.global.public_url + 'daughter_vessels', name)
      .subscribe(
        data2 => {
          let data = data2.json();
          this.dVesselCreated = data.data;
          console.log('successfully created! ');
          this.global.showErrorToast('Daughter vessel map created');
          this.getDaughterVessel(); //to repopulate the daughter vessels
        },
        err => {
          this.global.showErrorToast("Oops! Error creating daughter vessel");
          console.log("Oops! Error creating daughter vessel", err);
          this.global.dismissLoading();
        }
      );
  }


  getDaughterVessel() {
    this.loading();
    this.dVesselBool = false;
    this.authHttp.get(this.global.public_url + 'daughter_vessels')
      .subscribe(res => {
        this.daughter_vessel_id = this.getFunction.parseData(res);
        this.dVesselBool = true;
        this.loading()
      },
      err => {
        console.log("Error getting daughter vessel",err);
        this.global.showErrorToast('Error getting daughter vessel'); 
        this.global.dismissLoading();
    }
);
  }

  getProduct() {
    this.loading();
    this.productBool = false;
    this.authHttp.get(this.global.public_url + 'types/category/1')
      .subscribe(res => {
        this.type_id = this.getFunction.parseData(res);
        this.productBool = true;
        this.loading()
      },
      err => {
        console.log("Error getting product",err);
        this.global.showErrorToast('Error getting product'); 
        this.global.dismissLoading();
    }
);

  }

  loading() {
    this.global.showLoading();
    if (this.productBool && this.dVesselBool && this.dispatchBool && this.terminalBool) {
      this.global.dismissLoading();
    }
  }

  ionViewDidLoad() {

  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

  presentProfileModal() {
    let data = this.data.value;
    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
    let daughterVesselFilter = this.daughter_vessel_id.filter(p => p[1].id == data.daughter_vessel_id);
    //let dispatchTypeFilter = this.dispatch_type_id.filter(p => p[1].id == data.dispatch_type_id);

    if (data.terminal_id) {
      let typeFilter = this.terminal_id.filter(p => p[1].id == data.terminal_id);
      data.terminal = typeFilter[0][1].name;
    }

    if (data.depot_id) {
      let depotFilter = this.depot_id.filter(p => p[1].id == data.depot_id);
      data.depot = depotFilter[0][1].name;
    }

    //data.dispatch = dispatchTypeFilter[0][1].name;
    data.product = typeFilter[0][1].name;
    data.daughterVessel = daughterVesselFilter[0][1].name;
    data.expectedQuantity = this.expectedQuantity;
    data.daughterVesselTotalReceived = this.daughterVesselTotalReceived;
    data.daughterVesselTotalDispatches = this.daughterVesselTotalDispatches;

    let profileModal = this.modalCtrl.create(DaughterVesselDispatchConfirm, {"data": data});
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
      //console.log(data);
    });
    profileModal.present();
  }

}
