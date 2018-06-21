import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MotherVesselHomePage } from './mother-vessel-home';

@NgModule({
  declarations: [
    MotherVesselHomePage,
  ],
  imports: [
    IonicPageModule.forChild(MotherVesselHomePage),
  ],
})
export class MotherVesselHomePageModule {}
