const mongoose = require('mongoose');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('./../libs/timeLib');
/* Models */
const NotificationModel = mongoose.model('Notification');


let getAllNotification = (req, res) => {
    if (check.isEmpty(req.params.userId)) {
        logger.info('userId is missing', "Notification Controller:getAllNotification", 10);
        let apiResponse = response.generate(true, "userId is missing", 400, null);
        res.send(apiResponse);
    } 
    else if(check.isEmpty(req.query.pageNo)){
        logger.info('pageNo is missing', "Notification Controller:getAllNotification", 10);
        let apiResponse = response.generate(true, "pageNo is missing", 400, null);
        res.send(apiResponse);
    }
    else{
        let query = {
            'receiver_id': req.params.userId
        };
        let pageNo = parseInt(req.query.pageNo);
        if (pageNo < 0 || pageNo === 0) {
            logger.info('invalid page number, should start with 1', 'Notification Controller: getAllNotification')
            let apiResponse = response.generate(true, 'invalid page number, should start with 1', 404, null)
            reject(apiResponse)
        }
        let options = {
            select: '-__v -_id',
            sort: { 'status' : 1 , 'created_at' : -1},
            lean: true,
            offset: 10 * (pageNo - 1),
            limit: 10
        };
        NotificationModel.paginate(query, options).then(function (result) {
        if (check.isEmpty(result)) {
            logger.info('No User Found', 'friendController:getAllNotification')
            let apiResponse = response.generate(true, 'No Notification Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User Notification Found', 200, result)
            res.send(apiResponse)
        }
    })
    }
} // end get All Notification

let statusNotification = (req, res) => {
    if (check.isEmpty(req.body.Id)) {
        logger.info('Id is missing', "Notification Controller:statusNotification", 10);
        let apiResponse = response.generate(true, "Id is missing", 400, null);
        res.send(apiResponse);
    } 
    else{
        let options = {
            $set: {
                'status': 1
            }
        }
        NotificationModel.updateOne({
            'Id': req.body.Id
        }, options, {
            multi: true
        }).exec((err, result) => {

            if (err) {
                logger.error(`Error occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Notification Found', 'Notification Controller : statusNotification ')
                let apiResponse = response.generate(true, 'No Notification Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Notification updated", "Notification Controller : statusNotification ")
                let apiResponse = response.generate(false, 'Notification Updated', 200, result)
                res.send(apiResponse)
            }
} );
    }
}// end status Notification

let closedNotification = (req, res) => {
    if (check.isEmpty(req.body.Id)) {
        logger.info('Id is missing', "Notification Controller:closedNotification", 10);
        let apiResponse = response.generate(true, "Id is missing", 400, null);
        res.send(apiResponse);
    } 
    else{
        NotificationModel.deleteOne({
            'Id': req.body.Id}).exec((err, result) => {
            if (err) {
                logger.error(`Error occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Notification Found', 'Notification Controller : closedNotification ')
                let apiResponse = response.generate(true, 'No Notification Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Deleted Notification", "Notification Controller : closedNotification ")
                let apiResponse = response.generate(false, 'Deleted Sucessfully', 200, result)
                res.send(apiResponse)
            }
} );
    }
}// end closed Notification


module.exports = {
    getAllNotification: getAllNotification,
    statusNotification: statusNotification,
    closedNotification: closedNotification
}