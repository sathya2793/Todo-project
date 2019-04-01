const mongoose = require('mongoose');

let subTaskSchema = new mongoose.Schema({
  subTaskId: {
    type: String,
    default: ''
  },
  subTaskName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: 'open'
  },
  modifiedOn: {
    type: Date,
    default: ""
  }
},{ _id : false });

let HistorySchema = new mongoose.Schema({
  id: {
    type: String,
    default: ''
  },
  taskId: {
    type: String,
    default: ''
  },
  taskName: {
    type: String,
    default: ''
  },
  editTaskName: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: 'open'
  },
  editStatus: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: ''
  },
  subTaskId: {
    type: String,
    default: ''
  },
  subTaskName: {
    type: String,
    default: ''
  },
  editSubTaskName: {
    type: String,
    default: ''
  },
  subStatus: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: 'open'
  },
  editSubStatus: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: ''
  },
  modifiedOn: {
    type: Date,
    default: ""
  },
  used: {
    type: String,
    default: "undone"
  }
},{ _id : false });

let TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    default: ''
  },
  taskName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enums: [
      "open",
      "done"
    ],
    default: 'open'
  },
  subTask: [subTaskSchema],
  createdOn: {
    type: Date,
    default: ""
  },
  modifiedOn: {
    type: Date,
    default: ""
  }
},{ _id : false });

let TodoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  listId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  listName: {
    type: String,
    required: true
  },
  creator: {
    type: String
  },
  createdOn: {
    type: Date,
    default: ""
  },
  modifiedOn: {
    type: Date,
    default: ""
  },
  visibility: {
    type: String
  },
  task: [TaskSchema],
  history: [HistorySchema]
});



module.exports = mongoose.model('TodoModel', TodoSchema);