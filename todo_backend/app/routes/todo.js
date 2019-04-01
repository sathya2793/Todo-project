const express = require('express');
const router = express.Router();

const todoController = require("./../controllers/todoController");
const appConfig = require("./../../config/appConfig")

const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    //params : userId,listName,creator,visibility,authToken
    app.post(`${baseUrl}/lists/createList`, auth.isAuthorized, todoController.createList);
    /**
     * @apiGroup Todo lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/createList To create list.
     *
     * @apiParam {string} userId UserId of the user. (body) (required)
     * 
     * @apiParam {string} listName List name of the list. (body) (required)
     * 
     * @apiParam {string} creator Name of the list creator. (body) (required)
     * 
     * @apiParam {string} visiblilty Public or Private. (body) (required)
     * 
     * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
     *  
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
    "error": false,
    "message": "TO-Do-List created successfully",
    "status": 200,
    "data": {
        "createdOn": "2019-01-11T08:35:59.000Z",
        "modifiedOn": "2019-01-11T08:35:59.000Z",
        "_id": "5c3af86f77f2bab4f708da7f",
        "listId": "xBBMGfk1J",
        "listName": "BOOK",
        "userId": "klzdR-1Xx",
        "creator": "sathya",
        "visibility": "public",
        "task": [],
        "history": [],
        "__v": 0
    }
}
     @apiErrorExample {json} Error-Response:
     {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}
    */

    //params:userId,authToken
    app.get(`${baseUrl}/lists/allUserLists/:userId`, todoController.getAllUserLists);

    /**
     * @apiGroup Todo lists
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/allUserLists/:userId To get all list using userId.
     *
     * @apiParam {string} userId UserId of the user. (params)  (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
      {
    "error": false,
    "message": "List found",
    "status": 200,
    "data": [
        {
            "createdOn": "2019-01-11T08:35:59.000Z",
            "modifiedOn": "2019-01-11T08:35:59.000Z",
            "listId": "xBBMGfk1J",
            "listName": "BOOK",
            "userId": "klzdR-1Xx",
            "creator": "sathya",
            "visibility": "public",
            "task": []
        }
    ]
}
        @apiErrorExample {json} Error-Response:
         
{
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}
    */

    //params:listId,authToken
    app.post(baseUrl + '/lists/deleteList/:listId', auth.isAuthorized, todoController.deleteList);
    /**
     * @apiGroup Todo lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/deleteList/:listId To deleted list.
     *
     * @apiParam {string} listId listId of the list. (params)  (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
   {
    "error": false,
    "message": "List Deleted",
    "status": 200,
    "data": {
        "n": 1,
        "ok": 1
    }
}
        @apiErrorExample {json} Error-Response:
         *
              {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}

*/
    //params:listId,listName,creator,visibility
    app.put(`${baseUrl}/lists/editList/:listId`, auth.isAuthorized, todoController.editList);

    /**
     * @apiGroup Todo lists
     * @apiVersion  1.0.0
     * @api {put} /api/v1/lists/editList/:listId To updated list.
     *
     * @apiParam {string} listId listId of the user. (params)  (required)
     * 
     * @apiParam {string} listName List name of the list. (body)  (required)
     * 
     * @apiParam {string} creator Name of the list creator. (body) (required)
     * 
     * @apiParam {string} visiblilty Public or Private. (body params)  (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
    {
    "error": false,
    "message": "List details edited/updated successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
        @apiErrorExample {json} Error-Response:
        {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}
    */

    //params:listId,authToken
    app.get(`${baseUrl}/tasks/allUserTasks/:listId`, auth.isAuthorized, todoController.getAllTasks);
    /**
         * @apiGroup Tasks
         * @apiVersion  1.0.0
         * @api {get} /api/v1/tasks/allUserTasks/:listId To get all Task
         *
         * @apiParam {string} listId listId of the List. (params) (required)
         * 
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "List found",
    "status": 200,
    "data": [
        {
            "createdOn": "2019-01-13T09:34:54.000Z",
            "modifiedOn": "2019-01-13T09:34:54.000Z",
            "listId": "ZwVm4FOAP",
            "listName": "BOOK",
            "userId": "Q4BCMBZDV",
            "creator": "sathya  testing1",
            "visibility": "public",
            "task": [
                {
                    "taskId": "ZQeUPbls2",
                    "taskName": "Large pot",
                    "status": "done",
                    "createdOn": "2019-01-13T09:37:04.000Z",
                    "modifiedOn": "2019-01-13T09:41:15.000Z",
                    "subTask": []
                }
            ]
        }
    ]
}
         @apiErrorExample {json} Error-Response:
 {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}

    */


    //params:listId,taskName,authToken
    app.post(`${baseUrl}/tasks/createTask`, auth.isAuthorized, todoController.createTask);
    /**
         * @apiGroup Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/createTask To create a new Task
         *
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} TaskName Task name for the list. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "Task created successfully",
                "status": 200,
                "data": {
                        "n": 1,
                        "nModified": 1,
                        "ok": 1
            }
            }
          @apiErrorExample {json} Error-Response:
          {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}
    */

    //params:listId,taskId,taskName,editTaskName,authToken
    app.put(`${baseUrl}/tasks/editTask`, auth.isAuthorized, todoController.editTask);
    /**
         * @apiGroup Tasks
         * @apiVersion  1.0.0
         * @api {put} /api/v1/tasks/editTask To edit the Task
         *
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} taskName taskName of the task. (body) (required)
         * 
         * @apiParam {string} editTaskName New Task name for the task. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "Task details edited/updated successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
          {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}
    */

    //params:listId,taskId,taskName,status,authToken
    app.post(`${baseUrl}/tasks/deleteTask`, auth.isAuthorized, todoController.deleteTask);
    /**
         * @apiGroup Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/deleteTask To deleted the Task
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} taskName taskName of the task. (body) (required)
         * 
         * @apiParam {string} status status of the task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "Task Deleted",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
          {
    "error": true,
    "message": "AuthorizationToken Is Missing In Request",
    "status": 400,
    "data": null
}

    */

    //params:listId,taskId,taskName,status,authToken
    app.post(`${baseUrl}/tasks/updateTaskStatus`, auth.isAuthorized, todoController.statusTask);
    /**
         * @apiGroup Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/updateTaskStatus To updated status in Task
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} taskName taskName of the task. (body) (required)
         * 
         * @apiParam {string} status status of the task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "updated task status successfully",
                "status": 200,
                "data": {
                        "n": 1,
                        "nModified": 1,
                        "ok": 1
            }
        }
         @apiErrorExample {json} Error-Response:
          {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }


    */


    //params:taskId,subTaskName,authToken
    app.post(`${baseUrl}/tasks/createSubTask`, auth.isAuthorized, todoController.createSubTask);
    /**
         * @apiGroup Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/createSubTask To create a sub Task
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} subtaskName subtaskName of the task. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "Sub Task created successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
{
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:taskId,subTaskId,subTaskName,editsubTaskName,authToken
    app.put(`${baseUrl}/tasks/editSubTask`, auth.isAuthorized, todoController.editSubTask);
    /**
         * @apiGroup Sub-Task
         * @apiVersion  1.0.0
         * @api {put} /api/v1/tasks/editSubTask To edit sub Task updated 
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} editsubTaskName update a new sub task name (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "Sub Task updated successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:taskId,subTaskId,subTaskName,subStatus,authToken
    app.post(`${baseUrl}/tasks/deleteSubTask`, auth.isAuthorized, todoController.deleteSubTask);
    /**
         * @apiGroup Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/deleteSubTask To delete sub Task
         * 
         * @apiParam {string} taskId taskId of the List. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} subStatus status of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
        {
    "error": false,
    "message": "Sub Task Deleted",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:taskId,subTaskId,subTaskName,subStatus,authToken
    app.post(`${baseUrl}/tasks/updateSubTaskStatus`, auth.isAuthorized, todoController.statusSubTask);
    /**
         * @apiGroup Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/updateSubTaskStatus To edit subTask status updated 
         * 
         * @apiParam {string} taskId taskId of the List. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} subStatus status of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
    "error": false,
    "message": "Sub Task updated successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:listId,authToken
    app.get(`${baseUrl}/tasks/undoTasks/:listId`, auth.isAuthorized, todoController.getUndoTasks);
    /**
         * @apiGroup Undo Tasks
         * @apiVersion  1.0.0
         * @api {get} /api/v1/tasks/undoTasks/:listId To get undo Task 
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "undo successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Task found",
        "status": 200,
        "data": {
            "id": "ZDTrULsAt",
            "taskId": "4M2IemCVp",
            "taskName": "HARRY1",
            "editTaskName": "HARRY",
            "action": "Edit Task",
            "status": "open",
            "editStatus": "",
            "subTaskId": "",
            "subTaskName": "",
            "editSubTaskName": "",
            "subStatus": "open",
            "editSubStatus": "",
            "modifiedOn": "2019-01-13T11:16:16.000Z",
            "used": "undone"
        }
    }
}
        @apiErrorExample {json} Error-Response:
    {
           "error": true,
           "message": "AuthorizationToken Is Missing In Request",
           "status": 400,
            "data": null
   }

    */

    //params:id,listId,taskId,taskName,status,authToken
    app.post(`${baseUrl}/tasks/undoDeleteTask`, auth.isAuthorized, todoController.undoDeleteTask);
    /**
         * @apiGroup Undo Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoDeleteTask To undo deleted Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} taskName taskName of the task. (body) (required)
         * 
         * @apiParam {string} status status of the task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Task created successfully",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
         @apiErrorExample {json} Error-Response:
    {
           "error": true,
           "message": "AuthorizationToken Is Missing In Request",
           "status": 400,
            "data": null
   }

    */
    //params:id,listId,taskId,authToken
    app.post(`${baseUrl}/tasks/undoCreateTask`, auth.isAuthorized, todoController.undoCreateTask);
    /**
         * @apiGroup Undo Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoCreateTask To undo the create the Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Task deleted successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Task Deleted",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
    @apiErrorExample {json} Error-Response:
    {
           "error": true,
           "message": "AuthorizationToken Is Missing In Request",
           "status": 400,
            "data": null
   }

    */
    //params:id,listId,taskId,taskName,editTaskName,authToken
    app.post(`${baseUrl}/tasks/undoUpdateTask`, auth.isAuthorized, todoController.undoUpdateTask);
    /**
         * @apiGroup Undo Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoUpdateTask To undo the updated Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} taskName taskName of the task. (body) (required)
         * 
         * @apiParam {string} editTaskName new editTaskName of the task. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
          {
    "error": false,
    "message": "Task Updated successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Task Updated",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
    @apiErrorExample {json} Error-Response:
    {
           "error": true,
           "message": "AuthorizationToken Is Missing In Request",
           "status": 400,
            "data": null
   }

    */
    //params:id,listId,taskId,editStatus,authToken
    app.post(`${baseUrl}/tasks/undoStatusTask`, auth.isAuthorized, todoController.undoStatusTask);
    /**
         * @apiGroup Undo Tasks
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/updateTaskStatus undo status Task updated
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the List. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the task. (body) (required)
         * 
         * @apiParam {string} editStatus new editStatus of the task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Task status updated",
    "status": 200,
    "data": {
        "error": false,
        "message": "Task Updated",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
    @apiErrorExample {json} Error-Response:
    {
           "error": true,
           "message": "AuthorizationToken Is Missing In Request",
           "status": 400,
            "data": null
   }

    */



    //params:id,listId,taskId,subTaskId,subTaskName,subStatus,authToken
    app.post(`${baseUrl}/tasks/undoDeleteSubTask`, auth.isAuthorized, todoController.undoDeleteSubTask);
    /**
         * @apiGroup Undo Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoDeleteSubTask To undo delete sub Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the task. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the subtask. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} subStatus status of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Sub Task created successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Sub Task created",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
  @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:id,listId,taskId,subTaskId,subTaskName,subStatus,authToken
    app.post(`${baseUrl}/tasks/undoCreateSubTask`, auth.isAuthorized, todoController.undoCreateSubTask);
    /**
         * @apiGroup Undo Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/tasks/undoCreateSubTask To undo create sub Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the task. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the subtask. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} subStatus status of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
          {
        "error": false,
        "message": "Sub Task deleted successfully",
        "status": 200,
        "data": {
            "error": false,
            "message": "Sub Task Deleted",
            "status": 200,
            "data": {
                "n": 1,
                "nModified": 1,
                "ok": 1
            }
        }
    }   
    @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

  
         */

    //params:id,listId,taskId,subTaskId,editSubTaskName,subStatus,authToken
    app.post(`${baseUrl}/tasks/undoUpdateSubTask`, auth.isAuthorized, todoController.undoUpdateSubTask);
    /**
         * @apiGroup Undo Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoUpdateSubTask To undo update sub Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the task. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the subtask. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} editsubTaskName old subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} subStatus status of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Sub Task created successfully",
    "status": 200,
    "data": {
        "error": false,
        "message": "Sub Task created",
        "status": 200,
        "data": {
            "n": 1,
            "nModified": 1,
            "ok": 1
        }
    }
}
  @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }

         */

    //params:id,listId,taskId,subTaskId,subTaskName,editSubStatus,authToken
    app.post(`${baseUrl}/tasks/undoStatusSubTask`, auth.isAuthorized, todoController.undoStatusSubTask);
    /**
         * @apiGroup Undo Sub-Task
         * @apiVersion  1.0.0
         * @api {post} /api/v1/tasks/undoStatusSubTask To undo update status of sub Task
         * 
         * @apiParam {string} id id of the history list. (body) (required)
         * 
         * @apiParam {string} listId listId of the task. (body) (required)
         * 
         * @apiParam {string} taskId taskId of the subtask. (body) (required)
         * 
         * @apiParam {string} subTaskId subtaskId of the task. (body) (required)
         * 
         * @apiParam {string} subTaskName old subtaskName of the task. (body) (required)
         * 
         * @apiParam {string} editSubStatus new status  value of the sub task either "done || open" (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *   
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
         {
    "error": false,
    "message": "Sub Task status updated",
    "status": 200,
    "data": {
        "n": 1,
        "nModified": 1,
        "ok": 1
    }
}
  @apiErrorExample {json} Error-Response:
         {
                "error": true,
                "message": "AuthorizationToken Is Missing In Request",
                "status": 400,
                 "data": null
        }
         */

} // end of setRouter