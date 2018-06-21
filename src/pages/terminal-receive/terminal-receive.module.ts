import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerminalReceivePage } from './terminal-receive';

@NgModule({
  declarations: [
    TerminalReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(TerminalReceivePage),
  ],
})
export class TerminalReceivePageModule {}
