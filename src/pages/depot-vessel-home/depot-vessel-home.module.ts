import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepotVesselHomePage } from './depot-vessel-home';

@NgModule({
  declarations: [
    DepotVesselHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DepotVesselHomePage),
  ],
})
export class DepotVesselHomePageModule {}
