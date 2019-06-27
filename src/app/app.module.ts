import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { CustomCalenderComponent } from './custom-calender/custom-calender.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, FullCalendarModule ],
  declarations: [ AppComponent, HelloComponent, CustomCalenderComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
