import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { TodoService } from 'src/app/todo.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  public showSidebar: boolean;
  // Lists
  public listId:string;
  public listName: string;
  public listForm: FormGroup;
  public editListForm: FormGroup;
  public editUserId: string;
  public deleteUserId: string;
  public allLists: any[] = [];
  public allPublic: any[] = [];
  public allPrivate: any[] = [];
  public pageLists: number = 1;
  public pagePublic: number = 1;
  public pagePrivate: number = 1;
  public countTask: number;
  // Tasks 
  public showTaskPage: Boolean = false;

  //Variables Used With Cookies:
  public token: string;
  public userId: string;
  public fullName: string;
  public userInfo: any;
  public history: any[] = [];



  constructor(public appService: AppService, private ballLoader: NgxSpinnerService,public toastr: ToastrService, public router: Router, public socketService: SocketService, public todoService: TodoService) {

    this.listForm = new FormGroup({
      'listName': new FormControl(),
      'visibility': new FormControl("public")
    });
    this.editListForm = new FormGroup({
      'editListName': new FormControl(),
      'editListVisibility': new FormControl()
    })
  }

  ngOnInit() {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.userId = Cookie.get("receiverId");
    this.fullName = Cookie.get("receiverName");
    this.token = Cookie.get('authToken');
    this.getAllUserList();
  }

  /*  Manage List - crud */

  public createNewUserList = () => {
    if (this.listForm.value.listName.length === 0 || this.listForm.value.listName.match(/^ *$/) !== null) {
      this.toastr.info("List name can't be empty");
    }
    else if (this.checkName(this.allLists, "listName", this.listForm.value.listName).length > 0) {
      this.toastr.info("List name already present");
    }
    else {
      let data: any = {
        userId: this.userId,
        listName: this.listForm.value.listName,
        creator: this.fullName,
        visibility: this.listForm.value.visibility,
        token: this.token
      };
      this.todoService.createNewList(data).subscribe(
        (apiResponse) => {
          if (apiResponse.status == 200) {
            this.toastr.success(apiResponse.message);
            this.allLists = [];
            this.allPublic = [];
            this.allPrivate = [];
            this.getAllUserList();
          }
          else {
            this.toastr.info(apiResponse.message);
          }
        }
        ,
        (error) => {
          console.log(error);
          this.toastr.error("Error!", "Unable to Create New List.")
        }
      );//end subcribe
    }
  }//end createNewList

  public getAllUserList = () => {
    let data: any = { userId: this.userId, token: this.token };
    this.todoService.getAllList(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          if (Object.keys(apiResponse.data).length > 0) {
            for (let i = 0; i < Object.keys(apiResponse.data).length; i++) {
              this.countTask = Object.keys(apiResponse.data[i].task).length;
              apiResponse.data[i]["countTask"] = this.countTask;
              this.allLists.push(apiResponse.data[i]);
              if (apiResponse.data[i].visibility === "public") {
                this.allPublic.push(apiResponse.data[i]);
              }
              if (apiResponse.data[i].visibility === "private") {
                this.allPrivate.push(apiResponse.data[i]);
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

  public updatedUserList = (listId) => {
    let data: any = {
      listId: listId,
      listName: this.editListForm.value.editListName,
      creator: this.fullName,
      visibility: this.editListForm.value.editListVisibility,
      token: this.token
    };
    this.todoService.updatedList(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.allLists = [];
          this.allPublic = [];
          this.allPrivate = [];
          this.getAllUserList();
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to updated List.")
      }
    );//end subcribe
  }//end updatedUserList

  public deletedUserList = (listId) => {
    let data: any = { listId: listId, token: this.token };
    this.todoService.deletedList(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.allLists = [];
          this.allPublic = [];
          this.allPrivate = [];
          this.getAllUserList();
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Deleted List.")
      }
    );//end subcribe
  }//end deletedUserList

  /* set List */

  public resetNewList() {
    this.listForm.controls['listName'].setValue("");
    this.listForm.controls['visibility'].setValue("public");
  }//end resetNewList

  public setListData = (listId, listName) => {
    this.showTaskPage = true;
    this.listId = listId;
    this.listName = listName;
  }//end setListData

  public setEditListData = (listId, listName, visibility) => {
    this.editUserId = listId;
    this.editListForm.controls['editListName'].setValue(listName);
    this.editListForm.controls['editListVisibility'].setValue(visibility);
  }//end setEditListData

  public setDeleteListData = (listId) => {
    this.deleteUserId = listId;
  }//end setDeleteListData

  public checkName = (array: any, key: string, value: string) => {
    return array.filter((object) => {
      return object[key].toUpperCase() == value.toUpperCase();
    });
  };

  public recieveMessage = ($event) => {
    this.showSidebar = $event;
  }


  public goBackList = () => {
    this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 1000);
    this.showTaskPage = false;
    this.allLists = [];
    this.allPublic = [];
    this.allPrivate = [];
    this.getAllUserList();
  }
  
}
