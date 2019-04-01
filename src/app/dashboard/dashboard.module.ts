import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { RouteGuardService } from './route-guard.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { ManageFriendsComponent } from './manage-friends/manage-friends.component';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FriendService} from './../friend.service';
import { TodoService} from './../todo.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from '../filter.pipe';
import { SelectPipe } from '../select.pipe';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: 'home', component:HomeComponent,canActivate:[RouteGuardService] },
      {path: 'friends-dashboard', component : MultiUserComponent},
      {path: 'friends', component : ManageFriendsComponent},
      {path: 'edit-user', component : EditUserComponent},
      {path: 'change-password', component : ChangePasswordComponent},
      {path: 'notification', component : NotificationComponent}
    ])
  ],
  declarations: [HomeComponent,EditUserComponent, MultiUserComponent, ManageFriendsComponent ,ChangePasswordComponent, NotificationComponent,FilterPipe,SelectPipe],
  providers:[RouteGuardService,FriendService,TodoService],
  exports: [RouterModule]
})
export class DashboardModule { }
