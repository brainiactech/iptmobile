import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationAllPage } from './notification-all';

@NgModule({
  declarations: [
    NotificationAllPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationAllPage),
  ],
})
export class NotificationAllPageModule {}
