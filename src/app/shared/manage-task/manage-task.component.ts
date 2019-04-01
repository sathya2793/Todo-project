import { Component, OnInit, HostListener, Input, Output, EventEmitter  } from '@angular/core';
import { TodoService } from 'src/app/todo.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from './../../notification.service';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})
export class ManageTaskComponent implements OnInit {
  @Input() listId:any;
  @Input() listName:any;
  @Input() shareFriendId:any;
  @Input() shareUserId:any;
  @Output() goBackListEvent =new EventEmitter<string>();
  public taskName: string;
  public editTaskId: string;
  public editTaskName: string;
  public oldTaskName: string;
  public allTasks: any[] = [];
  public countTasks: number;
  public pageTasks: number;
  // Sub Tasks
  public taskId: string;
  public subTaskName: string;
  public editSubTaskId: string;
  public editSubTaskName: string;
  public oldSubTaskName: string;
  public countTodoSubTasks: number;
  public countTotalSubTasks: number;
  //Variables Used With Cookies:
  public token : string;
  public fullName: string;
  public userInfo: any;
  public userId: string;
  public receiverName: string;
  public countUnreadMsg: number;
  constructor(public appService: AppService,private data: DataService, public toastr: ToastrService, public router: Router, public socketService: SocketService, public todoService: TodoService,private ballLoader: NgxSpinnerService,public notificationService: NotificationService) { }

  ngOnInit() {
    this.editTaskId ="";
    this.editSubTaskId ="";
    this.pageTasks = 1;
    this.userId = Cookie.get('receiverId');
    this.token= Cookie.get('authToken');
    this.receiverName = Cookie.get('receiverName');
    //this.verifyUserConfirmation();
    this.getAllUserTask(this.listId);
    this.createNotification();
    this.deleteNotification();
    this.updateNotification();
    this.statusNotification();
    this.undocreateNotification();
    this.undodeleteNotification();
    this.undostatusDoneNotification();
    this.unodupdateNotification();
    
    //
    this.subcreateNotification();
    this.subdeleteNotification();
    this.subupdateNotification();
    this.undosubcreateNotification();
    this.undosubdeleteNotification();
    this.undosubstatusNotification();
    this.unodsubupdateNotification();
    this.getAllNotification();
    this.data.currentMessage.subscribe(countUnreadMsg => this.countUnreadMsg = countUnreadMsg);
    
  }

 /* public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.token);
      });
  }*/

  public goBackList: any = () => {
    this.goBackListEvent.emit();
  }//end onChangeCountry

  /*  Manage Task - crud */

  public getAllUserTask = (listId) => {
    let data: any = { listId: listId, token: this.token };
    this.todoService.getAllTasks(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          for (let i in apiResponse.data[0].task) {
            //count total subtask
            this.countTotalSubTasks = (apiResponse.data[0].task[i].subTask).length;
            apiResponse.data[0].task[i]["countSubTask"] = this.countTotalSubTasks;
            //count total todo sub task
            this.countTodoSubTasks = 0;
            for (let j = 0; j < this.countTotalSubTasks; j++) {
              if (apiResponse.data[0].task[i].subTask[j].status === 'done') {
                this.countTodoSubTasks = this.countTodoSubTasks + 1;
              }
            }
            apiResponse.data[0].task[i]["countTodoSubTask"] = this.countTodoSubTasks;
            this.allTasks.push(apiResponse.data[0].task[i]);
          }
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Get All Task.")
      }
    );//end subcribe
  }//end getAllTask

  public create = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.createTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.createTaskData(data);
    }
  }

  public createNotification = () => {
    this.socketService.createTaskResponse().subscribe((response) => {
          this.pageTasks = 1;
          this.allTasks = [];
          this.getAllUserTask(this.listId);
          if((response.sender_id === this.shareUserId)){
          this.toastr.success("Task Created Sucessfully");
          }
          else{
            this.toastr.success(response.message);}
    })
  }

  public createNewUserTask = (listId) => {
    if (this.taskName.length === 0 || this.taskName.match(/^ *$/) !== null) {
      this.toastr.info("Task name can't be empty");
    }
    else if (this.checkName(this.allTasks, "taskName", this.taskName).length > 0) {
      this.toastr.info("Task name already present");
    }
    else {
      let data: any = {
        listId: listId,
        taskName: this.taskName,
        token: this.token
      };
      this.todoService.createNewTask(data).subscribe(
        (apiResponse) => {this.ballLoader.show();           setTimeout(() => {             this.ballLoader.hide();           }, 2000);
          if (apiResponse.status == 200) {
            this.create(this.receiverName+ " Created a New Task "+ this.taskName +" on " +this.listName + " Lists");
            setTimeout(() => {            
              this.getAllNotification();
              this.data.currentMessage.subscribe(countUnreadMsg => this.countUnreadMsg = countUnreadMsg);
                     }, 5000);
          }
          else {
            this.toastr.info(apiResponse.message);
          }
          this.taskName = "";
        }
        ,
        (error) => {
          console.log(error);
          this.toastr.error("Error!", "Unable to Create New List.")
        }
      );//end subcribe
    }
  }//end createNewTask

  public update = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.updateTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.updateTaskData(data);
    }
  }

  public updateNotification = () => {
    this.socketService.updateTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Task Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public updatedUserTask = (listId, taskId) => {
    if (this.editTaskName.length === 0 || this.editTaskName.match(/^ *$/) !== null) {
      this.toastr.info("Task name can't be empty");
    }
    else {
      let data: any = {
        listId: listId,
        taskId: taskId,
        taskName: this.editTaskName,
        editTaskName: this.oldTaskName,
        token: this.token
      };
      this.todoService.updatedTask(data).subscribe(
        (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
          if (apiResponse.status == 200) {
            this.update(this.receiverName+ " updated " + this.oldTaskName +" to " +this.editTaskName+ " on "+this.listName + " Lists");
            this.cancelEditTaskData();
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
    }
  }//end updatedUserTask


  public delete = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.deleteTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.deleteTaskData(data);
    }
  }

  public deleteNotification = () => {
    this.socketService.deleteTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Task Deleted Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public deletedUserTask = (listId, taskId, taskName, status) => {
    let data: any = { listId: listId, taskId: taskId, taskName: taskName, status: status, token: this.token };
    this.todoService.deletedTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.delete(this.receiverName+ " Deleted " + taskName + " Task" +" on " +this.listName + " Lists");
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
  }//end deletedUserTask

  public status = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.statusTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.statusTaskData(data);
    }
  }

  public statusNotification = () => {
    this.socketService.statusTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Status Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public markDoneTask = (listId, taskId, taskName) => {
    let data: any = { listId: listId, taskId: taskId, taskName: taskName, status: "done", token: this.token };
    this.todoService.statusTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
         this.status(this.receiverName+ " Mark done on " + taskName + " Task" +" in " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to mark Done Task.")
      }
    );//end subcribe
  }//end markDoneTask

  public markOpenTask = (listId, taskId, taskName) => {
    let data: any = { listId: listId, taskId: taskId, taskName: taskName, status: "open", token: this.token };
    this.todoService.statusTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.status(this.receiverName+ " Mark open again on " + taskName + " Task" +" on " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to mark Open tasks.")
      }
    );//end subcribe
  }//end markOpenTask
  
  /* set Task */

  public setEditTaskData = (taskId, taskName) => {
    this.editTaskId = taskId;
    this.editTaskName = taskName;
    this.oldTaskName = taskName;
  }

  public cancelEditTaskData = () => {
    this.editTaskId = "";
    this.editTaskName = "";
  }
  /*  Manage undo Task - crud */

  /* undo task */
  public undoTask(listId) {
    let data: any = {
      listId: listId,
      token: this.token
    };
    this.todoService.undoTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          if (apiResponse.data === null || apiResponse.data === undefined || apiResponse.data === '') {
            this.toastr.info('No undo found!');
          }
          else if (apiResponse.data.data.action === "Deleted Task") {
            this.undoDeleteTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.taskName, apiResponse.data.data.status)
          }
          else if (apiResponse.data.data.action === "New Task") {
            this.undoCreateTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId)
          }
          else if (apiResponse.data.data.action === "Edit Task") {
            this.undoUpdateTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.editTaskName)
          }
          else if (apiResponse.data.data.action === "Status Update Task") {
            this.undoStatusTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.editStatus)
          }
          else if (apiResponse.data.data.action === "Delete Sub Task") {
            this.undoDeleteSubTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.subTaskId, apiResponse.data.data.subTaskName, apiResponse.data.data.subStatus)
          }
          else if (apiResponse.data.data.action === "New Sub Task") {
            this.undoCreateSubTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.subTaskId)
          }
          else if (apiResponse.data.data.action === "Edit Sub Task") {
            this.undoUpdateSubTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.subTaskId, apiResponse.data.data.subStatus, apiResponse.data.data.editSubTaskName)
          }
          else if (apiResponse.data.data.action === "Status Update Sub Task") {
            this.undoStatusSubTask(apiResponse.data.data.id, listId, apiResponse.data.data.taskId, apiResponse.data.data.subTaskId, apiResponse.data.data.subTaskName, apiResponse.data.data.editSubStatus)
          }
          else {
            console.log("error");
          }
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo Task.")
      }
    );//end subcribe

  }//end undoTask

  public undodelete = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undodeleteTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undodeleteTaskData(data);
    }
  }

  public undodeleteNotification = () => {
    this.socketService.undodeleteTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Task Deleted sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoDeleteTask = (id, listId, taskId, taskName, status) => {
    let data: any = { id: id, listId: listId, taskId: taskId, taskName: taskName, status: status, token: this.token };
    this.todoService.undoDeletedTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undodelete(this.receiverName+ " Undo Deleted the " + taskName + " Task"+" on " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Deleted List.")
      }
    );//end subcribe
  }//end undoDeleteTask

  public undocreate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undocreateTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undocreateTaskData(data);
    }
  }

  public undocreateNotification = () => {
    this.socketService.undocreateTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Task Created Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoCreateTask = (id, listId, taskId) => {
    let data: any = { id: id, listId: listId, taskId: taskId, token: this.token };
    this.todoService.undoCreateTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undocreate(this.receiverName+ " Created a New Task "+ this.taskName +" on " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo create Task.")
      }
    );//end subcribe
  }//end undoCreateTask

  public undoupdate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undoupdateTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undoupdateTaskData(data);
    }
  }

  public unodupdateNotification = () => {
    this.socketService.undoupdateTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Task Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoUpdateTask = (id, listId, taskId, editTaskName) => {
    let data: any = { id: id, listId: listId, taskId: taskId, editTaskName: editTaskName, token: this.token };
    this.todoService.undoUpdateTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undoupdate(this.receiverName+ " Undo Updated "+ this.editTaskName+ " on "+this.listName + " Lists");
          this.allTasks = [];
          this.pageTasks = 1;
          this.getAllUserTask(listId);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Updated List.")
      }
    );//end subcribe
  }//end undoUpdateTask

  public undostatusDone = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undostatusTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undostatusTaskData(data);
    }
  }

  public undostatusDoneNotification = () => {
    this.socketService.undostatusTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Status Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoStatusTask = (id, listId, taskId, status) => {
    let data: any = { id: id, listId: listId, taskId: taskId, editStatus: status, token: this.token };
    this.todoService.undoStatusTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undostatusDone(this.receiverName+ " "+ apiResponse.message);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Status Task.")
      }
    );//end subcribe
  }//end undoStatusTask



  /*  Manage undo Sub Task - crud */

  public undosubdelete = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undodeletesubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undodeleteTaskData(data);
    }
  }

  public undosubdeleteNotification = () => {
    this.socketService.undodeletesubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Sub Task Deleted sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoDeleteSubTask = (id, listId, taskId, subTaskId, subTaskName, subStatus) => {
    let data: any = { id: id, listId: listId, taskId: taskId, subTaskId: subTaskId, subTaskName: subTaskName, subStatus: subStatus, token: this.token };
    this.todoService.undoDeletedSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undosubdelete(this.receiverName+ " Undo Deleted the " + subTaskName + " Sub Task");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Created Sub Task.")
      }
    );//end subcribe
  }//end undoDeleteSubTask
  
  public undosubcreate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undocreatesubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undocreatesubTaskData(data);
    }
  }

  public undosubcreateNotification = () => {
    this.socketService.undocreateTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Sub Task Created Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoCreateSubTask = (id, listId, taskId, subTaskId) => {
    let data: any = { id: id, listId: listId, taskId: taskId, subTaskId: subTaskId, token: this.token };
    this.todoService.undoCreateSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undosubcreate(this.receiverName+ " Undo Created a Sub Task "+ this.taskName +" on " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo create Task.")
      }
    );//end subcribe
  }//end undoCreateSubTask

  public undosubupdate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undoupdatesubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undoupdatesubTaskData(data);
    }
  }

  public unodsubupdateNotification = () => {
    this.socketService.undoupdatesubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo SUb Task Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoUpdateSubTask = (id, listId, taskId, subTaskId, subStatus, editSubTaskName) => {
    let data: any = { id: id, listId: listId, taskId: taskId, subTaskId: subTaskId, subStatus: subStatus, editSubTaskName: editSubTaskName, token: this.token };
    this.todoService.undoUpdateSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.undosubupdate(this.receiverName+ " Undo Sub Updated "+ this.editTaskName+ " on "+this.listName + " Lists");
          this.allTasks = [];
          this.pageTasks = 1;
          this.getAllUserTask(listId);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Updated List.")
      }
    );//end subcribe
  }//end undoUpdateSubTask

  public undosubstatusDone = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.undostatussubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.undostatussubTaskData(data);
    }
  }

  public undosubstatusNotification = () => {
    this.socketService.undostatussubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Undo Sub Status Updated Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public undoStatusSubTask = (id, listId, taskId, subTaskId, subTaskName, editSubTaskStatus) => {
    let data: any = { id: id, listId: listId, taskId: taskId, subTaskId: subTaskId, subTaskName: subTaskName, editSubTaskStatus: editSubTaskStatus, token: this.token };
    this.todoService.undoStatusSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
         this.undosubstatusDone(this.receiverName+ " "+ apiResponse.message);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to undo the Status Task.")
      }
    );//end subcribe
  }//end undoStatusSubTask



  /* Manging sub Task */
  public subcreate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.createsubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.createsubTaskData(data);
    }
  }

  public subcreateNotification = () => {
    this.socketService.createsubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Sub Task Created Sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }
  
  public createNewUserSubTask = () => {
    let data: any = {
      taskId: this.taskId,
      subTaskName: this.subTaskName,
      token: this.token
    };
    this.todoService.createNewSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.subcreate(this.receiverName+ " Created a New Sub Task "+ this.subTaskName +" on " +this.listName + " Lists");
        }
        else {
          this.toastr.info(apiResponse.message);
        }
        this.taskName = "";
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Create New Sub Task.")
      }
    );//end subcribe
  }//end createNewSubTask
  
  public subdelete = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.deletesubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.deletesubTaskData(data);
    }
  }

  public subdeleteNotification = () => {
    this.socketService.deletesubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Task Deleted sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public deletedUserSubTask = (listId, taskId, subTaskId, subTaskName, subStatus) => {
    let data: any = { taskId: taskId, subTaskId: subTaskId, subTaskName: subTaskName, subStatus: subStatus, token: this.token };
    this.todoService.deletedSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.subdelete(this.receiverName+ " Deleted " + subTaskName + " Sub Task");
          this.pageTasks = 1;
          this.allTasks = [];
          this.getAllUserTask(listId);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to Deleted Sub Task.")
      }
    );//end subcribe
  }//end deletedUserTask
  
  public subupdate = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.updatesubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.updatesubTaskData(data);
    }
  }

  public subupdateNotification = () => {
    this.socketService.updatesubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Sub Task Updated sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public updatedUserSubTask = (listId, taskId, subTaskId) => {
    if (this.editSubTaskName.length === 0 || this.editSubTaskName.match(/^ *$/) !== null) {
      this.toastr.info("Sub Task name can't be empty");
    }
    else {
      let data: any = {
        taskId: taskId,
        subTaskId: subTaskId,
        subTaskName: this.editSubTaskName.toUpperCase(),
        editSubTaskName: this.oldSubTaskName,
        token: this.token
      };
      this.todoService.updatedSubTask(data).subscribe(
        (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
          if (apiResponse.status == 200) {
            this.subupdate(this.receiverName+ "sub task updated " + this.oldSubTaskName +" to " +this.editSubTaskName+ " on "+this.listName + " Lists");
            this.cancelEditSubTaskData();
          }
          else {
            this.toastr.info(apiResponse.message);
          }
        }
        ,
        (error) => {
          console.log(error);
          this.toastr.error("Error!", "Unable to updated Sub Task.")
        }
      );//end subcribe
    }
  }//end updatedUserSubTask

  public substatus = (msg) => {
    if(this.shareFriendId === undefined || this.shareFriendId === '' || this.shareFriendId === null) 
      {
        let data = {
          sender_id: this.shareUserId,
          receiver_id: this.shareUserId, 
          message: msg
        }
        this.socketService.statussubTaskData(data);
      }else{
    let data = {
      sender_id: this.shareUserId,
      receiver_id: this.shareFriendId, 
      message: msg
    }
    this.socketService.statussubTaskData(data);
    }
  }

  public substatusNotification = () => {
    this.socketService.statussubTaskResponse().subscribe((response) => {
      this.pageTasks = 1;
      this.allTasks = [];
      this.getAllUserTask(this.listId);
      if((response.sender_id === this.shareUserId)){
        this.toastr.success("Sub Status Updated sucessfully");
      }
      else{
        this.toastr.success(response.message);}
    })
  }

  public markDoneSubTask = (listId, taskId, subTaskId, subTaskName) => {
    let data: any = { listId: listId, taskId: taskId, subTaskId: subTaskId, subTaskName: subTaskName.toUpperCase(), status: "done", token: this.token };
    this.todoService.statusSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.substatus(this.receiverName+ " Mark done on " + subTaskName + " Task");
          this.pageTasks = 1;
          this.allTasks = [];
          this.getAllUserTask(listId);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to mark Done Sub Task.")
      }
    );//end subcribe
  }

  public markOpenSubTask = (listId, taskId, subTaskId, subTaskName) => {
    let data: any = { listId: listId, taskId: taskId, subTaskId: subTaskId, subTaskName: subTaskName.toUpperCase(), status: "open", token: this.token };
    this.todoService.statusSubTask(data).subscribe(
      (apiResponse) => {this.ballLoader.show(); setTimeout(() => { this.ballLoader.hide(); }, 2000);
        if (apiResponse.status == 200) {
          this.substatus(this.receiverName+ " Mark open again on " + subTaskName + " Task");
          this.pageTasks = 1;
          this.allTasks = [];
          this.getAllUserTask(listId);
        }
        else {
          this.toastr.info(apiResponse.message);
        }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to mark Open Sub tasks.")
      }
    );//end subcribe
  }

  public setSubTaskData = (taskId) => {
    this.subTaskName = "";
    this.taskId = taskId;
  }

  public setEditSubTaskData = (subTaskId, subTaskName) => {
    this.editSubTaskId = subTaskId;
    this.editSubTaskName = subTaskName;
    this.oldSubTaskName = subTaskName;
  }

  public cancelEditSubTaskData = () => {
    this.editSubTaskId = "";
    this.editSubTaskName = "";
  }

  /* send using keypress */

  public sendUsingKeypress: any = (event: any, listId: string) => {
    if (event.keyCode === 13) {
      // 13 is keycode of enter.
      this.createNewUserTask(listId);
    }
  };

  
  public sendUsingKeypressEditTask: any = (event: any, listId: string, taskId: string) => {
    if (event.keyCode === 13) {
      // 13 is keycode of enter.
      this.updatedUserTask(listId, taskId);
    }
  };

  public sendUsingKeypressEditSubTask: any = (event: any, listId: string, taskId: string,subTaskId :string) => {
    if (event.keyCode === 13) {
      // 13 is keycode of enter.
      this.updatedUserSubTask(listId, taskId,subTaskId);
    }
  };

  public checkName = (array: any, key: string, value: string) => {
    return array.filter((object) => {
      return object[key].toUpperCase() == value.toUpperCase();
    });
  };

  public deleteNotify = (msg) => {
    this.toastr.info(msg);
  }


  public getAllNotification : any = () => {
    let data: any = { userId: this.userId,pageNo:1,authToken:this.token};
    this.notificationService.getAllNotification(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
            this.countUnreadMsg = 0;
            for (let i = 0; i < apiResponse.data.docs.length; i++) {
              if(apiResponse.data.docs[i].status === 0){
                this.countUnreadMsg =this.countUnreadMsg +1;
              }
            }
          }
      }
      ,
      (error) => {
        console.log(error);
        this.toastr.error("Error!", "Unable to get Notification.")
      }
    );//end subcribe
  }
   //method to do undo using keyboard
   @HostListener('document:keydown', ['$event'])
   handleKeyboardEvent(event: KeyboardEvent) {
     if (event.metaKey && event.key == 'z' || event.ctrlKey && event.key == 'z') {
       if (this.listId) {
         this.undoTask(this.listId);
       }
       else {
         this.toastr.info("Select the List");
       }
     }
}
}