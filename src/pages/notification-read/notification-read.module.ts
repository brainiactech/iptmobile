import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationReadPage } from './notification-read';

@NgModule({
  declarations: [
    NotificationReadPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationReadPage),
  ],
})
export class NotificationReadPageModule {}
