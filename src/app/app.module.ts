import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppService } from "./app.service";
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from './socket.service';
import { DataService}  from './shared/data.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    DashboardModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot( {preventDuplicates: true}),
    HttpClientModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent, pathMatch: "full" },
      { path: "", component: LoginComponent, pathMatch: "full" },
      { path: '*', component: LoginComponent },
      { path: '**', component: PagenotfoundComponent }
    ])
  ],
  providers: [AppService,SocketService,Title,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
