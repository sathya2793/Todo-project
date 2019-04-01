import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class SocketService {

  private url = 'https://todobackend.sathyainfotechpro.com';
  private socket;

  constructor(public http: HttpClient) {
    // connection is being created i.e handshake
    this.socket = io(this.url);
    console.log("socket connected");
  }

  public verifyUser = () =>{
    return Observable.create((observer)=>{
      this.socket.on("verify-user",(socketData)=>{
        console.log("verify-user");
        observer.next(socketData)
      })
    })
  }//end verify user

  public setUser = (token) => {
    console.log("set-user called");
    this.socket.emit("set-user", token);
  }//end set user

  public onlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on("onlineUsersTodoList", (userList) => {
        console.log("get onlineUsersTodoList");
        observer.next(userList);
      }); // end Socket
    }); // end Observable
  } // end onlineUserList


  //Task Changes Notification

  public createTaskData=(data)=>{
    this.socket.emit("createRequest",data);
    console.log("createTaskData");
  }//end acceptData

  public createTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("create-Task-Response",(data)=>{
        console.log("create-Task-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public deleteTaskData=(data)=>{
    this.socket.emit("deleteRequest",data);
    console.log("deleteTaskData");
  }//end acceptData

  public deleteTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("delete-Task-Response",(data)=>{
        console.log("delete-Task-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public updateTaskData=(data)=>{
    this.socket.emit("updateRequest",data);
    console.log("updateTaskData");
  }//end acceptData

  public updateTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("update-Task-Response",(data)=>{
        console.log("update-Task-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public statusTaskData=(data)=>{
    this.socket.emit("statusRequest",data);
    console.log("statusTaskData");
  }//end acceptData

  public statusTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("status-Task-Response",(data)=>{
        console.log("status-Task-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

    //Undo Task Changes Notification

    public undocreateTaskData=(data)=>{
      this.socket.emit("undocreateRequest",data);
      console.log("undocreateTaskData");
    }//end undocreateTaskData
  
    public undocreateTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undocreate-Task-Response",(data)=>{
          console.log("undocreate-Task-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end undocreateTaskResponse
  
    public undodeleteTaskData=(data)=>{
      this.socket.emit("undodeleteRequest",data);
      console.log("undodeleteTaskData");
    }//end acceptData
  
    public undodeleteTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undodelete-Task-Response",(data)=>{
          console.log("undodelete-Task-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse
  
    public undoupdateTaskData=(data)=>{
      this.socket.emit("undoupdateRequest",data);
      console.log("undoupdateTaskData");
    }//end acceptData
  
    public undoupdateTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undoupdate-Task-Response",(data)=>{
          console.log("undoupdate-Task-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse
  
    public undostatusTaskData=(data)=>{
      this.socket.emit("undostatusRequest",data);
      console.log("undostatusTaskData");
    }//end acceptData
  
    public undostatusTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undostatus-Task-Response",(data)=>{
          console.log("undostatus-Task-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse

    //


    //SubTask Changes Notification

  public createsubTaskData=(data)=>{
    this.socket.emit("subcreateRequest",data);
    console.log("createTaskData");
  }//end acceptData

  public createsubTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("create-subTask-Response",(data)=>{
        console.log("create-subTask-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public deletesubTaskData=(data)=>{
    this.socket.emit("subdeleteRequest",data);
    console.log("subdeleteTaskData");
  }//end acceptData

  public deletesubTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("delete-subTask-Response",(data)=>{
        console.log("delete-subTask-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public updatesubTaskData=(data)=>{
    this.socket.emit("subupdateRequest",data);
    console.log("updatesubTaskData");
  }//end acceptData

  public updatesubTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("update-subTask-Response",(data)=>{
        console.log("update-subTask-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

  public statussubTaskData=(data)=>{
    this.socket.emit("substatusRequest",data);
    console.log("substatusTaskData");
  }//end acceptData

  public statussubTaskResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("status-subTask-Response",(data)=>{
        console.log("status-subTask-Response"+JSON.stringify(data));
        observer.next(data)
      })
    })
  }//end acceptResponse

    //Undo Task Changes Notification

    public undocreatesubTaskData=(data)=>{
      this.socket.emit("undosubcreateRequest",data);
      console.log("undosubcreateTaskData");
    }//end undocreateTaskData
  
    public undocreatesubTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undocreate-subTask-Response",(data)=>{
          console.log("undocreate-subTask-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end undocreateTaskResponse
  
    public undodeletesubTaskData=(data)=>{
      this.socket.emit("undosubdeleteRequest",data);
      console.log("undosubdeleteTaskData");
    }//end acceptData
  
    public undodeletesubTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undodelete-subTask-Response",(data)=>{
          console.log("undodelete-subTask-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse
  
    public undoupdatesubTaskData=(data)=>{
      this.socket.emit("undosubupdateRequest",data);
      console.log("undosubupdateTaskData");
    }//end acceptData
  
    public undoupdatesubTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undoupdate-subTask-Response",(data)=>{
          console.log("undoupdate-subTask-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse
  
    public undostatussubTaskData=(data)=>{
      this.socket.emit("undosubstatusRequest",data);
      console.log("undosubstatusTaskData");
    }//end acceptData
  
    public undostatussubTaskResponse=()=>{
      return Observable.create((observer)=>{
        this.socket.on("undostatus-subTask-Response",(data)=>{
          console.log("undostatus-subTask-Response"+JSON.stringify(data));
          observer.next(data)
        })
      })
    }//end acceptResponse


  //Friend Request Notification

  public acceptData=(data)=>{
    this.socket.emit("acceptRequest",data);
  }//end acceptData

  public acceptResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("accept-response",(data)=>{
        console.log("accept-response"+data);
        observer.next(data)
      })
    })
  }//end acceptResponse

  public rejectData=(data)=>{
    this.socket.emit("rejectRequest",data);
  }//end rejectData

  public rejectResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("reject-response",(data)=>{
        console.log("reject-response"+data);
        observer.next(data)
      })
    })
  }//end rejectResponse

  public sendedData=(data)=>{
    this.socket.emit("sendedRequest",data);
  }//end sendedData

  public sendedResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("sended-response",(data)=>{
        console.log("sended-response"+data);
        observer.next(data)
      })
    })
  }//end sendedResponse

  public receivedData=(data)=>{
    this.socket.emit("receivedRequest",data);
  }//end receivedData

  public receivedResponse=()=>{
    return Observable.create((observer)=>{
      this.socket.on("received-response",(data)=>{
        console.log("received-response"+data);
        observer.next(data)
      })
    })
  }// end receivedResponse

  public exitSocket = ()  => {
    this.socket.emit("disconnect", "");
  }

  public handleError = (err: HttpErrorResponse) => {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    } // end condition *if
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }  // END handleError

}
