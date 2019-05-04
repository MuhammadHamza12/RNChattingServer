const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const SignUpModal = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
    require:true
  },
  isOnline:{
    type:Boolean,
    default:false,
  },
  updatedAt:{
    type:Date,
  },
});
SignUpModal.plugin(uniqueValidator);
module.exports = mongoose.model('SignUpUserDetails', SignUpModal);
