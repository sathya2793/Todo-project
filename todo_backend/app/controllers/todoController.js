const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
//Libraries
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

//Models
const TodoModel = mongoose.model('TodoModel');


/**
 * function to create the List.
 */
let createList = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userId) && check.isEmpty(req.body.listName) && check.isEmpty(req.body.creator) && check.isEmpty(req.body.visibility)) {
                logger.error('Parameters Missing', 'createList:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let saveList = () => {
        return new Promise((resolve, reject) => {

            let newList = new TodoModel({
                listId: shortid.generate(),
                listName: req.body.listName.toUpperCase(),
                userId: req.body.userId,
                creator: req.body.creator,
                visibility: req.body.visibility,
                createdOn: time.now(),
                modifiedOn: time.now()
            }) // end new list model
            console.log("\n" + JSON.stringify(newList) + "\n");
            newList.save((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create list', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise


    } //end


    validateParams()
        .then(saveList)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'TO-Do-List created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
        })
} //end createList


/**
 * function to get lists of user.
 */
let getAllUserLists = (req, res) => {

    if (check.isEmpty(req.params.userId)) {
        logger.error("userId is missing", "List Controller: getAllUserLists", 10);
        let apiResponse = response.generate(true, "userId is missing", 500, null);
        reject(apiResponse);
    } else {
        TodoModel.find({
                userId: req.params.userId
            })
            .select('-_id -history -__v')
            .sort({
                'modifiedOn': -1
            })
            .lean()
            .exec((err, listDetails) => {
                /* handle the error if the user is not found */
                if (err) {
                    logger.error('Failed to find list', "List Controller: getAllUserLists", 10);
                    let apiResponse = response.generate(true, "failed to find the List", 500, null);
                    res.send(apiResponse);
                } /* if company details is not found */
                else if (check.isEmpty(listDetails)) {
                    logger.error("No List Found", "List Controller: getAllUserLists", 10);
                    let apiResponse = response.generate(true, "No List Found", 500, null);
                    res.send(apiResponse);
                } else {
                    logger.info("List found", "List Controller: getAllUserLists", 10);
                    let apiResponse = response.generate(false, "List found", 200, listDetails);
                    res.send(apiResponse);

                }

            });
    }

} //end getAllUserLists


/**
 * function to delete list using ListId.
 */
let deleteList = (req, res) => {
    TodoModel.remove({
        'listId': req.params.listId
    }, (err, result) => {
        if (err) {
            logger.error(`Error occured : ${err}`, 'Database', 10)
            let apiResponse = response.generate(true, 'Error Occured', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No List Found', 'List Controller : deleteList')
            let apiResponse = response.generate(true, 'No List Found', 404, null)
            res.send(apiResponse)
        } else {
            logger.info("List deleted", "List Controller : deleteList")
            let apiResponse = response.generate(false, 'List Deleted', 200, result)
            res.send(apiResponse)
        }
    })
} //end deleteList


/**
 * function to edit List using ListId.
 */
let editList = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listName) && check.isEmpty(req.body.creator) && check.isEmpty(req.body.visibility)) {
                logger.error('Parameters Missing', 'createList:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let updateList = () => {
        return new Promise((resolve, reject) => {
            let options = {
                listName: req.body.listName,
                creator: req.body.creator,
                visibility: req.body.visibility,
                modifiedOn: time.now()
            }
            console.log(options);
            TodoModel.updateOne({
                'listId': req.params.listId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to edit list', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No list Found', 'List Controller : editList')
                    let apiResponse = response.generate(true, 'No list Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result);
                }
            })
        })
    }

    validateParams()
        .then(updateList)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'List details edited/updated successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)

        })

} //end editList

/**
 * function to get Task of user.
 */
let getAllTasks = (req, res) => {

    if (check.isEmpty(req.params.listId)) {
        logger.error("userId is missing", "Task Controller: getAllTask", 10);
        let apiResponse = response.generate(true, "listId is missing", 500, null);
        res.send(apiResponse);
    } else {
        TodoModel.find({
                listId: req.params.listId
            })
            .select('-_id -history -__v')
            .sort({
                'task.modifiedOn': -1
            })
            .lean()
            .exec((err, taskDetails) => {
                /* handle the error if the user is not found */
                if (err) {
                    logger.error('Failed to find list', "Task Controller: getAllTask", 10);
                    let apiResponse = response.generate(true, "failed to find the List", 500, null);
                    res.send(apiResponse);
                } /* if company details is not found */
                else if (check.isEmpty(taskDetails)) {
                    logger.error("No List Found", "Task Controller: getAllTask", 10);
                    let apiResponse = response.generate(true, "No List Found", 500, null);
                    res.send(apiResponse);
                } else {
                    logger.info("List found", "Task Controller: getAllTask", 10);
                    let apiResponse = response.generate(false, "List found", 200, taskDetails);
                    res.send(apiResponse);
                }
            });
    }
} //end getAllUserTasks


/**
 * function to create the Task.
 */
let createTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId) && check.isEmpty(req.body.TaskName)) {
                logger.error('Parameters Missing', 'createTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let saveTask = () => {
        return new Promise((resolve, reject) => {
            let taskId = shortid.generate();
            let newTask = {
                taskId: taskId,
                taskName: req.body.taskName.toUpperCase(),
                createdOn: time.now(),
                modifiedOn: time.now()
            } // end new list model

            let newTask1 = {
                id: shortid.generate(),
                taskId: taskId,
                taskName: req.body.taskName.toUpperCase(),
                action: "New Task",
                createdOn: time.now(),
                modifiedOn: time.now()
            } // end new list model

            let options = {
                $push: {
                    task: {
                        $each: [newTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    },
                    history: {
                        $each: [newTask1],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }
            TodoModel.updateOne({
                'listId': req.body.listId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create list', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save
        }) //end promise   
    } //end
    validateParams()
        .then(saveTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end createList

/**
 * function to delete Task using TaskId.
 */
let deleteTask = (req, res) => {
    if (check.isEmpty(req.body.listId)) {
        logger.error("listId is missing", "Task Controller: deleteTask", 10);
        let apiResponse = response.generate(true, "listId is missing", 500, null);
        res.send(apiResponse);
    } else if (check.isEmpty(req.body.taskId)) {
        logger.error("taskId is missing", "Task Controller: deleteTask", 10);
        let apiResponse = response.generate(true, "taskId is missing", 500, null);
        res.send(apiResponse);
    } else {
        let newTask = {
            id: shortid.generate(),
            taskId: req.body.taskId,
            taskName: req.body.taskName,
            status: req.body.status,
            action: "Deleted Task",
            modifiedOn: time.now()
        } // end new Task model
        let options = {
            $pull: {
                task: {
                    taskId: req.body.taskId
                }
            },
            $push: {
                history: {
                    $each: [newTask],
                    $sort: {
                        modifiedOn: -1
                    }
                }
            }
        }
        query = TodoModel.updateOne({
            'listId': req.body.listId
        }, options);
        query.exec((err, result) => {
            if (err) {
                logger.error(`Error occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No List Found', 'Task Controller : deleteTask')
                let apiResponse = response.generate(true, 'No Task Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("List deleted", "Task Controller : deleteTask")
                let apiResponse = response.generate(false, 'Task Deleted', 200, result)
                res.send(apiResponse)
            }
        })
    }
} //end deleteTask

/**
 * function to edit Task using TaskId.
 */
let editTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId) && check.isEmpty(req.body.taskId) && check.isEmpty(req.body.taskName) && check.isEmpty(req.body.status)) {
                logger.error('Parameters Missing', 'editTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let updateTask = () => {
        return new Promise((resolve, reject) => {
            let newTask = {
                id: shortid.generate(),
                taskId: req.body.taskId,
                taskName: req.body.taskName,
                editTaskName: req.body.editTaskName,
                status: req.body.status,
                action: "Edit Task",
                modifiedOn: time.now()
            } // end new Task model
            let options = {
                $set: {
                    'task.$.taskName': req.body.taskName,
                    'task.$.modifiedOn': time.now()
                },
                $push: {
                    history: {
                        $each: [newTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }

            TodoModel.updateOne({
                'listId': req.body.listId,
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to  load Task list', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No list Found', 'Task Controller : editTask')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result);
                }
            })
        })
    }

    validateParams()
        .then(updateTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task details edited/updated successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)

        })

} //end editTask

/**
 * function to edit Task using TaskId.
 */
let statusTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId) && check.isEmpty(req.body.taskId) && check.isEmpty(req.body.taskName) && check.isEmpty(req.body.status)) {
                logger.error('Parameters Missing', 'statusTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let updateTask = () => {
        return new Promise((resolve, reject) => {
            let newTask;
            if (req.body.status === "done") {
                newTask = {
                    id: shortid.generate(),
                    taskId: req.body.taskId,
                    taskName: req.body.taskName,
                    status: req.body.status,
                    editStatus: "open",
                    action: "Status Update Task",
                    modifiedOn: time.now()
                } // end new Task model
            } else {
                newTask = {
                    id: shortid.generate(),
                    taskId: req.body.taskId,
                    taskName: req.body.taskName,
                    status: req.body.status,
                    editStatus: "done",
                    action: "Status Update Task",
                    modifiedOn: time.now()
                } // end new Task model
            }
            let options = {
                $set: {
                    'task.$.status': req.body.status,
                    'task.$.modifiedOn': time.now()
                },
                $push: {
                    history: {
                        $each: [newTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }

            TodoModel.updateMany({
                'listId': req.body.listId,
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to edit status task', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'status TaskController : updateTask')
                    let apiResponse = response.generate(true, 'No task Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result);
                }
            })
        })
    }


    validateParams()
        .then(updateTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'updated task status successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err);
            console.log("\n" + JSON.stringify(err) + "\n")
        })

} //end statusTask

/**
 * function to get undo Task using listId.
 */
let getUndoTasks = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.listId)) {
                logger.error('Parameters Missing', 'getUndoTasks:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'listId parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let getHistoryTask = () => {
        return new Promise((resolve, reject) => {
            TodoModel.find({
                    listId: req.params.listId
                })
                .select('history -_id')
                .lean()
                .exec((err, historyDetails) => {
                    if (err) {
                        logger.error('Failed to find History Task', "Task Controller: getUndoTasks", 10);
                        let apiResponse = response.generate(true, "failed to find the Task", 500, err);
                        reject(apiResponse);
                    } /* if History Details is not found */
                    else if (check.isEmpty(historyDetails[0].history)) {
                        logger.error("No List Found", "Task Controller: getUndoTasks", 10);
                        let apiResponse = response.generate(true, "No undo found!", 500, null);
                        reject(apiResponse);
                    } else {
                        logger.info("List found", "Task Controller: getUndoTasks", 10);
                        for (let i = 0; i < historyDetails[0].history.length; i++) {
                            if (historyDetails[0].history[i].used === "undone") {
                                let apiResponse = response.generate(false, "Task found", 200, historyDetails[0].history[i]);
                                i = historyDetails[0].history.length;
                                resolve(apiResponse);
                            }
                        }
                        let apiResponse = response.generate(true, "No undo found!", 200, null);
                        reject(apiResponse);
                    }
                });
        });
    }


    validateParams()
        .then(getHistoryTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'undo successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log("\n" + JSON.stringify(err) + "\n")
        })

} //end getUndoTasks

/**
 * function to delete undo Task using listId.
 */
let undoDeleteTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId) && check.isEmpty(req.body.TaskName)) {
                logger.error('Parameters Missing', 'undoDeleteTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {
                console.log("\n" + JSON.stringify(result) + "\n");
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to undo task', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No task Found to undo', 'Todo TaskController : undoDeleteTask.updatehistory')
                    let apiResponse = response.generate(true, 'No task Found to undo', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result);
                }
            })
        })
    }

    let saveTask = () => {
        return new Promise((resolve, reject) => {

            let newTask = {
                taskId: req.body.taskId,
                taskName: req.body.taskName,
                status: req.body.status,
                createdOn: time.now(),
                modifiedOn: time.now()
            } // end new list model

            let options = {
                $push: {
                    task: {
                        $each: [newTask]
                    }
                }
            }
            TodoModel.updateOne({
                'listId': req.body.listId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create list', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(saveTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoDeleteTask

/**
 * function to undo Create Task using TaskId.
 */
let undoCreateTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoCreateTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoCreateTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {
                console.log("\n" + JSON.stringify(result) + "\n");
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoCreateTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("history updated", "Task Controller : undoCreateTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let deleteTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    task: {
                        taskId: req.body.taskId
                    }
                }
            }
            TodoModel.updateOne({
                'listId': req.body.listId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoCreateTask.deleteTask')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("List deleted", "Task Controller : undoCreateTask.deleteTask")
                    let apiResponse = response.generate(false, 'Task Deleted', 200, result)
                    resolve(apiResponse)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(deleteTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task deleted successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoCreateTask

/**
 * function to undo update Task using TaskId.
 */
let undoUpdateTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoUpdateTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoUpdateTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoUpdateTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("history updated", "Task Controller : undoUpdateTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let updateTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'task.$.taskName': req.body.editTaskName,
                    'task.$.modifiedOn': time.now()
                }
            }
            TodoModel.updateOne({
                'listId': req.body.listId,
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoUpdateTask.updateTask')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Task updated", "Task Controller : undoUpdateTask.updateTask")
                    let apiResponse = response.generate(false, 'Task Updated', 200, result)
                    resolve(apiResponse)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(updateTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task Updated successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoUpdateTask

/**
 * function to undo status Task using TaskId.
 */
let undoStatusTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoStatusTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoStatusTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoStatusTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("status updated", "Task Controller : undoStatusTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let updateTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'task.$.status': req.body.editStatus,
                    'task.$.modifiedOn': time.now()
                }
            }
            TodoModel.updateOne({
                'listId': req.body.listId,
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoStatusTask.updateTask')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Task updated", "Task Controller : undoStatusTask.updateTask")
                    let apiResponse = response.generate(false, 'Task Updated', 200, result)
                    resolve(apiResponse)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(updateTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Task status updated', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoStatusTask

/**
 * function to create the sub Task.
 */
let createSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.taskId) && check.isEmpty(req.body.subTaskName)) {
                logger.error('Parameters Missing', 'createSubTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let saveSubTask = () => {
        return new Promise((resolve, reject) => {
            let subTaskId = shortid.generate();
            let newSubTask = {
                subTaskId: subTaskId,
                subTaskName: req.body.subTaskName.toUpperCase(),
                modifiedOn: time.now()
            } // end newSubTask
            let newHistoryTask = {
                id: shortid.generate(),
                taskId: req.body.taskId,
                subTaskId: subTaskId,
                subTaskName: req.body.subTaskName.toUpperCase(),
                action: "New Sub Task",
                modifiedOn: time.now()
            } // end newHistoryTask
            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    },
                    history: {
                        $each: [newHistoryTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create sub Task', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise


    } //end


    validateParams()
        .then(saveSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })


} //end createSubTask


/**
 * function to delete Task using TaskId.
 */
let deleteSubTask = (req, res) => {
    if (check.isEmpty(req.body.taskId)) {
        logger.error("taskId is missing", "Task Controller: deleteSubTask", 10);
        let apiResponse = response.generate(true, "task Id is missing", 500, null);
        res.send(apiResponse);
    } else if (check.isEmpty(req.body.subTaskId)) {
        logger.error("subtaskId is missing", "Task Controller: deleteSubTask", 10);
        let apiResponse = response.generate(true, "sub Task Id is missing", 500, null);
        res.send(apiResponse);
    } else if (check.isEmpty(req.body.subTaskName)) {
        logger.error("subtaskId is missing", "Task Controller: deleteSubTask", 10);
        let apiResponse = response.generate(true, "subTaskName is missing", 500, null);
        res.send(apiResponse);
    } else if (check.isEmpty(req.body.subStatus)) {
        logger.error("subtaskId is missing", "Task Controller: deleteSubTask", 10);
        let apiResponse = response.generate(true, "subStatus is missing", 500, null);
        res.send(apiResponse);
    } else {
        let newHistoryTask = {
            id: shortid.generate(),
            taskId: req.body.taskId,
            subTaskId: req.body.subTaskId,
            subTaskName: req.body.subTaskName.toUpperCase(),
            subStatus: req.body.subStatus,
            action: "Delete Sub Task",
            modifiedOn: time.now()
        } // end newHistoryTask
        let options = {
            $pull: {
                'task.$.subTask': {
                    subTaskId: req.body.subTaskId
                }
            },
            $push: {
                history: {
                    $each: [newHistoryTask],
                    $sort: {
                        modifiedOn: -1
                    }
                }
            }
        }
        TodoModel.updateOne({
            'task.taskId': req.body.taskId
        }, options, {
            multi: true
        }).exec((err, result) => {
            if (err) {
                logger.error(`Error occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Sub Task Found', 'sub Task Controller : delete sub Task')
                let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Sub Task deleted", "sub Task Controller : delete sub Task")
                let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result)
                res.send(apiResponse)
            }
        })
    }
} //end deleteSubTask

/**
 * function to edit Task using TaskId.
 */
let editSubTask = (req, res) => {

    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.taskId) && check.isEmpty(req.body.subTaskId) && check.isEmpty(req.body.subTaskName) && check.isEmpty(req.body.editSubTaskName)) {
                logger.error('Parameters Missing', 'editsubTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let deleteSubTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    'task.$.subTask': {
                        subTaskId: req.body.subTaskId
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Sub Task Found', 'sub Task Controller : delete sub Task')
                    let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Sub Task deleted", "sub Task Controller : delete sub Task")
                    let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result)
                    resolve(apiResponse)
                }
            })
        })
    }

    let updateSubTask = () => {
        return new Promise((resolve, reject) => {
            let newSubTask = {
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.subTaskName.toUpperCase(),
                modifiedOn: time.now()
            } // end newSubTask
            let newHistoryTask = {
                id: shortid.generate(),
                taskId: req.body.taskId,
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.subTaskName.toUpperCase(),
                editSubTaskName: req.body.editSubTaskName,
                action: "Edit Sub Task",
                modifiedOn: time.now()
            } // end newHistoryTask
            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    },
                    history: {
                        $each: [newHistoryTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create list', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise

    }

    validateParams()
        .then(deleteSubTask)
        .then(updateSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task updated successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err);
        })

} //end editSubTask

/**
 * function to edit Task using TaskId.
 */
let statusSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.taskId) && check.isEmpty(req.body.subTaskId) && check.isEmpty(req.body.subTaskName) && check.isEmpty(req.body.status)) {
                logger.error('Parameters Missing', 'statusTask:Validate Params()', 5);
                let apiResponse = response.generateResponse(true, 'parameters missing.', 403, null);
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    } //end validate params

    let deleteSubTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    'task.$.subTask': {
                        subTaskId: req.body.subTaskId
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Sub Task Found', 'sub Task Controller : delete sub Task')
                    let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Sub Task deleted", "sub Task Controller : delete sub Task")
                    let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result)
                    resolve(apiResponse)
                }
            })
        })
    }

    let updateSubTask = () => {
        return new Promise((resolve, reject) => {
            let newHistoryTask;
            let newSubTask = {
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.subTaskName.toUpperCase(),
                status: req.body.status,
                modifiedOn: time.now()
            } // end new list model
            if (req.body.status === "done") {
                newHistoryTask = {
                    id: shortid.generate(),
                    taskId: req.body.taskId,
                    subTaskId: req.body.subTaskId,
                    subTaskName: req.body.subTaskName.toUpperCase(),
                    subStatus: req.body.status,
                    editSubStatus: "open",
                    action: "Status Update Sub Task",
                    modifiedOn: time.now()
                } // end newHistoryTask
            } else {
                newHistoryTask = {
                    id: shortid.generate(),
                    taskId: req.body.taskId,
                    subTaskId: req.body.subTaskId,
                    subTaskName: req.body.subTaskName.toUpperCase(),
                    subStatus: req.body.status,
                    editSubStatus: "done",
                    action: "Status Update Sub Task",
                    modifiedOn: time.now()
                } // end newHistoryTask
            }
            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    },
                    history: {
                        $each: [newHistoryTask],
                        $sort: {
                            modifiedOn: -1
                        }
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options, {
                multi: true
            }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to update status', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise

    }

    validateParams()
        .then(deleteSubTask)
        .then(updateSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'updated sub task status successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log("\n" + err + "\n")
        })

} //end statusSubTask

/**
 * function to delete undo Task using listId.
 */
let undoDeleteSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.id)) {
                logger.error("id is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "id is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskId)) {
                logger.error("subTaskId is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskName)) {
                logger.error("subTaskName is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskName is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subStatus)) {
                logger.error("subStatus is missing", "Task Controller: undoDeleteSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subStatus is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {
                console.log("\n" + JSON.stringify(result) + "\n");
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to undo task', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No task Found to undo', 'Todo TaskController : undoDeleteSubTask.updatehistory')
                    let apiResponse = response.generate(true, 'No task Found to undo', 404, null)
                    reject(apiResponse)
                } else {
                    resolve();
                }
            })
        })
    }

    let saveSubTask = () => {
        return new Promise((resolve, reject) => {

            let newSubTask = {
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.subTaskName,
                status: req.body.subStatus,
                modifiedOn: time.now()
            } // end newSubTask
            console.log("\n" + JSON.stringify(newSubTask));
            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    }
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                console.log("\n" + JSON.stringify(result) + "\n");
                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create Sub task', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No sub Task Found', 'Task Controller : undoDeleteSubTask.saveSubTask')
                    let apiResponse = response.generate(true, 'No sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info('Sub Task created', 'Todo TaskController : undoDeleteSubTask.saveSubTask')
                    let apiResponse = response.generate(false, 'Sub Task created', 200, result)
                    resolve(apiResponse)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(saveSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoDeleteSubTask

/**
 * function to undo Create Task using TaskId.
 */
let undoCreateSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoCreateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoCreateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.id)) {
                logger.error("id is missing", "Task Controller: undoCreateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "id is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskId)) {
                logger.error("subTaskId is missing", "Task Controller: undoCreateTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskId is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoCreateSubTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("history updated", "Task Controller : undoCreateSubTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let deleteSubTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    'task.$.subTask': {
                        subTaskId: req.body.subTaskId
                    }
                }
            };
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Sub Task Found', 'Task Controller : undoCreateTask.deleteTask')
                    let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("List deleted", "Task Controller : undoCreateTask.deleteTask")
                    let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result)
                    resolve(apiResponse)
                }

            }) // end new product save
        }) //end promise   
    } //end save task

    validateParams()
        .then(updatehistory)
        .then(deleteSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task deleted successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoCreateSubTask

/**
 * function to undo update Task using TaskId.
 */
let undoUpdateSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.id)) {
                logger.error("id is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "id is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskId)) {
                logger.error("subTaskId is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subStatus)) {
                logger.error("subStatus is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subStatus is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.editSubTaskName)) {
                logger.error("editSubTaskName is missing", "Task Controller: undoUpdateSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "editSubTaskName is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoUpdateSubTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("history updated", "Task Controller : undoUpdateSubTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let deleteSubTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    'task.$.subTask': {
                        subTaskId: req.body.subTaskId
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Sub Task Found', 'Task Controller : undoUpdateSubTask.deleteSubTask')
                    let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Sub Task deleted", "Task Controller : undoUpdateSubTask.deleteSubTask")
                    let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result)
                    resolve(apiResponse)
                }
            })
        })
    }

    let updateSubTask = () => {
        return new Promise((resolve, reject) => {
            let newSubTask = {
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.editSubTaskName.toUpperCase(),
                modifiedOn: time.now()
            } // end newSubTask

            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to update sub task', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise

    }

    validateParams()
        .then(updatehistory)
        .then(deleteSubTask)
        .then(updateSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task Updated successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoUpdateSubTask

/**
 * function to undo status Task using TaskId.
 */
let undoStatusSubTask = (req, res) => {
    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.error("listId is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "listId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.taskId)) {
                logger.error("taskId is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "taskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.id)) {
                logger.error("id is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "id is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskId)) {
                logger.error("subTaskId is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskId is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.editSubStatus)) {
                logger.error("editSubStatus is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "editSubStatus is missing", 500, null);
                reject(apiResponse);
            } else if (check.isEmpty(req.body.subTaskName)) {
                logger.error("subTaskName is missing", "Task Controller: undoStatusSubTask.validateParams", 10);
                let apiResponse = response.generate(true, "subTaskName is missing", 500, null);
                reject(apiResponse);
            } else {
                resolve()
            }
        });
    } //end validate params

    let updatehistory = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $set: {
                    'history.$.modifiedOn': time.now(),
                    'history.$.used': "done"
                }
            }
            TodoModel.updateOne({
                listId: req.body.listId,
                'history.id': req.body.id
            }, options).exec((err, result) => {

                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Task Found', 'Task Controller : undoStatusSubTask.updatehistory')
                    let apiResponse = response.generate(true, 'No Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("status updated", "Task Controller : undoStatusSubTask.updatehistory")
                    resolve()
                }
            })
        });
    }

    let deleteSubTask = () => {
        return new Promise((resolve, reject) => {
            let options = {
                $pull: {
                    'task.$.subTask': {
                        subTaskId: req.body.subTaskId
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Error Occured', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Sub Task Found', 'Task Controller : undoUpdateSubTask.deleteSubTask')
                    let apiResponse = response.generate(true, 'No Sub Task Found', 404, null)
                    reject(apiResponse)
                } else {
                    logger.info("Sub Task deleted", "Task Controller : undoUpdateSubTask.deleteSubTask")
                    let apiResponse = response.generate(false, 'Sub Task Deleted', 200, result);
                    resolve(apiResponse)
                }
            })
        })
    }

    let updateSubTask = () => {
        return new Promise((resolve, reject) => {
            let newSubTask = {
                subTaskId: req.body.subTaskId,
                subTaskName: req.body.subTaskName,
                status: req.body.editSubStatus,
                modifiedOn: time.now()
            } // end newSubTask
            console.log("\n\n\n\n"+"pppp\n"+JSON.stringify(newSubTask));
            let options = {
                $push: {
                    'task.$.subTask': {
                        $each: [newSubTask]
                    }
                }
            }
            TodoModel.updateOne({
                'task.taskId': req.body.taskId
            }, options).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(`Error occured : ${err}`, 'Database', 10)
                    let apiResponse = response.generate(true, 'Failed to create task', 500, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }

            }) // end new product save

        }) //end promise

    }
    validateParams()
        .then(updatehistory)
        .then(deleteSubTask)
        .then(updateSubTask)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Sub Task status updated', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.send(err)
            console.log(err);
        })
} //end undoStatusSubTask


module.exports = {

    createList: createList,
    getAllUserLists: getAllUserLists,
    deleteList: deleteList,
    editList: editList,

    getAllTasks: getAllTasks,

    createTask: createTask,
    editTask: editTask,
    deleteTask: deleteTask,
    statusTask: statusTask,

    getUndoTasks: getUndoTasks,

    undoDeleteTask: undoDeleteTask,
    undoCreateTask: undoCreateTask,
    undoUpdateTask: undoUpdateTask,
    undoStatusTask: undoStatusTask,

    createSubTask: createSubTask,
    editSubTask: editSubTask,
    deleteSubTask: deleteSubTask,
    statusSubTask: statusSubTask,

    undoDeleteSubTask: undoDeleteSubTask,
    undoCreateSubTask: undoCreateSubTask,
    undoUpdateSubTask: undoUpdateSubTask,
    undoStatusSubTask: undoStatusSubTask
}