import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../config/global";
import {AuthHttp} from "angular2-jwt";
import {Storage} from '@ionic/storage';
import {tokenNotExpired} from "angular2-jwt";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import {MotherVesselReceiveConfirmPage} from "../mother-vessel-receive/mother-vessel-receive-confirm";
import {DaughterVesselReceiveConfirmPage} from "./daughter-vessel-receive-confirm";

/**
 * Generated class for the DaughterVesselReceivedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-daughter-vessel-received',
  templateUrl: 'daughter-vessel-received.html',
})
export class DaughterVesselReceivedPage {
  private type_id: any;
  private mother_vessel_id: any;
  private data: FormGroup;
  private productBool: boolean;
  private mVesselBool: boolean;
  private mVesselCreated: any;
  private dVesselBool: boolean;
  private toggleLadenNumber: boolean;
  private daughter_vessel_id: any;
  private dVesselCreated: any;

  private expectedQuantity: any;
  private daughterVesselTotalReceived: any;
  private daughterVesselTotalDispatches: any;
  private motherVesselDispatches: any;
  private motherVesselDispatchId: any;

  constructor(public storage: Storage,
              public modalCtrl: ModalController,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp,
              public global: Globals,
              public navCtrl: NavController,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private formBuilder: FormBuilder) {

    this.loading();
    this.getProduct();
    this.getMotherVessel();
    this.getDaughterVessel();
    this.toggleLadenNumber = false;


    this.data = this.formBuilder.group({
      bill_of_laden_no: ['', [Validators.required]],
      daughter_vessel_id: ['', Validators.required],
      bill_of_laden_qty: ['', Validators.required],
      loading_date: ['', Validators.required],
      mother_vessel_id: ['', Validators.required],
      type_id: ['', Validators.required],
      status_id: ['']

    });

    this.expectedQuantity = "0.00";
    this.daughterVesselTotalReceived = "0.00";
    this.daughterVesselTotalDispatches = "0.00";

  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

  onChange(MValue, DValue, PValue) {
    this.getDashboardMetrics(DValue, PValue);
    if (MValue != "" && DValue != "") {
      this.toggleLadenNumber = true;
      this.getBillofLadenNumber(MValue, DValue);
    }
  }

  onChangeProduct(DValue, PValue) {
    this.getDashboardMetrics(DValue, PValue);
  }

  onChangeLadenNumber(DValue,PValue, LValue) {
    this.getDashboardMetrics(DValue, PValue);
    try{
      let dispatchTypeFilter = this.motherVesselDispatches.filter(p => p[1].bill_of_laden_no == LValue);
      let quantity = dispatchTypeFilter[0][1].bill_of_laden_qty;
      let mother_vessel_dispatch_id = dispatchTypeFilter[0][1].id;
      this.expectedQuantity = quantity;
      this.motherVesselDispatchId = mother_vessel_dispatch_id;
    }catch(err){

    }
   
  }


  onChangeMother(MValue, DValue) {
    if (MValue != "" && DValue != "") {
      this.toggleLadenNumber = true;
      this.getBillofLadenNumber(MValue, DValue);

    }
  }

  getBillofLadenNumber(mother_id, daughter_id) {
    this.loading();
    this.dVesselBool = false;
    this.motherVesselDispatches = [];
    this.authHttp.get(this.global.public_url + 'manage_bill_of_laden_no?daughterVesselID=' + daughter_id + '&motherVesselID=' + mother_id)
      .subscribe(res => {
          this.motherVesselDispatches = this.getFunction.parseData(res);
          console.log(this.motherVesselDispatches);
          this.dVesselBool = true;
          this.loading()
        },
        error => {
          if (error.status !== 200) {
            var data = error._body;
            console.log(data);
            this.expectedQuantity = "0.00";
            this.global.handleMessage(data);
            this.global.dismissLoading();
          }
        });
  }

  getDashboardMetrics(daughter_id, type_id) {
    if (daughter_id != "" && type_id != "") {
        this.loading()
        this.dVesselBool = false;
        this.authHttp.get(this.global.public_url + 'daughter_vessel_metrics?daughter_id='+daughter_id+"&type_id="+type_id)
          .subscribe(res => {
            let datas = JSON.parse(res.text());
            // this.expectedQuantity = datas.data.expectedQuantity.toLocaleString();
            this.daughterVesselTotalReceived = datas.data.daughterVesselTotalReceived//.toLocaleString();
            this.daughterVesselTotalDispatches = datas.data.daughterVesselTotalDispatches//.toLocaleString();
            console.log(datas.data);
            this.dVesselBool = true;
            this.loading()
          },
          err => {
            console.log("Oops! Error getting dashboard metrics",err);
            this.global.showErrorToast('Error getting dashboard metrics'); 
            this.global.dismissLoading();
        }
    
        );

      }
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
        console.log("Oops! Error getting daughter vessel",err);
        this.global.showErrorToast('Error getting daughter vessel'); 
        this.global.dismissLoading();
    }

    );
  }

  validateInput(value) 
  {
    if(value==='' || value.length < 2)
    {
      return {
        isValid: false,
      };
    } 
    else 
    {
       return {
          isValid: true,
       }
    }
  }


  /** handles create-mother-vessel alert */
  presentMotherVesselCreate() {
    console.log('about to create mother vessel');
    let alert = this.alertCtrl.create({
      title: 'Create Mother Vessel',
      inputs: [
        {
          name: 'vessel_name',
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
            if (!this.validateInput(data['vessel_name']).isValid ) {
              console.log('vessel name is not valid');
              this.global.showErrorToast('vessel name is required');  
            }            
            if (!this.validateInput(data['vessel_no']).isValid ) {
              console.log('vessel number is not valid');
              this.global.showErrorToast('vessel number is required'); 
            }  
            
            if (this.validateInput(data['vessel_name']).isValid 
              && this.validateInput(data['vessel_no']).isValid   ) 
            {
              console.log('this is valid... creating ...');
              this.createMotherVessel(data);
            }            
          },


          /*
          handler: data => {
            console.log('creating...');
            console.log(data);
            this.createMotherVessel(data);
          }
          */
        }
      ]
    });
    alert.present();
  }

  /* mother vessel create */
  public createMotherVessel(name) {
    this.loading();
    this.mVesselCreated = null;
    console.log('name: ');
    console.log(name);
    return this.authHttp.post(this.global.public_url + 'mother_vessels', name)
      .subscribe(
        data2 => {
          let data = data2.json();
          this.mVesselCreated = data.data;
          console.log('successfully created! ');
          this.global.showErrorToast('Mother vessel created');
          this.getMotherVessel(); //to repopulate the mother vessels
        },
        err => {
          this.global.showErrorToast("Oops! Error creating mother vessel");
          console.log("Oops! Error creating mother vessel", err);
          this.global.dismissLoading();
        }
      );
  }

  getMotherVessel() {
    this.loading();
    this.mVesselBool = false;
    this.authHttp.get(this.global.public_url + 'mother_vessels')
      .subscribe(res => {
        this.mother_vessel_id = this.getFunction.parseData(res);
        console.log(this.mother_vessel_id)
        this.mVesselBool = true;
        this.loading()
      },
      err => {
        console.log("Oops! Error getting mother vessel",err);
        this.global.showErrorToast('Error getting mother vessel'); 
        this.global.dismissLoading();
    }

    );
  }

      /** handles create-daughter-vessel alert */    
      presentDaughterVesselCreate() { console.log('about to create daughter vessel'); 
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
              if (!this.validateInput(data['name']).isValid ) {
                console.log('vessel name is not valid');
                this.global.showErrorToast('vessel name is required');  
              }            
              if (!this.validateInput(data['vessel_no']).isValid ) {
                console.log('vessel number is not valid');
                this.global.showErrorToast('vessel number is required'); 
              }  
              
              if (this.validateInput(data['name']).isValid 
                && this.validateInput(data['vessel_no']).isValid   ) 
              {
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
          // console.log('successfully created! '); 
          this.global.showErrorToast('Daughter vessel created');
          this.getDaughterVessel(); //to repopulate the daughter vessels
        },
        err => {
          this.global.showErrorToast("Oops! Error creating daughter vessel");
          console.log("Oops! Error creating daughter vessel", err);
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
        console.log("Oops! Error getting product",err);
        this.global.showErrorToast('Error getting product'); 
        this.global.dismissLoading();
    }

    );

  }

  loading() {
    this.global.showLoading();
    if (this.productBool && this.mVesselBool && this.dVesselBool) {
      this.global.dismissLoading();
    }
  }

  ionViewDidLoad() {

  }


  presentProfileModal() {
    let data = this.data.value;
    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
    let motherVesselFilter = this.mother_vessel_id.filter(p => p[1].id == data.mother_vessel_id);
    let daughterVesselFilter = this.daughter_vessel_id.filter(p => p[1].id == data.daughter_vessel_id);
   // let dispatchTypeFilter = this.motherVesselDispatches.filter(p => p[1].bill_of_laden_no == LValue);
    data.product = typeFilter[0][1].name;
    data.status_id = 6;
    data.motherVesselDispatchId = this.motherVesselDispatchId;
    data.motherVessel = motherVesselFilter[0][1].vessel_name;
    data.daughterVessel = daughterVesselFilter[0][1].name;
    data.expectedQuantity = this.expectedQuantity;
    data.daughterVesselTotalReceived = this.daughterVesselTotalReceived;
    data.daughterVesselTotalDispatches = this.daughterVesselTotalDispatches;

    let profileModal = this.modalCtrl.create(DaughterVesselReceiveConfirmPage, {"data": data});
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
      //console.log(data);
    });
    profileModal.present();
  }

}
