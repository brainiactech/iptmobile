import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutletDailyLogPage } from './outlet-daily-log';

@NgModule({
  declarations: [
    OutletDailyLogPage,
  ],
  imports: [
    IonicPageModule.forChild(OutletDailyLogPage),
  ],
})
export class OutletDailyLogPageModule {}
