const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('./../libs/tokenLib');
const mailer = require('./../libs/mailerLib');
const appConfig = require("../../config/appConfig");
const randomstring = require('randomstring');
const events = require('events');
const eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(100);
/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');
//Create an event handler:
let mailEventHandler = (data) => {
    console.log("mailEventHandler called for " + data.email);
    mailer.autoEmail(data.email, data.message, data.html);
}

//Assign the event handler to an event
eventEmitter.on('mail', mailEventHandler);


/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({
            'userId': req.params.userId
        })
        .select('-secretToken -active -createdOn -userId -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
} // end get single user

let editUser = (req, res) => {
    let options = req.body;
    UserModel.updateMany({
        'userId': req.params.userId
    }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    }); // end user model update
}// end edit user

// start user signup function 

let signUpFunction = (req, res) => {

    //check email and password regex
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email && req.body.password) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    } // end validate user input

    //save to db
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({
                    email: req.body.email
                })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        const secretToken = randomstring.generate(6);
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email.toLowerCase(),
                            countryName: req.body.countryName,
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            secretToken: secretToken,
                            createdOn: time.now(),
                            updatedOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                const html = `Hi ${newUserObj.firstName +" "+ newUserObj.lastName},<br/>Thank you for registering!<br/><br/>Please verify your email by typing the following token:<br/>Token: <b>${newUserObj.secretToken}</b><br/>On the following page:<a href="${appConfig.url}/verify">${appConfig.url}/verify</a><br/><br/>Have a pleasant day.`;
                                var details = {
                                    email: newUserObj.email,
                                    message: "Verify Link",
                                    html: html
                                };

                                setTimeout(() => {
                                    //Fire the 'mail' event:
                                    eventEmitter.emit('mail', details);
                                }, 2000);

                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    } // end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve);
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

} // end user signup function 

let verifyLink = (req, res) => {

    let validatetoken = () => {
        return new Promise((resolve, reject) => {
            if (req.body.secretToken) {
                resolve(req)
            } else {
                logger.error('Field Missing During verify token', 'userController: validatetoken()', 5)
                let apiResponse = response.generate(true, 'Token parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateToken = () => {
        return new Promise((resolve, reject) => {
            let query=UserModel.findOne({
                secretToken: req.body.secretToken
            }).select('-password -_id -__v');
            query.exec((err, userDetails) => {
                /* handle the error if the user is not found */
                if (err) {
                    logger.error('Failed to retrieve user Data', "userController: updateToken()", 10);
                    let apiResponse = response.generate(true, "failed to find the user with given secret Token", 500, null);
                    reject(apiResponse);
                } /* if company details is not found */
                else if (check.isEmpty(userDetails)) {
                    logger.error("No User Found", "userController: findUser()", 10);
                    let apiResponse = response.generate(true, "Token is not valid,try again", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("user found", "userController: findUser()", 10);
                    let updateUser = {
                        secretToken: '',
                        active: true
                    };
                    UserModel.updateOne({
                        'userId': userDetails.userId
                    }, updateUser).exec((err, newUser) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'User Controller:editUser', 10)
                            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
                            reject(apiResponse)
                        } else if (check.isEmpty(newUser)) {
                            logger.info('No User Found', 'User Controller: editUser')
                            let apiResponse = response.generate(true, 'No User Found', 404, null)
                            reject(apiResponse)
                        } else {
                            const html = `<h1>Welcome to My planner</h1>`;
                            var details = {
                                email: userDetails.email,
                                message: "welcome",
                                html: html
                            };
                            setTimeout(() => {
                                //Fire the 'mail' event:
                                eventEmitter.emit('mail', details);
                            }, 2000);

                            let apiResponse = response.generate(false, 'updated user', 200, null)
                            resolve(apiResponse)
                        }
                    });
                    resolve(userDetails);
                }
            });
        })
    }
    //end validatetoken()


    validatetoken(req, res)
        .then(updateToken)
        .then((message) => {
            let apiResponse = response.generate(false, "Verify Mail sent Successfully", 200, message);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
} // end verifyLink

let sendResetLink = (req, res) => {
    if (check.isEmpty(req.body.email)) {
        logger.error("email is missing", "UserController: sendResetLink", 10);
        let apiResponse = response.generate(true, "email is missing", 500, null);
        res.send(apiResponse);
    } else {
        UserModel.findOne({
            email: req.body.email
        }, (err, userDetails) => {
            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to retrieve user Data', "userController: sendResetLink", 10);
                let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                res.send(apiResponse);
            } /* if company details is not found */
            else if (check.isEmpty(userDetails)) {
                logger.error("No User Found", "userController: sendResetLink", 10);
                let apiResponse = response.generate(true, "No user Details Found", 500, null);
                res.send(apiResponse);
            } else {
                logger.info("user found", "userController: sendResetLink", 10);
                const html = `<a href='${appConfig.url}/reset-password/${userDetails.userId}'>click here to reset password</a>`;
                var details = {
                    email: req.body.email,
                    message: "Reset ur password Link",
                    html: html
                };
                setTimeout(() => {
                    //Fire the 'mail' event:
                    eventEmitter.emit('mail', details);
                }, 2000);

                let apiResponse = response.generate(false, "User Details Found", 200, "Mail sent successfully");
                res.send(apiResponse);
            }
        });
    }
} //sendResetLink


let resetPassword = (req, res) => {

    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.userId) {
                UserModel.findOne({
                    userId: req.body.userId
                }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: resetPassword.findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    } /* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: resetPassword.findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    } else {
                        logger.info("user found", "userController: resetPassword.findUser()", 10);
                        resolve(userDetails);
                    }
                });
            } else {
                let apiResponse = response.generate(true, "UserId parameter is missing", 500, null);
                reject(apiResponse);
            }
        });
    } //end findUser()

    let updatePassword = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.password)) {
                logger.error("password is missing", "UserController: resetPassword.updatePassword()", 10);
                let apiResponse = response.generate(true, "Password is missing", 500, null);
                reject(apiResponse);
            } else {
                UserModel.updateOne({
                    userId: req.body.userId
                }, {
                    password: passwordLib.hashpassword(req.body.password)
                }, {
                    multi: true
                }, (err, result) => {
                    if (err) {
                        logger.error("Failed to change Password ", "userController: resetPassword.updatePassword()", 10);
                        let apiResponse = response.generate(true, "Failed to change Password", 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        logger.error("User Not found", "userController: resetPassword.updatePassword()", 10);
                        let apiResponse = response.generate(true, "User not found", 500, null);
                        reject(apiResponse);
                    } else {
                        logger.info("Password updated", "userController: resetPassword.updatePassword()", 10);
                        const html = `<b> Hi ${userDetails.firstName + " " + userDetails.lastName}, your password has been changed succesfully</b>`;
                        var details = {
                            email: userDetails.email,
                            message: "Password updated sucessfully",
                            html: html
                        };
                        setTimeout(() => {
                            //Fire the 'mail' event:
                            eventEmitter.emit('mail', details);
                        }, 2000);
                        resolve("Password reset successfull");
                    }
                });
            }
        });
    } //end update password

    findUser(req, res)
        .then(updatePassword)
        .then((message) => {
            let apiResponse = response.generate(false, "Mail sent Successfully", 200, message);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });


} //end reset password

let changePassword = (req,res) =>{
            if (check.isEmpty(req.body.password)) {
                logger.error("password is missing", "UserController: changePassword", 10);
                let apiResponse = response.generate(true, "Password is missing", 500, null);
                res.send(apiResponse);
            } else {
                UserModel.updateOne({
                    userId: req.body.userId
                }, {
                    password: passwordLib.hashpassword(req.body.password)
                }, {
                    multi: true
                }, (err, result) => {

                    if (err) {
                        logger.error("Failed to change Password ", "userController: changePassword", 10);
                        let apiResponse = response.generate(true, "Failed to change Password", 500, null);
                        res.send(apiResponse);
                    } else if (check.isEmpty(result)) {
                        logger.error("User Not found", "userController: changePassword", 10);
                        let apiResponse = response.generate(true, "User not found", 500, null);
                        res.send(apiResponse);
                    } else {
                        logger.info("Password updated", "userController: changePassword", 10);
                        let apiResponse = response.generate(false, "Password Updated Successfully", 200,result);
                        res.status(200);
                        res.send(apiResponse);
                    }
                });
            }
} //end changePassword

// start of login function 
let loginFunction = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({
                    email: req.body.email
                }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    } /* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    } else {
                        logger.info("user found", "userController: findUser()", 10);
                        resolve(userDetails);
                    }
                });
            } else {
                let apiResponse = response.generate(true, "email parameter is missing", 500, null);
                reject(apiResponse);
            }
        });
    } //end findUser()

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    logger.error(err.message, "userController:ValidatePassword", 10);
                    let apiResponse = response.generate(true, "Login Failed", 500, null);
                    reject(apiResponse);
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password;
                    delete retrievedUserDetailsObj._id;
                    delete retrievedUserDetailsObj.__v;
                    delete retrievedUserDetailsObj.createdOn;
                    delete retrievedUserDetailsObj.modifiedOn;
                    resolve(retrievedUserDetailsObj);
                } else {
                    logger.info('login Failed due to invalid password', "userController: validatePassword", 10);
                    let apiResponse = response.generate(true, "Password is incorrect", 500, null);
                    reject(apiResponse);
                }
            });
        });
    } //end validateUser()

    let verifyEmail = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (!userDetails.active) {
                logger.info('login Failed due to not verify', "userController: verifyEmail", 10);
                let apiResponse = response.generate(true, "Sorry, you must validate email first", 500, null);
                reject(apiResponse);
            } else {
                logger.info("user verify the email", "userController: verifyEmail()", 10);
                resolve(userDetails);
            }
        });
    } // Check if email has been verified

    let updateTime = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(userDetails.updatedOn)) {
                logger.error("updatedOn is missing", "UserController: logIn", 10);
                let apiResponse = response.generate(true, "updatedOn is missing", 500, null);
                reject(apiResponse);
            } else {
                let options = {
                    'updatedOn': time.now()
                }
                UserModel.updateOne({
                    'email': req.body.email
                }, options).exec((err, result) => {
                    if (err) {
                        logger.error("Failed to update last time", "UserController: logIn", 10);
                        let apiResponse = response.generate(true, "Failed to login", 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        logger.error("updatedOn is empty in result", 10);
                        let apiResponse = response.generate(true, "updatedOn is empty in result", 500, null);
                        reject(apiResponse);
                    } else {
                        logger.info("updated last login time", "UserController: logIn", 10);
                        resolve(userDetails);
                    }
                });
            }
        })
    }// updated last logIn time

    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    let apiResponse = response.generate(true, "Failed to generate Token", 500, null);
                    reject(apiResponse);
                } else {
                    tokenDetails.userId = userDetails.userId;
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            });
        });
    } //end generateToken

    let saveToken = (tokenDetails) => {

        return new Promise((resolve, reject) => {
            AuthModel.findOne({
                userId: tokenDetails.userId
            }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, "userController: saveToken", 10);
                    let apiResponse = response.generate(true, "Failed To Generate Token", 500, null);
                    reject(apiResponse);
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    });
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, "userController: saveToken", 10);
                            let apiResponse = response.generate(true, "Failed To save Token", 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    });
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token;
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                    retrievedTokenDetails.tokenGenerationTime = time.now();

                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, "userController: saveToken", 10);
                            let apiResponse = response.generate(true, "Failed To Generate Token", 500, null);
                            reject(apiResponse);
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody);
                        }
                    });
                }
            });
        });
    } //end of saveToken()

    findUser(req, res)
        .then(validatePassword)
        .then(verifyEmail)
        .then(updateTime)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, "login Successful", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });

} // end of the login function 


let logout = (req, res) => {

    if (check.isEmpty(req.body.userId)) {
        logger.error("UserId is missing", "UserController: logOut", 10);
        let apiResponse = response.generate(true, "UserId is missing", 500, null);
        res.send(apiResponse);
    } else {
        AuthModel.deleteOne({
            userId: req.body.userId
        }, (err, result) => {
            if (err) {
                logger.error("Failed to logOut user", "UserController: logout", 10);
                let apiResponse = response.generate(true, "Failed to logOut user", 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                logger.error("Invalid AuthToken/ authToken expired", "UserController: logout", 10);
                let apiResponse = response.generate(true, "Invalid AuthToken/ authToken expired", 500, null);
                res.send(apiResponse);
            } else {
                logger.info("User Logged Out", "UserController: logout", 10);
                let apiResponse = response.generate(true, "User logged Out", 200, result);
                res.send(apiResponse);
            }
        });
    }
} // end of the logout function.

let getAllFriendList = (req, res) => {
    if (check.isEmpty(req.params.userId)) {
        logger.error("UserId is missing", "UserController: getAllFriendList", 10);
        let apiResponse = response.generate(true, "UserId is missing", 500, null);
        res.send(apiResponse);
    } else {
        UserModel.findOne({
            'userId': req.params.userId,
            'friends.status' : 1
        })
        .select('friends -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller:getAllFriendList', 10)
                let apiResponse = response.generate(true, 'Failed To Find Friends Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getAllFriendList')
                let apiResponse = response.generate(true, 'No Friends Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Friends Found', 200, result)
                res.send(apiResponse)
            }
        })
    }
} // end get All FriendList


module.exports = {
    getSingleUser: getSingleUser,
    editUser: editUser,
    signUpFunction: signUpFunction,
    verifyLink: verifyLink,
    loginFunction: loginFunction,
    logout: logout,
    sendResetLink: sendResetLink,
    resetPassword: resetPassword,
    changePassword: changePassword,
    getAllFriendList:getAllFriendList
} // end