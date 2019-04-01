const mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('./../libs/timeLib');
const shortid = require('shortid');
const _ = require('lodash');
/* Models */
const UserModel = mongoose.model('User');

let getAllUnFriends = (req, res) => {

    let getfriendId = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId is missing', "friendController:getAllUnFriends.getfriendId", 10);
                let apiResponse = response.generate(true, "userId is missing", 400, null);
                reject(apiResponse);
            } else {
                UserModel.findOne({
                        userId: req.params.userId
                    })
                    .select('friends')
                    .sort( { 'friends' : 1 })
                    .lean()
                    .exec((err, userDetails) => {
                        if (err) {
                            logger.error("Unable to find User", "friendController: getAllUnFriends.getfriendId", 10);
                            let apiResponse = response.generate(true, "Unable to find user", 400, null);
                            reject(apiResponse);
                        } else if (check.isEmpty(userDetails)) {
                            logger.error("User Not Found", "friendController: getAllUnFriends.getfriendId", 10);
                            let apiResponse = response.generate(true, "User Not Found", 400, null);
                            reject(apiResponse);
                        } else {
                            let obj = userDetails.friends;
                            let count = Object.keys(obj).length;
                            let result = [];
                            for (let i = 0; i < count; i++) {
                                result = result.concat(obj[i].friendId);
                            }
                            result = result.concat(req.params.userId);
                            resolve(result);
                        }
                    }); //end Promise 
            } //end getfriendId
        });
    }

    let getUnFriendList = (friendId) => {
        return new Promise((resolve, reject) => {
            let pageNo = parseInt(req.query.pageNo);
            let size = parseInt(req.query.size);
            let search = req.query.query;
            let query;
            /*  let queryArr = search.split(' ');
              if (queryArr.length === 2) {
                  first_name = queryArr[0];
                  last_name = queryArr[1];
              } else {
                  first_name = search;
              }
              let fullName={$concat: [
                  [first_name, " ",last_name],
              ]};*/
            let Id = friendId.toString().split(",").join("\",\"");
            if (search === undefined || search === '' || search === null) {
                query = {
                    $and: [{
                            "active": "true"
                        },
                        {
                            "userId": {
                                "$not": {
                                    "$in": [Id]
                                }
                            }
                        }
                    ]
                };
            } else {
                query = {
                    $and: [{
                        "active": "true"
                    }, {
                        "userId": {
                            "$not": {
                                "$in": [Id]
                            }
                        }
                    }, {
                        '$or':[
                        {"firstName": { $regex: search ,$options :'i'}},
                        {"lastName": { $regex: search ,$options :'i'}}
                        ]
                    }]
                };
            }
            if (pageNo < 0 || pageNo === 0) {
                logger.info('invalid page number, should start with 1', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'invalid page number, should start with 1', 404, null)
                res.send(apiResponse)
            }
            let options = {
                select: 'firstName lastName email mobileNumber userId -_id',
                sort: {
                    firstName: 1,
                    lastName: 1
                },
                lean: true,
                offset: size * (pageNo - 1),
                limit: size
            };
            query = JSON.stringify(query);
            query = query.replace(/\\/g, "");
            query = JSON.parse(query);
            UserModel.paginate(query, options).then(function (result) {
                if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: getAllUser')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info('Found Friend', 'User Controller: getAllUser')
                    resolve(result)
                }
            });
        });
    } // end get all users

    getfriendId(req, res)
        .then(getUnFriendList)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Get All Un Friend Active User Details", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });
} // end get all Recieved

let getAllRecieved = (req, res) => {

    let getfriendId = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId is missing', "friendController:getAllRecieved.getfriendId", 10);
                let apiResponse = response.generate(true, "userId is missing", 400, null);
                reject(apiResponse);
            } else {
                UserModel
                    .aggregate([{
                            $match: {
                                userId: req.params.userId
                            }
                        },
                        {
                            $project: {
                                friends: {
                                    $filter: {
                                        input: "$friends",
                                        as: "friend",
                                        cond: {
                                            $eq: ["$$friend.status", 4]
                                        }
                                    }
                                }
                            }
                        }
                    ])
                    .exec((err, userDetails) => {
                        if (err) {
                            logger.error("Unable to find User", "friendController: getAllRecieved.getfriendId", 10);
                            let apiResponse = response.generate(true, "Unable to find friends", 400, null);
                            reject(apiResponse);
                        } else if (check.isEmpty(userDetails)) {
                            logger.error("User Not Found", "friendController: getAllRecieved.getfriendId", 10);
                            let apiResponse = response.generate(true, "friend Not Found", 400, null);
                            reject(apiResponse);
                        } else {
                            let userId = _.map(userDetails, 'friends');
                            let count = Object.keys(userId[0]).length;
                            let result = [];
                            for (let i = 0; i < count; i++) {
                                result = result.concat(userId[0][i].friendId);
                            }
                            resolve(result);
                        }
                    }); //end find
            }
        }); //end Promise
    } //end getfriendId

    let getRecieved = (friendId) => {
        return new Promise((resolve, reject) => {
            let query = {
                "userId": friendId
            };

            let pageNo = parseInt(req.query.pageNo);
            let size = parseInt(req.query.size);
            if (pageNo < 0 || pageNo === 0) {
                logger.info('invalid page number, should start with 1', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'invalid page number, should start with 1', 404, null)
                reject(apiResponse)
            }
            let options = {
                select: 'firstName lastName email mobileNumber userId -_id',
                lean: true,
                offset: size * (pageNo - 1),
                limit: size
            };

            UserModel.paginate(query, options).then(function (result) {

                if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: getAllUser')
                    let apiResponse = response.generate(true, 'No Recieved Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Found Friend received', 200, result)
                    resolve(result)
                }
            });
        });
    }
    getfriendId(req, res)
        .then(getRecieved)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Friend received request updated", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });
} // end get all Recieved

let getAllSender = (req, res) => {
    let getfriendId = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId is missing', "friendController:getAllRecieved.getfriendId", 10);
                let apiResponse = response.generate(true, "userId is missing", 400, null);
                reject(apiResponse);
            } else {
                UserModel
                    .aggregate([{
                            $match: {
                                userId: req.params.userId
                            }
                        },
                        {
                            $project: {
                                friends: {
                                    $filter: {
                                        input: "$friends",
                                        as: "friend",
                                        cond: {
                                            $eq: ["$$friend.status", 0]
                                        }
                                    }
                                }
                            }
                        }
                    ])
                    .exec((err, userDetails) => {
                        if (err) {
                            logger.error("Unable to find User", "friendController: getAllRecieved.getfriendId", 10);
                            let apiResponse = response.generate(true, "Unable to find friends", 400, null);
                            reject(apiResponse);
                        } else if (check.isEmpty(userDetails)) {
                            logger.error("User Not Found", "friendController: getAllRecieved.getfriendId", 10);
                            let apiResponse = response.generate(true, "friend Not Found", 400, null);
                            reject(apiResponse);
                        } else {
                            let userId = _.map(userDetails, 'friends');
                            let count = Object.keys(userId[0]).length;
                            let result = [];
                            for (let i = 0; i < count; i++) {
                                result = result.concat(userId[0][i].friendId);
                            }
                            resolve(result);
                        }
                    }); //end find
            }
        }); //end Promise
    } //end checkUser

    let getRecieved = (friendId) => {
        return new Promise((resolve, reject) => {
            let query = {
                "userId": friendId
            };

            let pageNo = parseInt(req.query.pageNo);
            let size = parseInt(req.query.size);
            if (pageNo < 0 || pageNo === 0) {
                logger.info('invalid page number, should start with 1', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'invalid page number, should start with 1', 404, null)
                reject(apiResponse)
            }
            let options = {
                select: 'firstName lastName email mobileNumber userId -_id',
                lean: true,
                offset: size * (pageNo - 1),
                limit: size
            };

            UserModel.paginate(query, options).then(function (result) {

                if (check.isEmpty(result)) {
                    logger.info('No User Found', 'User Controller: getAllUser')
                    let apiResponse = response.generate(true, 'No Recieved Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info('User Found', 'User Controller: getAllUser')
                    resolve(result)
                }
            });
        });
    }
    getfriendId(req, res)
        .then(getRecieved)
        .then((resolve) => {
            let apiResponse = response.generate(false, "Friend sended request updated", 200, resolve);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            res.send(err);
        });
} // end get all users

let sendRequest = (req, res) => {

    let checkUser = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userId)) {
                logger.info('userId is missing', "friendController:sendRequest.checkUser", 10);
                let apiResponse = response.generate(true, "userId is missing", 400, null);
                reject(apiResponse);
            } else {
                UserModel.findOne({
                    userId: req.body.userId
                }, (err, userDetails) => {
                    if (err) {
                        logger.error("Unable to find User", "friendController: sendRequest.checkUser", 10);
                        let apiResponse = response.generate(true, "Unable to find user", 400, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(userDetails)) {
                        logger.error("User Not Found", "friendController: sendRequest.checkUser", 10);
                        let apiResponse = response.generate(true, "User Not Found", 400, null);
                        reject(apiResponse);
                    } else {
                        let user = userDetails.toObject();
                        resolve(user);
                    }
                }) //end find
            }
        }); //end Promise
    } //end checkUser

    let checkFriend = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.friendId)) {
                logger.info('friendId is missing', "friendController:sendRequest.checkFriend", 10);
                let apiResponse = response.generate(true, "friendId is missing", 400, null);
                reject(apiResponse);
            } else {
                UserModel.findOne({
                    userId: req.body.friendId
                }, (err, friend) => {
                    if (err) {
                        logger.error("Unable to find friend", "friendController: sendRequest.checkFriend", 10);
                        let apiResponse = response.generate(true, "Unable to find friend", 400, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(friend)) {
                        logger.error("Friend Not Found", "friendController: sendRequest.checkFriend", 10);
                        let apiResponse = response.generate(true, "Friend Not Found", 400, null);
                        reject(apiResponse);
                    } else {
                        let friendDetails = friend.toObject();
                        if (req.body.status == 0) {
                            if (userDetails.friends.findIndex(x => x.friendId == req.body.friendId && x.status == 0) != -1) {
                                logger.error("You have received a request earlier", "friendController: sendRequest.checkFriend", 10);
                                let apiResponse = response.generate(true, "Friend request already sented", 305, null);
                                reject(apiResponse);
                            } else if (friendDetails.friends.findIndex(x => x.friendId == req.body.userId && x.status == 4) != -1) {
                                logger.error("You have received a sent earlier", "friendController: sendRequest.checkFriend", 10);
                                let apiResponse = response.generate(true, "Friend request already Received", 305, null);
                                reject(apiResponse);
                            } else {
                                resolve([userDetails, friendDetails]);
                            }
                        } else {
                            resolve([userDetails, friendDetails]);
                        }
                    }
                });
            }
        });
    } //end checkFriend

    let updateReceiverFriend = (allDetails) => {

        return new Promise((resolve, reject) => {

            let userFullName = allDetails[0].firstName + " " + allDetails[0].lastName;
            let query;


            let newFriend = {
                friendId: req.body.userId,
                fullName: userFullName,
                email: allDetails[0].email,
                mobileNumber: allDetails[0].mobileNumber,
                status: 4,
                updatedOn: time.now()
            }

            if (req.body.status == 0) {
                let options = {
                    $push: {
                        friends: {
                            $each: [newFriend]
                        }
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.friendId
                }, options);
            } else if (req.body.status == 5) {
                let options = {
                    $pull: {
                        friends: {
                            friendId: req.body.userId
                        }
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.friendId
                }, options);
            } else {
                let options = {
                    $set: {
                        'friends.$.status': req.body.status,
                        'friends.$.updatedOn': time.now()
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.friendId,
                    'friends.friendId': req.body.userId
                }, options);
            }
            query.exec((err, result) => {
                if (err) {
                    console.log(err);
                    logger.error(err.message, 'Friend Controller:updateReceiverFriend', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Received', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller: updateReceiverFriend')
                    let apiResponse = response.generate(true, 'Received not Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(allDetails)
                }
           // }
            });
        }); //end promise
    } //updateReceiverFriend

    let updateSenderFriend = (allDetails) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.status)) {
                logger.info('Status is missing', "friendController:sendRequest.checkStatus", 10);
                let apiResponse = response.generate(true, "Status is missing", 400, null);
                reject(apiResponse);
            }
            let fullName = allDetails[1].firstName + " " + allDetails[1].lastName;

            let newFriend = {
                friendId: req.body.friendId,
                fullName: fullName,
                email: allDetails[1].email,
                mobileNumber: allDetails[1].mobileNumber,
                status: req.body.status,
                updatedOn: time.now()
            }

            let query;
            if (req.body.status == 0) {
                let options = {
                    $push: {
                        friends: {
                            $each: [newFriend]
                        }
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.userId
                }, options);
            } else if (req.body.status == 5) {
                let options = {
                    $pull: {
                        friends: {
                            friendId: req.body.friendId
                        }
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.userId
                }, options);
            } else {
                let options = {
                    $set: {
                        'friends.$.status': req.body.status,
                        'friends.$.updatedOn': time.now()
                    }
                }
                query = UserModel.updateOne({
                    'userId': req.body.userId,
                    'friends.friendId': req.body.friendId
                }, options)
            }
            query.exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:sendRequest.updateSenderFriend', 10)
                    let apiResponse = response.generate(true, 'Failed To update Sender Friend', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller:sendRequest.updateSenderFriend')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let query= UserModel.findOne({userId: req.body.userId}).select('-password -_id -__v'); 
                    query.exec( (err, userDetails) => {
                        if (err) {
                            console.log(err);
                            logger.error(err.message, 'Friend Controller:updateReceiverFriend', 10)
                            let apiResponse = response.generate(true, 'Failed To Update Received', 500, null)
                            reject(apiResponse)
                        } 
                        resolve(userDetails)
                    });
                }
            });
                    // let apiResponse = response.generate(false, 'Updated Sender with sent requests', 200, result)
        }); //end promise
    } //end updateSenderFriend

    checkUser(req, res)
        .then(checkFriend)
        .then(updateReceiverFriend)
        .then(updateSenderFriend)
        .then((allDetails) => {
            let apiResponse = response.generate(false, "Friend received request updated", 200, allDetails);
            res.status(200);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.status(err.status);
            console.log("err\n" + err);
            res.send(err);
        });
} //end sendRequest



module.exports = {
    getAllUnFriends: getAllUnFriends,
    getAllRecieved: getAllRecieved,
    getAllSender: getAllSender,
    sendRequest: sendRequest
}