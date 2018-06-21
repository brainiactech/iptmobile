import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationUnreadPage } from './notification-unread';

@NgModule({
  declarations: [
    NotificationUnreadPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationUnreadPage),
  ],
})
export class NotificationUnreadPageModule {}
