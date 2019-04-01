import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private url = "https://todobackend.sathyainfotechpro.com/api/v1/users";
  deleteItem: any;
  deleteSubItem: any;

  constructor(public http: HttpClient) { }

  /*
     List related services 
  */

  //Getting All single User Todo List:
  public getAllList(data: any): Observable<any> {
    return this.http.get(`${this.url}/lists/allUserLists/${data.userId}?authToken=${data.token}`);
  }//end getAllList

  //Creating a new Todo List:
  public createNewList(data: any): Observable<any> {
    const params = new HttpParams()
      .set("userId", data.userId)
      .set("listName", data.listName)
      .set("creator", data.creator)
      .set("visibility", data.visibility)
    return this.http.post(`${this.url}/lists/createList?authToken=${data.token}`, params)
  }//end createNewList

  //Removing todo List:
  public deletedList(data: any): Observable<any> {
    return this.http.post(`${this.url}/lists/deleteList/${data.listId}?authToken=${data.token}`, null);
  }//end deletedList

  //Editing  todo List:
  public updatedList(data: any): Observable<any> {
    const params = new HttpParams()
      .set("listName", data.listName)
      .set("creator", data.creator)
      .set("visibility", data.visibility)
    return this.http.put(`${this.url}/lists/editList/${data.listId}?authToken=${data.token}`, params);
  }//end updatedList

  /*
    Tasks related services 
  */

  //Getting All single User Todo Tasks
  public getAllTasks(data: any): Observable<any> {
    return this.http.get(`${this.url}/tasks/allUserTasks/${data.listId}?authToken=${data.token}`);
  }//end getAllTasks

  //Create A New Task:
  public createNewTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("taskName", data.taskName)
    return this.http.post(`${this.url}/tasks/createTask?authToken=${data.token}`, params)
  }//end createNewTask


  //Delete A Task:
  public deletedTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("taskName", data.taskName)
      .set("status", data.status)
    return this.http.post(`${this.url}/tasks/deleteTask?authToken=${data.token}`, params);
  }//end deletedTask


  //Edit a Task
  public updatedTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("taskName", data.taskName)
      .set("editTaskName", data.editTaskName)
    return this.http.put(`${this.url}/tasks/editTask?authToken=${data.token}`, params)
  }//end updatedTask


  //Edit a statusTask
  public statusTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("taskName", data.taskName)
      .set("status", data.status)
    return this.http.post(`${this.url}/tasks/updateTaskStatus?authToken=${data.token}`, params);
  }//end tatusTask

  /*
    Tasks undo related services 
  */

  //undoTask
  public undoTask(data: any): Observable<any> {
    return this.http.get(`${this.url}/tasks/undoTasks/${data.listId}?authToken=${data.token}`);
  }//end undoTask

  // undoDeletedTask
  public undoDeletedTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("taskName", data.taskName)
      .set("status", data.status)
    return this.http.post(`${this.url}/tasks/undoDeleteTask?authToken=${data.token}`, params);
  }//end undoDeletedTask

  //undoCreateTask
  public undoCreateTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
    return this.http.post(`${this.url}/tasks/undoCreateTask?authToken=${data.token}`, params);
  }//end undoCreateTask

  //undoUpdateTask
  public undoUpdateTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("taskName", data.taskName)
      .set("editTaskName", data.editTaskName)
    return this.http.post(`${this.url}/tasks/undoUpdateTask?authToken=${data.token}`, params)
  }//end undoUpdateTask

  //undoStatusTask
  public undoStatusTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("editStatus", data.editStatus)
    return this.http.post(`${this.url}/tasks/undoStatusTask?authToken=${data.token}`, params)
  }//end undoStatusTask

  /*
    Sub Tasks related services 
  */

  //Create A New sub Task:
  public createNewSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("taskId", data.taskId)
      .set("subTaskName", data.subTaskName)
    return this.http.post(`${this.url}/tasks/createSubTask?authToken=${data.token}`, params)
  }//end createNewSubTask

  //Delete A sub Task:
  public deletedSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subTaskName", data.subTaskName)
      .set("subStatus", data.subStatus)
    return this.http.post(`${this.url}/tasks/deleteSubTask?authToken=${data.token}`, params);
  }//end deletedSubTask

  //Edit a sub Task
  public updatedSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subTaskName", data.subTaskName)
      .set("editSubTaskName",data.editSubTaskName)
    return this.http.put(`${this.url}/tasks/editSubTask?authToken=${data.token}`, params)
  }//end updatedSubTask

  //Edit a statusTask
  public statusSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subTaskName", data.subTaskName)
      .set("status", data.status)
    return this.http.post(`${this.url}/tasks/updateSubTaskStatus?authToken=${data.token}`, params);
  }//end statusSubTask 

  /*
    Sub Tasks undo related services 
  */

  // undoDeletedTask
  public undoDeletedSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subTaskName", data.subTaskName)
      .set("subStatus", data.subStatus)
    return this.http.post(`${this.url}/tasks/undoDeleteSubTask?authToken=${data.token}`, params);
  }//end undoDeletedSubTask

  //undoCreateTask
  public undoCreateSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subTaskName", data.subTaskName)
      .set("subStatus", data.subStatus)
    return this.http.post(`${this.url}/tasks/undoCreateSubTask?authToken=${data.token}`, params);
  }//end undoCreateSubTask

  //undoUpdateTask
  public undoUpdateSubTask(data: any): Observable<any> {
    const params = new HttpParams()
      .set("id", data.id)
      .set("listId", data.listId)
      .set("taskId", data.taskId)
      .set("subTaskId", data.subTaskId)
      .set("subStatus", data.subStatus)
      .set("editSubTaskName", data.editSubTaskName)
    return this.http.post(`${this.url}/tasks/undoUpdateSubTask?authToken=${data.token}`, params)
  }//end undoUpdateSubTask

  //undoStatusTask
  public undoStatusSubTask(data: any): Observable<any> {
    const params = new HttpParams()
    .set("id", data.id)
    .set("listId", data.listId)
    .set("taskId", data.taskId)
    .set("subTaskId", data.subTaskId)
    .set("editSubStatus", data.editSubTaskStatus)
    .set("subTaskName", data.subTaskName)
    return this.http.post(`${this.url}/tasks/undoStatusSubTask?authToken=${data.token}`, params)
  }//end undoStatusSubTask

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${
        err.message
        }`;
    } // end condition *if
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  } // end handleError

}
