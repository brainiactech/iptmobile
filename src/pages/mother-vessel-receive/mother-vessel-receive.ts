import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
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
import {MotherVesselReceiveConfirmPage} from './mother-vessel-receive-confirm';


/**
 * Generated class for the MotherVesselReceivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mother-vessel-receive',
  templateUrl: 'mother-vessel-receive.html',
})
export class MotherVesselReceivePage {


  private type_id: any;
  private mother_vessel_id: any;
  private data: FormGroup;
  private productBool: boolean;
  private mVesselBool: boolean;
  private mVesselCreated: any;
  private motherVesselTotalReceived:any;
  private motherVesselTotalDispatches:any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, private formBuilder: FormBuilder,
              public getFunction: GeneralServiceProvider,
              public authHttp: AuthHttp, public global: Globals, private alertCtrl: AlertController) {

    this.loading();
    this.getProduct();
    this.getMotherVessel();

    this.data = this.formBuilder.group({
      mother_vessel_id: ['', [Validators.required]],
      bill_of_laden_no: ['', [Validators.required]],
      bill_of_laden_qty: ['', Validators.required],
      arrival_date: ['', Validators.required],
      out_turn_qty: ['', Validators.required],
      type_id: ['', Validators.required]
    });

    this.motherVesselTotalReceived = "0.00";
    this.motherVesselTotalDispatches = "0.00"

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
      this.mVesselBool = false;
      this.authHttp.get(this.global.public_url + 'mother_vessel_metrics?mother_id='+mother_id+'&type_id='+type_id)
        .subscribe(res => {
          let datas = JSON.parse(res.text());
          this.motherVesselTotalReceived = datas.data.motherVesselTotalReceived//.toLocaleString();
          this.motherVesselTotalDispatches = datas.data.motherVesselTotalDispatches//.toLocaleString();

          // console.log(datas.data);
          this.mVesselBool = true;
          this.loading()
        });
      }  

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



  ionViewDidLoad() {

  }

  loading() {
    this.global.showLoading();
    if (this.productBool && this.mVesselBool) {
      this.global.dismissLoading();
    }
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
            console.log("Oops! Error creating mother vessel",err);
            this.global.showErrorToast('Error creating mother vessel');
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
      });
  }

  getProduct() {
    this.loading();
    this.productBool = false;
    this.authHttp.get(this.global.public_url + 'types/category/1')
      .subscribe(res => {
        this.type_id = this.getFunction.parseData(res);
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

  refreshPage() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentProfileModal() {
    let data = this.data.value;
    let typeFilter = this.type_id.filter(p => p[1].id == data.type_id);
    let motherVesselFilter = this.mother_vessel_id.filter(p => p[1].id == data.mother_vessel_id);
    data.product = typeFilter[0][1].name;
    data.motherVessel = motherVesselFilter[0][1].vessel_name;
    data.motherVesselTotalReceived = this.motherVesselTotalReceived;
    data.motherVesselTotalDispatches = this.motherVesselTotalDispatches;


    let profileModal = this.modalCtrl.create(MotherVesselReceiveConfirmPage, data);
    profileModal.onDidDismiss(data => {
     // console.log(data);
    });
    profileModal.present();
  }

  ionViewCanEnter() {
    return this.storage.get('token').then(token => {
      return tokenNotExpired(null, token);
    });
  }

}
