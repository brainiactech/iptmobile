import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerminalDispatchPage } from './terminal-dispatch';

@NgModule({
  declarations: [
    TerminalDispatchPage,
  ],
  imports: [
    IonicPageModule.forChild(TerminalDispatchPage),
  ],
})
export class TerminalDispatchPageModule {}
