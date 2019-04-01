import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { SocketService } from './../../socket.service';
import { TodoService } from 'src/app/todo.service';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.css'],
  providers: [SocketService]
})

export class MultiUserComponent implements OnInit {
  public userInfo: any;
  public allUserList: any = [];
  public authToken: string;
  public receiverId: string;
  public receiverName: string;
  public showSidebar: boolean;
  public onLineSearch: string;
  public offLineSearch: string;
  public userId: string;
  public friendListPage: boolean = true;
  public friendTodoPage: boolean = false;
  public friendTaskPage: boolean = false;
  public friendUserId: string;
  public friendName: string;
  public allLists: any[] = [];
  public pageLists: number = 1;
  public countTask: number;
  public search: any;
  listId: any;
  listName: any;
  onLineUserList: any=[];
  
  constructor(public AppService: AppService,
    public socketService: SocketService,
    public router: Router,
    private toastr: ToastrService,
    public todoService: TodoService,
    private ballLoader: NgxSpinnerService) { }

  ngOnInit() {
    this.ballLoader.show();
    setTimeout(() => {
      this.ballLoader.hide();
    }, 2000);
    this.authToken = Cookie.get('authToken');
    this.checkToken();
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.receiverId = Cookie.get("receiverId");
    this.receiverName = Cookie.get('receiverName');
    this.userId = Cookie.get("receiverId");
    this.allUserList = [];
    this.getallUserList();
    this.verifyUserConfirmation();
  }

  public checkToken: any = () => {
    if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {
      this.toastr.warning("Something went Wrong,Please Login again");
      this.router.navigate(['/']);
    }
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);
        this.getOnlineUserList();
      });
  }

  public getallUserList: any = () => {
    let data: any = { userId:this.userId, authToken: this.authToken };
    this.AppService.getFriendList(data).subscribe((apiResponse) =>{
      if (apiResponse.status == 200) {
      for (let i = 0; i < Object.keys(apiResponse.data.friends).length; i++) {
        if (apiResponse.data.friends[i].status == 1) {
          let temp = { 'userId': apiResponse.data.friends[i].friendId, 'name': apiResponse.data.friends[i].fullName, 'status': "offline" };
          this.allUserList.push(temp);
        }
      }
    }
    else {
      this.toastr.info(apiResponse.message);
    }
    })
  }

  public getOnlineUserList: any = () => {
    //get from service
    this.socketService.onlineUserList()
      .subscribe((data) => {
        if(Object.keys(data).length>0)
        {
        for (let x in data) {
          let temp={ 'userId': x, 'name': data[x], 'status': "online" };
          this.onLineUserList.push(temp);
        }//end online list
       for (let i = 0; i < Object.keys(this.onLineUserList).length; i++) {
        for (let j = 0; j < Object.keys(this.allUserList).length; j++) {
          if (this.allUserList[j].userId === this.onLineUserList[i].userId) {
            this.allUserList[j].status = "online";
          }
        }
      }//end update all list
      this.allUserList = _.sortBy(this.allUserList, ['name','-status']);//sort list
    }
      }); // end online-user-list 
  }


  public userSelected: any = (userId, name) => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.friendUserId = userId;
    this.friendName = name;
    this.friendListPage = false;
    this.friendTodoPage = true;
    this.getAllUserList();
  }

  public goBackfriendListPage: any = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.friendListPage = true;
    this.friendTodoPage = false;
    this.friendTaskPage = false;
    this.getOnlineUserList();
  }

  public getAllUserList = () => {
    let data: any = { userId: this.friendUserId, token: this.authToken };
    this.todoService.getAllList(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (Object.keys(apiResponse.data).length > 0) {
            for (let i = 0; i < Object.keys(apiResponse.data).length; i++) {
              this.countTask = Object.keys(apiResponse.data[i].task).length;
              apiResponse.data[i]["countTask"] = this.countTask;
              if (apiResponse.data[i].visibility === "public") {
                this.allLists.push(apiResponse.data[i]);
              }
            }
          }
          else {
            this.toastr.info(apiResponse.message);
          }
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Create New List.")
      }
    );//end subcribe
  }//end getAllList

  public setListData = (listId, listName) => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.friendTaskPage = true;
    this.friendListPage = false;
    this.friendTodoPage = false;
    this.listId =listId;
    this.listName =listName;
  }//end setListData

  public recieveMessage = ($event) => {
    this.showSidebar = $event;
  }

  public checkName = (array: any, key: string, value: string) => {
    return array.filter((object) => {
      return object[key].toUpperCase() == value.toUpperCase();
    });
  };

  public goBackTodo = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.friendTaskPage = false;
    this.friendListPage = false;
    this.friendTodoPage = true;
    this.allLists = [];
    this.getAllUserList();
  }

  public ngOnDestroy() {
    this.socketService.exitSocket();//need to call this method inorder to avoid listening the event multiple times(to avoid multiple toastr messages.)
  }


}
