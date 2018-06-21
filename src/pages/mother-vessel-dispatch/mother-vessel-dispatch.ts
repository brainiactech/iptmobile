import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
//import {TerminalDispatchConfirmPage} from './terminal-dispatch-confirm';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../config/global";
import {GeneralServiceProvider} from "../../providers/general-service/general-service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Response} from '@angular/http';
import {DatePipe} from '@angular/common';
import {Storage} from '@ionic/storage';
import {AuthHttp, tokenNotExpired} from 'angular2-jwt';
import {MotherVesselConfirmDispatchPage} from '../mother-vessel-confirm-dispatch/mother-vessel-confirm-dispatch';

/**
 * Generated class for the MotherVesselDispatchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-vessel-dispatch',
  templateUrl: 'mother-vessel-dispatch.html',
})
export class MotherVesselDispatchPage {

  private daughter_vessel_id: any;
  private mother_vessel_id: any;
  private product_id: any;
  private bill_of_laden_qty: any;
  private dispatch_date: any;
  private data: FormGroup;
  private daughters: any;
  private mothers: any;
  private products: any;
  private mVesselCreated: any;
  private dVesselCreated: any;
  private bill_of_laden_no: any;


  private isLoading: any;
  private daughterBool: boolean;
  private motherBool: boolean;
  private productBool: boolean;
  //private hideAquila: boolean;
  //private depotBool: boolean;
  private motherVesselTotalReceived: any;
  private motherVesselTotalDispatches: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals,
              private alertCtrl: AlertController,
              public storage: Storage,) {

    this.loading();
    //this.getTerminal();
    this.getproduct_id();
    this.getdaughter_vessel_ids();
    this.getmother_vessel_ids();

    this.data = this.formBuilder.group({
      daughter_vessel_id: ['', [Validators.required]],
      mother_vessel_id: ['', [Validators.required]],
      bill_of_laden_qty: ['', Validators.required],
      product_id: ['', Validators.required],
      dispatch_date: ['', Validators.required],
      bill_of_laden_no: ['', Validators.required],
      status_id: ['']
    });

    this.motherVesselTotalReceived = "0.00";
    this.motherVesselTotalDispatches = "0.00";
  }


  loading() {
    this.global.showLoading();
    if (this.productBool && this.daughterBool && this.motherBool) {
      this.global.dismissLoading();
    }
  }

  
  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentPrompt(message) 
  {

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

  submitForm() {

    let data = this.data.value;
    this.authHttp.post(this.global.public_url + 'mother_vessel_dispatches', data)
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

  onChange(MValue, PValue) {
    this.getDashboardMetrics(MValue, PValue);
  }

  onChangeProduct(MValue, PValue) {
   this.getDashboardMetrics(MValue, PValue);
 }


 getDashboardMetrics(mother_id, type_id) {
  if (mother_id != "" && type_id != "") {
    this.loading()
    this.motherBool = false;
    this.authHttp.get(this.global.public_url + 'mother_vessel_metrics?mother_id='+mother_id+'&type_id='+type_id)
      .subscribe(res => {
        let datas = JSON.parse(res.text());
        this.motherVesselTotalReceived = datas.data.motherVesselTotalReceived//.toLocaleString();
        this.motherVesselTotalDispatches = datas.data.motherVesselTotalDispatches//.toLocaleString();
        console.log(datas.data);
        this.motherBool = true;
        this.loading()
      },
      err => {
        console.log("Oops! Error loading metrics ",err);
        this.global.showErrorToast('Error loading metrics'); 
        this.global.dismissLoading();
      }
      
    );
    }
  }


  getproduct_id() {
    this.productBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'types/category/1')
      .subscribe(res => {
        this.products = this.getFunction.parseData(res);
        this.productBool = true;
        this.loading()
      },
      err => {
        console.log("Oops! Error getting product ",err);
        this.global.showErrorToast('Error getting product'); 
        this.global.dismissLoading();
      }
    );

  }

  getdaughter_vessel_ids() {
    this.daughterBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'daughter_vessels')
      .subscribe(res => {
        this.daughters = this.getFunction.parseData(res);
        this.daughterBool = true;
        this.loading()
      },
      err => {
        console.log("Oops! Error getting daughter vessel",err);
        this.global.showErrorToast('Error getting daughter vessel'); 
        this.global.dismissLoading();
    }
    );
  }

  getmother_vessel_ids() {
    this.motherBool = false;
    this.loading()
    this.authHttp.get(this.global.public_url + 'mother_vessels')
      .subscribe(res => {
        this.mothers = this.getFunction.parseData(res);
        this.motherBool = true;
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
    presentMotherVesselCreate() { console.log('about to create mother vessel');



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
    /** alert end */

    /* mother vessel create */
    public createMotherVessel(name) {
      this.loading();
      this.mVesselCreated = null;
      console.log('name: ');
      console.log(name);
      return this.authHttp.post(this.global.public_url + 'mother_vessels', name)
        .map(response => response.json()).subscribe(
          data => {
              this.mVesselCreated = data.data;
              console.log('successfully created! ');
              this.global.showErrorToast('Mother vessel created'); 
              this.getmother_vessel_ids(); //to repopulate the mother vessels
          },
          err => {
              console.log("Oops! Error creating mother vessel",err);
              this.global.showErrorToast('Error creating mother vessel'); 
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
              console.log('data: ',data);
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
                //this.createMotherVessel(data);
                this.createDaughterVessel(data);
                this.global.showErrorToast('daughter vessel successfully created.'); 
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
              this.global.showErrorToast('Daughter vessel created'); 
              this.getdaughter_vessel_ids(); //to repopulate the daughter vessels
          },
          err => {
              console.log("Oops! Error creating daughter vessel",err);
              this.global.showErrorToast('Error creating daughter vessel'); 
              this.global.dismissLoading();
          }
        );
    }


  presentProfileModal() {
    let data = this.data.value;

    let daughterFilter = this.daughters.filter(p => p[1].id == data.daughter_vessel_id);
    data.daughter_name = daughterFilter[0][1].name;

    let motherFilter = this.mothers.filter(p => p[1].id == data.mother_vessel_id);
    data.mother_name = motherFilter[0][1].vessel_name;

    let productFilter = this.products.filter(p => p[1].id == data.product_id);
    data.product_name = productFilter[0][1].name;
    data.montherVesselTotalReceived = this.motherVesselTotalReceived;
    data.motherVesselTotalDispatches = this.motherVesselTotalDispatches;


    let profileModal = this.modalCtrl.create(MotherVesselConfirmDispatchPage, data);
    profileModal.onDidDismiss(data => {
      if(data.returnData == 'save'){
        this.data.reset();
      }
    });
    profileModal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MotherVesselDispatchPage');
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
