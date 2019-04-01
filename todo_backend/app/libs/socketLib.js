/**
 * modules dependencies.
 */

const socketio = require('socket.io');
const tokenLib = require("./tokenLib.js");

const redisLib = require("./redisLib");
const events = require('events');
const mongoose = require('mongoose');
let NotificationModel = require('./../models/Notification');
mongoose.model('Notification');
const eventEmitter = new events.EventEmitter();
//let eventAlerts = {};
const shortid = require("shortid");

let setServer = (server) => {

    let io = socketio.listen(server);
    io.set('origins', '*:*');
    let myIo = io.of('/');
    myIo.on('connection', (socket) => {

        console.log("Connected to Socket: " + socket.id);

        //handshaking with user
        /**
         * @api {listen}/verifyUser Verification the init user
         * @apiVersion 0.0.1
         * @apiGroup Listen 
         *@apiDescription This event <b>("verify-user")</b> has to be listened on the user's end to verify user
        */
        socket.emit("verify-user", "");
      

        // code to verify the user and make him online
         /**
         * @api {emit} /set-user Setting user online
         * @apiVersion 0.0.1
         * @apiGroup Emit 
         *@apiDescription This event <b>("set-user")</b> has to be emitted when a user comes online.
         *@apiExample The following data has to be emitted
                        {
                            userId :string,
                            fullName: string
                        }
        */
        socket.on('set-user', (authToken) => {
            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', {
                        status: 500,
                        error: 'Please provide correct auth token'
                    })
                } else {
                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.id = currentUser.userId
                    let key = currentUser.userId.toString();
                    let value = `${currentUser.firstName} ${currentUser.lastName}`

                    redisLib.setANewOnlineUserInHash("onlineUsers", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.
                            redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(`${value} is online`);
                                    // socket.room ='todo'
                                    //socket.join(socket.room);
                                    //socket.to(socket.room).broadcast.emit("onlineUsersTodoList", result);
                                    socket.emit("onlineUsersTodoList", result);
                                }
                            })
                        }
                    })
                }
            })
        }) // end of listening set-user event

         //Task Request
         /**
         * @api {emit} /createRequest  Create New Task
         * @apiVersion 0.0.1
         * @apiGroup Task-Emit 
         *@apiDescription This event <b>("createRequest")</b> has to be emitted when a user create the task 
         *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("createRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-createRequest', data);
            }, 2000)
            io.of('/').emit("create-Task-Response", data);
        });
        /**
         * @api {emit} /deleteRequest Deleted the task
         * @apiVersion 0.0.1
         * @apiGroup Task-Emit 
         *@apiDescription This event <b>("deleteRequest")</b> has to be emitted when a user delete the task
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("deleteRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-deletedRequest', data);
            }, 2000)
        });
        /**
         * @api {emit} /updateRequest update the task
         * @apiVersion 0.0.1
         * @apiGroup Task-Emit 
         *@apiDescription This event <b>("updateRequest")</b> has to be emitted when a user update the task
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("updateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-updateRequest', data);
            }, 2000)
        });
        /**
         * @api {emit} /statusRequest  update the status for task
         * @apiVersion 0.0.1
         * @apiGroup Task-Emit 
         *@apiDescription This event <b>("statusRequest")</b> has to be emitted when a user update status updated on the task
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("statusRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-statusRequest', data);
            }, 2000)
        });

        //undo Task Request
         /**
         * @api {emit} /undocreateRequest undo create task
         * @apiVersion 0.0.1
         * @apiGroup undoTask-Emit 
         *@apiDescription This event <b>("undocreateRequest")</b> has to be emitted when a user to undo create the task
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undocreateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undocreateRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /undodeleteRequest undo delete task
         * @apiVersion 0.0.1
         * @apiGroup undoTask-Emit 
         *@apiDescription This event <b>("undodeleteRequest")</b> has to be emitted when a user to undo delete the task
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undodeleteRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undodeletedRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /undoupdateRequest undo update task
         * @apiVersion 0.0.1
         * @apiGroup undoTask-Emit 
         *@apiDescription This event <b>("undoupdateRequest")</b> has to be emitted when a user to undo update the task
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undoupdateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undoupdateRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /undostatusRequest  undo status for task
         * @apiVersion 0.0.1
         * @apiGroup undoTask-Emit 
         *@apiDescription This event <b>("undostatusRequest")</b> has to be emitted when a user to undo status updated on the task
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undostatusRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undostatusRequest', data);
            }, 2000)
        });

          // Sub Task Request
          /**
         * @api {emit} /subcreateRequest  sub task create
         * @apiVersion 0.0.1
         * @apiGroup subTask-Emit 
         *@apiDescription This event <b>("subcreateRequest")</b> has to be emitted when a user create the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
          socket.on("subcreateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-subcreateRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /subdeleteRequest for sub task deleted
         * @apiVersion 0.0.1
         * @apiGroup subTask-Emit 
         *@apiDescription This event <b>("subdeleteRequest")</b> has to be emitted when a user delete the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("subdeleteRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-subdeletedRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /subupdateRequest sub task update
         * @apiVersion 0.0.1
         * @apiGroup subTask-Emit 
         *@apiDescription This event <b>("subupdateRequest")</b> has to be emitted when a user updated the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("subupdateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-subupdateRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /substatusRequest sub task status update
         * @apiVersion 0.0.1
         * @apiGroup subTask-Emit 
         *@apiDescription This event <b>("substatusRequest")</b> has to be emitted when a user update the status on subtask
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("substatusRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-substatusRequest', data);
            }, 2000)
        });

        //undo Task Request
         /**
         * @api {emit} /undosubcreateRequest undo create sub task
         * @apiVersion 0.0.1
         * @apiGroup undoSubTask-Emit 
         *@apiDescription This event <b>("undosubcreateRequest")</b> has to be emitted when a user undo create the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undosubcreateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undosubcreateRequest', data);
            }, 2000)
        });
          /**
         * @api {emit} /undosubdeleteRequest undo delete sub task
         * @apiVersion 0.0.1
         * @apiGroup undoSubTask-Emit 
         *@apiDescription This event <b>("undosubdeleteRequest")</b> has to be emitted when a user undo delete the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undosubdeleteRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undosubdeletedRequest', data);
            }, 2000)
        });
          /**
         * @api {emit} /undosubupdateRequest undo update the sub task
         * @apiVersion 0.0.1
         * @apiGroup undoSubTask-Emit 
         *@apiDescription This event <b>("undosubupdateRequest")</b> has to be emitted when a user undo update on the subtask
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undosubupdateRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undosubupdateRequest', data);
            }, 2000)
        });
          /**
         * @api {emit} /undosubstatusRequest undo the sub task status
         * @apiVersion 0.0.1
         * @apiGroup undoSubTask-Emit 
         *@apiDescription This event <b>("undosubstatusRequest")</b> has to be emitted when a user undo status updated on the subtask
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("undosubstatusRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-undosubstatusRequest', data);
            }, 2000)
        });

        //Accepting Request
          /**
         * @api {emit} /acceptRequest Accept the friend
         * @apiVersion 0.0.1
         * @apiGroup friend-Emit 
         *@apiDescription This event <b>("acceptRequest")</b> has to be emitted when a user accepted the request
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("acceptRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-AcceptRequest', data);
            }, 2000)
        });
         /**
         * @api {emit} /rejectRequest Reject the friend request
         * @apiVersion 0.0.1
         * @apiGroup friend-Emit 
         *@apiDescription This event <b>("rejectRequest")</b> has to be emitted when a user rejected the request
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("rejectRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-RejectRequest', data);
            }, 2000)
        });
        /**
         * @api {emit} /sendedRequest send friend request
         * @apiVersion 0.0.1
         * @apiGroup friend-Emit 
         *@apiDescription This event <b>("sendedRequest")</b> has to be emitted when a user rejected the request
        *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("sendedRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-SendedRequest', data);
            }, 2000)
        });
        /**
         * @api {emit} /receivedRequest get friend request msg
         * @apiVersion 0.0.1
         * @apiGroup friend-Emit 
         *@apiDescription This event <b>("receivedRequest")</b> has to be emitted when a user received any request
       *@apiExample The following data has to be emitted
                        *{
                            Id: string,
                            sender_id: string,
                            receiver_id: string,
                            message: string,
                            category: string
                        }
                        */
        socket.on("receivedRequest", (data) => {
            // event to save Notification.
            setTimeout(function () {
                eventEmitter.emit('save-ReceivedRequest', data);
            }, 2000)
        });


          /**
         * @api {emit} /disconnect when user logout
         * @apiVersion 0.0.1
         * @apiGroup Emit 
         *@apiDescription This event <b>("disconnect")</b> has to be emitted when a user logout/closed the browser.
         *@apiExample The following data has to be emitted
                        *{
                            userId :string,
                            fullName: string
                        }
        */
        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel
            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.id);
            // var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            // allOnlineUsers.splice(removeIndex, 1)
            // console.log(allOnlineUsers)

            if (socket.id) {
                redisLib.deleteUserFromHash('onlineUsers', socket.id)
                redisLib.getAllUsersInAHash('onlineUsers', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        myIo.emit('onlineUsersTodoList', result);
                    }
                })
            }

        }) // end of on disconnect
    });

    // saving Notification to database. and findone to emit

    //Task Notify

    eventEmitter.on('save-createRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                })
                newNotify.save((err, final) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                    }
                })
            }
        });
    });

    eventEmitter.on('save-deletedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("delete-Task-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-updateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("update-Task-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-statusRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("status-Task-Response", data);
                    }
                })
            }
        });
    });

    //Undo Task Notify
    eventEmitter.on('save-undocreateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                })
                newNotify.save((err, final) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undocreate-Task-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undodeletedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undodelete-Task-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undoupdateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undoupdate-Task-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undostatusRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undostatus-Task-Response", data);
                    }
                })
            }
        });
    });

    //subTask Notify

    eventEmitter.on('save-subcreateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                })
                newNotify.save((err, final) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("create-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-subdeletedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("delete-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-subupdateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("update-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-substatusRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("status-subTask-Response", data);
                    }
                })
            }
        });
    });

    //Undo Task Notify
    eventEmitter.on('save-undosubcreateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                })
                newNotify.save((err, final) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undocreate-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undosubdeletedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undodelete-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undosubupdateRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undoupdate-subTask-Response", data);
                    }
                })
            }
        });
    });

    eventEmitter.on('save-undosubstatusRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "todo"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        io.of('/').emit("undostatus-subTask-Response", data);
                    }
                })
            }
        });
    }); 





    // Friend Emit
    eventEmitter.on('save-AcceptRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "friend"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        myIo.emit("accept-response", final);
                    }
                })
            }
        });

    });

    eventEmitter.on('save-RejectRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "friend"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        myIo.emit("reject-response", final);
                    }
                })
            }
        });

    });

    eventEmitter.on('save-SendedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "friend"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        myIo.emit("sended-response", final);
                    }
                })
            }
        });

    });

    eventEmitter.on('save-ReceivedRequest', (data) => {
        console.log("\n" + "called emit");
        let ID = shortid.generate();
        let newNotify = new NotificationModel({
            Id: ID,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            message: data.message,
            category: "friend"
        });
        newNotify.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("save" + JSON.stringify(result));
                NotificationModel.findOne({
                    "Id": ID
                }, (err, final) => {
                    console.log(ID);
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("\n\n" + "final" + JSON.stringify(final) + "\n\n");
                        myIo.emit("received-response", final);
                    }
                })
            }
        });

    });


}

module.exports = {
    setServer: setServer
}