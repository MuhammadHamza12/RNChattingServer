const mongoose = require('mongoose');
const Messages = new mongoose.Schema({
  message:{
    type:String,
    required:true,
  },
  Date: {
    type:Date,
    default:Date.now(),
  },
  updatedAt:{
    type:Date,
  },
  email:{
    type:String,
    required:true,
  },
  name:{
    type:String,
    required:true,
  }
});
module.exports = mongoose.model('Messages', Messages);
