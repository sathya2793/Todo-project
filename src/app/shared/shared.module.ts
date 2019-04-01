import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { CountryCodeComponent } from './country-code/country-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageTaskComponent } from './manage-task/manage-task.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    RouterModule
  ],
  declarations: [UserDetailsComponent, NavBarComponent, CountryCodeComponent, ManageTaskComponent],
  exports: [NavBarComponent,CountryCodeComponent,UserDetailsComponent,ManageTaskComponent]
})
export class SharedModule { }
