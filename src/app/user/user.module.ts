import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordMsgComponent } from './forget-password-msg/forget-password-msg.component';
import { MailNotificationComponent } from './mail-notification/mail-notification.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'sign-up', component: SignupComponent },
      { path: 'mail-notification', component: MailNotificationComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'forget-password-msg', component: ForgetPasswordMsgComponent},
      { path: 'verify', component: VerifyComponent },
      { path: 'reset-password/:userId', component : ResetPasswordComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ForgetPasswordComponent,VerifyComponent, ResetPasswordComponent, ForgetPasswordMsgComponent, MailNotificationComponent]
})
export class UserModule { }
