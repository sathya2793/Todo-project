const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')
const mongoosePaginate = require('mongoose-paginate');

const Notification   = new Schema({
  Id: {type:String,index: true,unique: true}, //unique Id
  sender_id: {type:String,default:''}, // Notification creator id
  receiver_id: {type:String,default:''}, // Ids of the receivers of the notification
  message: {type:String,default:''}, // any description of the notification message 
  status: {type: Number,default:0},
  category: {type:String,default:''},
  created_at:{type: Date, default: time.now}
});

Notification.plugin(mongoosePaginate);
module.exports = mongoose.model('Notification', Notification)
