'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let FriendSchema = new mongoose.Schema({
    friendId: {
      type: String,
      default:''
    },
    fullName: {
      type: String,
      default:''
    },
    email:{
      type: String,
      default:''
    },
    mobileNumber:{
      type: String,
      default: ''
    },
    status: {
      type: Number,
      enums: [
        0, //'Pending',
        1, //'Accepted',
        2, //'Declined',
        3, //'Blocked',
        4, //'received',
        5  //'removed'
      ],
      default:''
    },
    updatedOn: {
      type: Date,
      default: ""
    }
},{_id:false});

let UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    index: true,
    default: ''
  },
  countryName: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: String,
    default: ''
  },
  secretToken: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  friends: [FriendSchema],
  createdOn: {
    type: Date,
    default: ""
  },
  updatedOn: {
    type: Date,
    default: ""
  }
});

UserSchema.plugin(mongoosePaginate);
mongoose.model('User', UserSchema);