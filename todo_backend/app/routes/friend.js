const express = require('express');
const router = express.Router();
const friendController = require("./../../app/controllers/friendController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
module.exports.setRouter = (app) => {

 let baseUrl = `${appConfig.apiVersion}/friends`;
 // defining routes.

 //param:userId,pageNo,size,search
 app.get(`${baseUrl}/getAllUnFriends/:userId`, friendController.getAllUnFriends);
 /** 
 * @apiGroup friends
 * @apiVersion  1.0.0
 * @api {get} /api/v1/friends/getAllUnFriends/:userId To Get All Un Friend List by userId.
 *
 * @apiParam {string} userId userId of the sender. (params) (required)
 * 
 * @apiParam {string} pageNo pageNo always start with one. (query) (required)
 * 
 * @apiParam {string} size size of the request (query) (optional)
 * 
 * @apiParam {string} search Search the friend using firstName or LastName (query) (optional)
 * 
 * @apiSuccess {object} myResponse shows error status, message, http status code, result.
 * 
 * @apiSuccessExample {object} Success-Response:
 * {
     "error": false,
     "message": "Get All Un Friend Active User Details",
     "status": 200,
     "data": {
         "docs": [
                     {   
                         "firstName": "kumar",
                         "lastName": "a",
                         "email": "sathya2793@gmail.com",
                         "mobileNumber": "911234567891",
                         "userId": "0lrbEfu72"
                     }
                 ],
             "total": 1,
             "limit": 10,
             "offset": 0
             }
     }
  * @apiErrorExample {json} Error-Response:
     {
         "error": true,
         "message": "User Not Found",
         "status": 400,
         "data": null
     }
 */

 //param:userId,pageNo,size,search
 app.get(`${baseUrl}/getAllRecieved/:userId`, friendController.getAllRecieved);
 /** 
    * @apiGroup friends
    * @apiVersion  1.0.0
    * @api {get} /api/v1/friends/getAllRecieved/:userId To Get All Recieved requested Friend List by userId.
    *
    * @apiParam {string} userId userId of the sender. (params) (required)
    * 
    * @apiParam {string} pageNo pageNo always start with one. (query) (required)
    * 
    * @apiParam {string} size size of the request (query) (optional)
    * 
    * @apiParam {string} search Search the friend using firstName or LastName (query) (optional)
    * 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    * {
        "error": false,
        "message": "Friend received request updated",
        "status": 200,
        "data": {
            "docs": [
                        {
                            "firstName": "kumar",
                            "lastName": "a",
                            "email": "sathya2793@gmail.com",
                            "mobileNumber": "911234567891",
                            "userId": "0lrbEfu72"
                        }
                    ],
                "total": 1,
                "limit": 10,
                "offset": 0
                }
        }
     * @apiErrorExample {json} Error-Response:
        {
            "error": true,
            "message": "friend Not Found",
            "status": 400,
            "data": null
        }
    */

 //param:userId,pageNo,size,search
 app.get(`${baseUrl}/getAllSender/:userId`, friendController.getAllSender);
 /** 
    * @apiGroup friends
    * @apiVersion  1.0.0
    * @api {get} /api/v1/friends/getAllSender/:userId To Get All Sended request by userId.
    *
    * @apiParam {string} userId userId of the sender. (params) (required)
    * 
    * @apiParam {string} pageNo pageNo always start with one. (query) (required)
    * 
    * @apiParam {string} size size of the request (query) (optional)
    * 
    * @apiParam {string} search Search the friend using firstName or LastName (query) (optional)
    *  
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    * {
        "error": false,
        "message": "Friend sended request updated",
        "status": 200,
        "data": {
            "docs": [
                        {
                            "firstName": "kumar",
                            "lastName": "a",
                            "email": "sathya2793@gmail.com",
                            "mobileNumber": "911234567891",
                            "userId": "0lrbEfu72"
                        }
                    ],
                "total": 1,
                "limit": 10,
                "offset": 0
                }
        }
     * @apiErrorExample {json} Error-Response:
       {
             "error": true,
             "message": "friend Not Found",
             "status": 400,
             "data": null
        }       
    */

 //params:userId,friendId,status
 app.post(`${baseUrl}/sendRequest`, auth.isAuthorized, friendController.sendRequest);
 /** 
    * @apiGroup friends
    * @apiVersion  1.0.0
    * @api {get} /api/v1/friends/sendRequest To send Friend request and received status.
    *
    * @apiParam {string} userId userId of the sender. (body) (required)
    * 
    * @apiParam {string} friendId friendId of the receiver (body) (required)
    * 
    * @apiParam {string} status Based on status it will update the request (body) (required)
    *  
    * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
    *  
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    *{
        "error": false,
        "message": "Friend received request updated",
        "status": 200,
        "data": {
            "firstName": " sample",
            "lastName": " testing1",
            "email": "sample1@testing.com",
            "countryName": " Iceland",
            "mobileNumber": " 3541234567890",
            "secretToken": "",
            "active": true,
            "createdOn": "2019-01-13T05:30:10.000Z",
            "updatedOn": "2019-01-13T05:31:17.000Z",
            "userId": "sZ08CTTe3",
            "friends": [
                {
                    "friendId": "owIhZKmtB",
                    "fullName": " sample  testing2",
                    "email": "sample2@testing.com",
                    "mobileNumber": " 3541234567890",
                    "status": 0,
                    "updatedOn": "2019-01-13T06:27:14.000Z"
                }
                        ]
        
    }   
     * @apiErrorExample {json} Error-Response:
       {
             "error": true,
             "message": "friend Not Found",
             "status": 400,
             "data": null
        }       
    */
}