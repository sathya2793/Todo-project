import { Component, OnInit} from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { NotificationService } from './../../notification.service';
import { DataService } from '../../shared/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public showSidebar: boolean;
  public allNotify:any =[];
  public userInfo: any;
  public authToken: string;
  public receiverId: string;
  public receiverName: string;
  public userId: string;
  public pageNo: number;
  public loadMore: boolean;
  public loadingUser :boolean;
  public countUnreadMsg: number;

  constructor(public AppService: AppService,
    public router: Router,
    private toastr: ToastrService,
    public notificationService: NotificationService,
    private ballLoader: NgxSpinnerService,
    private data: DataService) { }

  ngOnInit() {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.authToken = Cookie.get('authToken');
    this.checkToken();
    this.pageNo=1;
    this.loadingUser = false;
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.receiverId = Cookie.get("receiverId");
    this.receiverName = Cookie.get('receiverName');
    this.userId = Cookie.get("receiverId");
     this.getAllNotification();
     this.data.currentMessage.subscribe(countUnreadMsg => this.countUnreadMsg = countUnreadMsg);
  }

  public checkToken: any = () => {
    if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {
      this.toastr.warning("Something went Wrong,Please Login again");
      this.router.navigate(['/']);
    }
  }

  public getAllNotification : any = () => {
    let data: any = { userId: this.userId, pageNo: this.pageNo,authToken:this.authToken};
    this.notificationService.getAllNotification(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 500);
        if (apiResponse.status == 200) {
          if (apiResponse.data.docs.length === 0) {
            this.loadMore = false;
          }
          else {
            this.countUnreadMsg = 0;
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              if(apiResponse.data.docs[i].status === 0){
                this.countUnreadMsg =this.countUnreadMsg +1;
              }
              this.allNotify.push(apiResponse.data.docs[i]);
            }
            this.data.changeMessage(this.countUnreadMsg);
            this.loadMore = true;
          }
        }
        this.loadingUser = false;
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get all users.")
      }
    );//end subcribe
  }


  public userSelected : any = (Id) => {
    let data: any = { Id: Id,authToken:this.authToken};
    this.notificationService.statusNotification(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 500);
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.allNotify = [];
          this.getAllNotification();
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to updated.")
      }
    );//end subcribe
  }

  public msgClosed : any = (Id) => {
    let data: any = { Id: Id,authToken:this.authToken};
    this.notificationService.closedNotification(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 500);
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.allNotify = [];
         this.getAllNotification();
          }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Delete.")
      }
    );//end subcribe
  }

  public loadMoreUsers :any = () => {
    this.pageNo =this.pageNo +1;
    this.loadingUser = true;
    this.getAllNotification();
  }

  public recieveMessage($event) {
    this.showSidebar = $event;
  }//end recieveMessage

}
