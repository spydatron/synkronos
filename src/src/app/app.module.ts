// ====== ./app/app.module.ts ======
// Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconRegistry} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {MQTTService} from './services/mqtt/mqtt.service';
import { HttpClientModule } from '@angular/common/http';
import './polyfills';

// Declarations
import { AppComponent } from './app.component';
import { DashboardComponent } from './page_modules/dashboard/dashboard.component';
import { routing } from './app.routes';
import {MaterialModule} from './app-material.module';
import {ToggleSwitchModule} from './page_modules/page-components/toggle-switch/toggleSwitchModule';

// Decorator
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    MaterialModule,
    routing
  ],
  providers: [MatIconRegistry, MQTTService],
  bootstrap: [AppComponent]
})
export class AppModule { }
