import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { FriendService } from './../../friend.service';
import { SocketService } from './../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-friends',
  templateUrl: './manage-friends.component.html',
  styleUrls: ['./manage-friends.component.css']
})
export class ManageFriendsComponent implements OnInit{

  public userInfo: any;
  public authToken: string;
  public userId: string;
  public userName: string;
  public allUsers: any = [];
  public allRecieved: any = [];
  public allSender: any = [];
  public loadSender: boolean = true;
  public loadingSender: boolean = false;
  public pageNoSender: number = 1;
  public search: string = "";
  public searchRecieved: string = "";
  public searchSender: string = "";
  public pageNo: number = 1;
  public size: number = 6;
  public loadMore: boolean = true;
  public loadRecieved: boolean = true;
  public loadingRecieved: boolean = false;
  public pageNoRecieved: number = 1;
  public showSidebar: boolean;
  public loadingUser: boolean = false;
  public status: boolean = false;
  public countUnreadMsg: number;


  constructor(public appService: AppService,private ballLoader: NgxSpinnerService,public socketService: SocketService, public toastr: ToastrService, public router: Router, public friendService: FriendService) {

  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('receiverId');
    this.userName = Cookie.get('receiverName');
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.checkToken();
    this.getAllUnFriends();
    //this.verifyUserConfirmation();
  }

  public checkToken = () => {
    if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {
      this.toastr.warning("Something went Wrong,Please Login again");
      this.router.navigate(['/']);
    }
  }// end checkToken

  /*public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);
        this.acceptNotification();
        this.rejectNotification();
        this.sendedNotification();
        this.receivedNotification();
      });
  }*/


  public loadUnFriends = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.allUsers = [];
    this.pageNo = 1;
    this.getAllUnFriends();
  }//end loadUnFriends

  public getAllUnFriends = () => {
    let data: any = { userId: this.userId, pageNo: this.pageNo, size: this.size, query: this.search };
    this.friendService.getAllUnFriends(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if ((apiResponse.data.docs.length === 0)) {
            this.loadMore = false;
          }
          else {
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              this.allUsers.push(apiResponse.data.docs[i]);
            }
            this.loadMore = true;
          }
          if (this.search.length <= 0 && this.allUsers.length <= 0) {
            this.status = true;
          }
        }
        else{
          this.toastr.info(apiResponse.message);
        }
        this.loadingUser = false;
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get all users.")
      }
    );//end subcribe
  }//end getAllUnFriends

  public loadReciever = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.allRecieved = [];
    this.pageNoRecieved = 1;
    this.getAllRecieved();
  }

  public getAllRecieved = () => {
    let data: any = { userId: this.userId, pageNo: this.pageNoRecieved, size: this.size };
    this.friendService.getAllRecieved(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (apiResponse.data.docs.length === 0) {
            this.loadRecieved = false;
          }
          else {
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              this.allRecieved.push(apiResponse.data.docs[i]);
            }
            this.loadRecieved = true;
          }
        }
        else{
          this.toastr.info(apiResponse.message);
        }
        this.loadingRecieved = false;
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get all users.")
      }
    );//end subcribe
  }

  public loadSend = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.pageNoSender = 1;
    this.allSender = [];
    this.getAllSender();
  }

  public getAllSender = () => {
    let data: any = { userId: this.userId, pageNo: this.pageNoSender, size: this.size };
    this.friendService.getAllSender(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (apiResponse.data.docs.length === 0) {
            this.loadSender = false;
          }
          else {
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              this.allSender.push(apiResponse.data.docs[i]);
            }
            this.loadSender = true;
          }

        }
        else{
          this.toastr.info(apiResponse.message);
        }
        this.loadingSender = false;
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get all Sender.")
      }
    );//end subcribe
  }//end getAllSender

  //Accepting the request

  public accept = (id,msg) => {
    let data = {
      sender_id: this.userId,
      receiver_id: id,
      message: msg
    }
    this.socketService.acceptData(data);
  }

  public acceptNotification = () => {
    this.socketService.acceptResponse().subscribe((response) => {
      if (response.sender_id === this.userId) {
        this.toastr.success("Accepted sucessfully response");
        this.allRecieved = [];
        this.pageNoRecieved = 1;
        this.getAllRecieved();
      }
      if (response.receiver_id === this.userId) {
        this.pageNoSender = 1;
        this.allSender = [];
        this.getAllSender();
        this.toastr.success(response.message);
      }
      this.toastr.success("Now Your Can Managed Ur Friends Todo List")
    })
  }

  public reject = (id,msg) => {
    let data = {
      sender_id: this.userId,
      receiver_id: id,
      message: msg
    }
    this.socketService.rejectData(data);
  }

  public rejectNotification = () => {
    this.socketService.rejectResponse().subscribe((response) => {
      if (response.sender_id === this.userId) {
        this.toastr.success("Rejected Sucessfull");
        this.allRecieved = [];
        this.pageNoRecieved = 1;
        this.getAllRecieved();
      }
      if (response.receiver_id === this.userId) {
        this.pageNoSender = 1;
        this.allSender = [];
        this.getAllSender();
        this.toastr.success(response.message);
      }
    })
  }

  public sended = (id,msg) => {
    let data = {
      sender_id: this.userId,
      receiver_id: id,
      message: msg
    }
    this.socketService.sendedData(data);
    
  }

  public sendedNotification = () => {
    this.socketService.sendedResponse().subscribe((response) => {
      if (response.sender_id === this.userId) {
        this.toastr.success("Friend Request Sented");
        this.allUsers = [];
        this.pageNo = 1;
        this.getAllUnFriends();
      }
      if (response.receiver_id === this.userId) {
        this.allRecieved = [];
        this.pageNoRecieved = 1;
        this.getAllRecieved();
        this.allUsers = [];
        this.pageNo = 1;
        this.getAllUnFriends();
        this.toastr.success(response.message);
      }
    })
  }

  public received = (id,msg) => {
    let data = {
      sender_id: this.userId,
      receiver_id: id,
      message: msg
    }
    this.socketService.receivedData(data);
  }

  public receivedNotification = () => {
    this.socketService.receivedResponse().subscribe((response) => {
      if (response.sender_id === this.userId) {
        this.toastr.success("Removed Your Friend Request");
        this.pageNoSender = 1;
        this.allSender = [];
        this.getAllSender();
      }
      if (response.receiver_id === this.userId) {
        this.allRecieved = [];
        this.pageNoRecieved = 1;
        this.getAllRecieved();
        this.toastr.success(response.message);
      }
    })
  }

  public SendRequest = (friendId, status) => {
    let data: any = { userId: this.userId, friendId: friendId, status: status, authToken: this.authToken };
    this.friendService.sendRequest(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          if (status == 0) {
            this.sended(friendId,this.userName.concat(" Send Your a Friend Request"));
            this.appService.setUserInfoInLocalStorage(apiResponse.data);
          }
          if (status == 1) {
            this.accept(friendId,this.userName.concat(" Accepted Your a Friend Request"));
            this.appService.setUserInfoInLocalStorage(apiResponse.data);
          }
          if (status == 2) {
            this.reject(friendId,this.userName.concat(" Rejected Your a Friend Request"));
            this.appService.setUserInfoInLocalStorage(apiResponse.data);
          }
          if (status == 5) {
            this.received(friendId,this.userName.concat(" Removed Your a Friend Request"));
            this.pageNo = 1;
            this.allUsers = [];
            this.getAllUnFriends();
            this.appService.setUserInfoInLocalStorage(apiResponse.data);
          }
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Send Request")
      }
    );//end subcribe
  }//end getSentRequest

  public loadMoreUsers = () => {
    this.loadingUser = true;
    this.pageNo = this.pageNo + 1;
    this.getAllUnFriends();
  }

  public loadMoreSender = () => {
    this.loadingSender = true;
    this.pageNoSender = this.pageNoSender + 1;
    this.getAllSender();
  }

  public loadMoreRevceiver = () => {
    this.loadingRecieved = true;
    this.pageNoRecieved = this.pageNoRecieved + 1;
    this.getAllRecieved();
  }

  public sendKeyword = () => {
    this.allUsers = [];
    this.pageNo = 1;
    this.getAllUnFriends();
  }

  public sendUsingKeypress: any = (event: any) => {
    if (event.keyCode === 13) {
      // 13 is keycode of enter.
      this.sendKeyword();
    }
  };

  public recieveMessage = ($event) => {
    this.showSidebar = $event;
  }

  ngOnDestroy() { }

}
