const express = require('express');
const router = express.Router();
const notificationController = require("./../../app/controllers/notificationController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
module.exports.setRouter = (app) => {
 let baseUrl = `${appConfig.apiVersion}/notification`;
 // defining routes.

 // params:userId
 app.get(`${baseUrl}/getAllNotification/:userId`, auth.isAuthorized, notificationController.getAllNotification);
 /**
  * @apiGroup Notification
  * @apiVersion  1.0.0
  * @api {get} /api/v1/notification/getAllNotification/:userId To Get All Notification by userId.
  *
  * @apiParam {string} userId userId of the Notification. (params) (required)
  * 
  * @apiParam {string} pageNo pageNo always start with one. (query) (required)
  * 
  * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
  * 
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
     {
         "error": false,
         "message": "User Notification Found",
         "status": 200,
         "data": {
             "docs": [
                     {
                         "sender_id": "oUaNrwVBc",
                         "receiver_id": "D7SXzxKlU",
                         "message": "Sathya Narayanan Send Your a Friend Request",
                         "status": 0,
                         "category": "friend",
                         "Id": "rQzsdu9aR",
                         "created_at": "2019-01-13T01:10:44.000Z"
                     }
                 ],
         "total": 1,
         "limit": 10,
         "offset": 0
         }
     }       
  *  @apiErrorExample {json} Error-Response:
     {
         "error": true,
         "message": "AuthorizationToken Is Missing In Request",
         "status": 400,
         "data": null
     }
  */

 //params:Id
 app.post(`${baseUrl}/statusNotification`, auth.isAuthorized, notificationController.statusNotification);
 /**
  * @apiGroup Notification
  * @apiVersion  1.0.0
  * @api {post} /api/v1/notification/statusNotification To update status Notification by Id.
  *
  * @apiParam {string} Id Id of the Notification List. (body) (required)
  * 
  * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
  * 
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
     {
          "error": false,
          "message": "Notification Updated",
          "status": 200,
          "data": {
                     "n": 1,
                     "nModified": 1,
                     "ok": 1
                 }
     }
  *  @apiErrorExample {json} Error-Response:
     {
         "error": true,
         "message": "Id is missing",
         "status": 400,
         data": null
     }
  */

 //params:Id
 app.post(`${baseUrl}/closedNotification`, auth.isAuthorized, notificationController.closedNotification);
 /**
   * @apiGroup Notification
   * @apiVersion  1.0.0
   * @api {post} /api/v1/notification/closedNotification To deleted Notification by Id.
   *
   * @apiParam {string} Id Id of the Notification List. (body) (required)
   * 
   * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
   * 
   * @apiSuccess {object} myResponse shows error status, message, http status code, result.
   * 
   * @apiSuccessExample {object} Success-Response:
      {
          "error": false,
          "message": "Deleted Sucessfully",
          "status": 200,
          "data": {
                      "n": 1,
                      "ok": 1
                  }
      }
   *  @apiErrorExample {json} Error-Response:
      {
          "error": true,
          "message": "Id is missing",
          "status": 400,
          data": null
      }
   */
}