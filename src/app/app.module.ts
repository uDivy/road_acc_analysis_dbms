import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { FilterPipe } from '../app/home/filter.pipe';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphComponentComponent } from './graph-component/graph-component.component'; // Import HttpClientModule


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterPipe,
    LoginComponent,
    GraphComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
