const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;
    // defining routes.


    // params: firstName, lastName, email, countryName,mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup api for user SignUp.
     *
     * @apiParam {string} firstName First Name of the user. (body) (required)
     * 
     * @apiParam {string} lastName Last Name of the user. (body) (required)
     * 
     * @apiParam {string} email email of the user. (body) (required)
     * 
     * @apiParam {string} password password of the user. (body) (required)
     * 
     * @apiParam {string} countryName countryName of the user. (body) (required)
     * 
     * @apiParam {Number} mobileNumber Mobile Number of the user with code. (body) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
    {
        "error": false,
        "message": "User created",
        "status": 200,
        "data": {
            "firstName": " sample",
            "lastName": " testing3",
            "email": "sample3@testing.com",
            "countryName": " Iceland",
            "mobileNumber": " 3541234567890",
            "secretToken": "JBxWpz",
            "active": false,
            "createdOn": "2019-01-13T06:38:02.000Z",
            "updatedOn": "2019-01-13T06:38:02.000Z",
            "_id": "5c3adcca38e31bb382d71afd",
            "userId": "klzdR-1Xx",
            "friends": [],
            "__v": 0
        }
    }
    *  @apiErrorExample {json} Error-Response:
    *
    {
        "error": true,
        "message": "User Already Present With this Email",
        "status": 403,
        "data": null
    }
    */

    // params: secretToken
    app.post(`${baseUrl}/verify`, userController.verifyLink);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/verify api for user activation.
     *  
     * @apiParam {secretToken} SecretToken for verify. (body) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
     * {
            "error": false,
            "message": "Verify Mail sent Successfully",
            "status": 200,
            "data": {
                "firstName": " sample",
                "lastName": " testing3",
                "email": "sample3@testing.com",
                "countryName": " Iceland",
                "mobileNumber": " 3541234567890",
                "secretToken": "JBxWpz",
                "active": false,
                "createdOn": "2019-01-13T06:38:02.000Z",
                "updatedOn": "2019-01-13T06:38:02.000Z",
                "userId": "klzdR-1Xx",
                "friends": []
            }
        }
     * {
            "error": true,
            "message": "Token is not valid,try again",
            "status": 500,
            "data": null
        }       
     */ 
     
    
    
     // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
        * @apiGroup users
        * @apiVersion  1.0.0
        * @api {post} /api/v1/users/login api for user login.
        *
        * @apiParam {string} email email of the user. (body params) (required)
        * 
        * @apiParam {string} password password of the user. (body params) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImprNGh1VU56SyIsImlhdCI6MTU0NzM2MzIyNTE0NCwiZXhwIjoxNTQ3NDQ5NjI1LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJ0by1kbyIsImRhdGEiOnsiZmlyc3ROYW1lIjoiIHNhbXBsZSIsImxhc3ROYW1lIjoiIHRlc3RpbmczIiwiZW1haWwiOiJzYW1wbGUzQHRlc3RpbmcuY29tIiwiY291bnRyeU5hbWUiOiIgSWNlbGFuZCIsIm1vYmlsZU51bWJlciI6IiAzNTQxMjM0NTY3ODkwIiwic2VjcmV0VG9rZW4iOiIiLCJhY3RpdmUiOnRydWUsInVwZGF0ZWRPbiI6IjIwMTktMDEtMTNUMDY6Mzg6MDIuMDAwWiIsInVzZXJJZCI6ImtsemRSLTFYeCIsImZyaWVuZHMiOltdfX0.u3NgtO0O3ZzUhlKuVyc9lntMq9-eWXhg23AnGDpT3Fg",
                "userDetails": {
                                    "firstName": " sample",
                                    "lastName": " testing3",
                                    "email": "sample3@testing.com",
                                    "countryName": " Iceland",
                                    "mobileNumber": " 3541234567890",
                                    "secretToken": "",
                                    "active": true,
                                    "updatedOn": "2019-01-13T06:38:02.000Z",
                                    "userId": "klzdR-1Xx",
                                    "friends": []
                                    }
                        }
            }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": "Password is incorrect",
                "status": 500,
                "data": null
            }  
       */

       //params : email
    app.post(`${baseUrl}/forgotPassword`, userController.sendResetLink);
    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {get} /api/v1/users/forgotPassword to send an reset email to user.
         *
         * @apiParam {string} email email of the user. (body) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "User Details Found",
                     "status": 200,
                    "data": "Mail sent successfully"
                }       
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": "email is missing",
                "status": 500,
                "data": null
            }       
        */

    // params: userId, password.
    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);

    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/resetPassword to Reset the password of user with request in the mail.
         *
         * @apiParam {string} userId Id of the user. (body) (required)
         * @apiParam {string} password New password of the user. (body) (required)
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Mail sent Successfully",
                    "status": 200,
                    "data": "Password reset successfull"
                }
        *  @apiErrorExample {json} Error-Response:
        *
        *  {
                "error": true,
                "message": "No user Details Found",
                "status": 500,
                "data": null
            }     
        */



    //params: userId,authToken
    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
    /**
         * @apiGroup users
         * @apiVersion  1.0.0
         * @api {post} /api/v1/users/logout to logout user.
         *
         * @apiParam {string} userId userId of the user. (body) (required)
         *
         * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
         *       
         * @apiSuccess {object} myResponse shows error status, message, http status code, result.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": true,
                "message": "User logged Out",
                "status": 200,
                "data": {
                    "n": 0,
                    "ok": 1
                }
            }
          *  @apiErrorExample {json} Error-Response:
          *
          * {
                "error": true,
                "message": "Invalid Or Expired AuthorizationKey",
                "status": 404,
                "data": null
            }           
     */
    
     // params: userId,firstName, lastName, countryName,mobileNumber,authToken
    app.post(`${baseUrl}/editUser/:userId`, auth.isAuthorized, userController.editUser);
     /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/editUser/:userId api for user editUser.
     * 
     * @apiParam {string} userId userId of the user. (params) (required)
     *
     * @apiParam {string} firstName First Name of the user. (body) (required)
     * 
     * @apiParam {string} lastName Last Name of the user. (body) (required)
     * 
     * @apiParam {string} countryName countryName of the user. (body) (required)
     * 
     * @apiParam {Number} mobileNumber Mobile Number of the user with code. (body) (required)
     * 
     * @apiParam {string} authToken authToken of user for authorization. (route / body / query / header params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     * 
        {
            "error": false,
            "message": "User details edited",
            "status": 200,
            "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                    }
       }
     * @apiErrorExample {json} Error-Response:
    
        {
            "error": true,
            "message": "AuthorizationToken Is Missing In Request",
            "status": 400,
            "data": null
        }
    */
    
    //param:userId ,password,authToken
     app.post(`${baseUrl}/changePassword/:userId`, auth.isAuthorized, userController.changePassword);
    /**
        * @apiGroup users
        * @apiVersion  1.0.0
        * @api {post} /api/v1/changePassword/:userId api for change Password.
        *
        * @apiParam {string} userId userId of the user. (body) (required)
        * 
        * @apiParam {string} password password of the user. (body) (required)
        *
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
         {
                "error": false,
                "message": "Password Updated Successfully",
                "status": 200,
                "data": {
                        "n": 0,
                        "nModified": 0,
                        "ok": 1
                        }
        }
        * @apiErrorExample {json} Error-Response:
            {
                "error": true,
                "message": "Password is missing",
                "status": 500,
                "data": null
            }
          */  
         
    app.get(`${baseUrl}/getAllFriendList/:userId`, auth.isAuthorized, userController.getAllFriendList);
     /**
        * @apiGroup users
        * @apiVersion  1.0.0
        * @api {get} /api/v1/getAllFriendList/:userId api for get All FriendList
        *
        * @apiParam {string} userId userId of the user. (body) (required)
        * 
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Friends Found",
            "status": 200,
            "data": {
            "friends": [
            {
                "friendId": "Q4BCMBZDV",
                "fullName": "sathya  testing1",
                "email": "demo@testing.com",
                "mobileNumber": " 3541234567890",
                "status": 1,
                "updatedOn": "2019-01-13T12:46:39.000Z"
            }
        ]
            }
        }
        * @apiErrorExample {json} Error-Response:
    
        {
            "error": true,
            "message": "AuthorizationToken Is Missing In Request",
            "status": 400,
            "data": null
        }
    */

}