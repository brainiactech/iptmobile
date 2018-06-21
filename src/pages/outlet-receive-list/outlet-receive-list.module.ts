import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutletReceiveListPage } from './outlet-receive-list';

@NgModule({
  declarations: [
    OutletReceiveListPage,
  ],
  imports: [
    IonicPageModule.forChild(OutletReceiveListPage),
  ],
})
export class OutletReceiveListPageModule {}
