import { Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Title } from '@angular/platform-browser';
import { NotificationService } from './../../notification.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [SocketService]
})
export class NavBarComponent implements OnInit, OnDestroy {

  @Output() messageEvent = new EventEmitter<boolean>();

  public userName: string;
  public authToken: string;
  public showSidebar: boolean =false;
  public title: string ;
  public userId: string;
  public countUnreadMsg:number;
  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,
    private titleService: Title,
    private data: DataService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.title="TODO";
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('receiverName');
    this.userId = Cookie.get("receiverId");
   this.getAllNotification();
   this.data.currentMessage.subscribe(countUnreadMsg => this.countUnreadMsg = countUnreadMsg);
  }

  public logout: any = () => {
    let data: any = { authToken: this.authToken };
    this.appService.logout(data)
      .subscribe((apiResponse) => {
        if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
          Cookie.deleteAll();
          localStorage.removeItem('userInfo');
          this.router.navigate(['/']);
          this.socketService.exitSocket();
          this.toastr.info(apiResponse.message);
        }
        else if (apiResponse.message == "Failed To Authorized") {
          Cookie.deleteAll();
          localStorage.removeItem('userInfo');
          this.router.navigate(['/']);
          this.socketService.exitSocket();
          this.toastr.info(apiResponse.message);
        }
        else if (apiResponse.status === 200) {
          Cookie.deleteAll();
          localStorage.removeItem('userInfo');
          this.router.navigate(['/']);
          this.socketService.exitSocket();
        } else {
          this.toastr.error(apiResponse.message)
        } // end condition

      }, (err) => {
        this.toastr.error('some error occured')
      });

  } // end logout

  changedTitle(msg :string){
    //this.title=msg;
    this.titleService.setTitle(msg);
  }

  toggle() {
    this.showSidebar = !this.showSidebar;
    this.messageEvent.emit(this.showSidebar);
  }

  public getAllNotification : any = () => {
    let data: any = { userId: this.userId,authToken:this.authToken};
    this.notificationService.getAllNotification(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
            this.countUnreadMsg = 0;
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              if(apiResponse.data.docs[i].status === 0){
                this.countUnreadMsg =this.countUnreadMsg +1;
              }
            }
            this.data.changeMessage(this.countUnreadMsg)
          }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get Notification.")
      }
    );//end subcribe
  }
  
  public ngOnDestroy() {
    this.socketService.exitSocket();//need to call this method inorder to avoid listening the event multiple times(to avoid multiple toastr messages.)
  }

}