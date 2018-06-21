import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketerPage } from './marketer';

@NgModule({
  declarations: [
    MarketerPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketerPage),
  ],
})
export class MarketerPageModule {}
