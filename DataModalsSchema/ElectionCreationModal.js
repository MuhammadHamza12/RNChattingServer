const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const ElectionCreation = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  isVotingStart:{
    type:Boolean,
    default:false,
  },
  description:{
    type:String,
    require:true
  },
  SDate:{
    type:String,
    require:true,
  },
  STime:{
    type:String,
    require:true,
  },
  ETime:{
    type:String,
    require:true,
  },
  updatedAt:{
    type:Date,
  },
});
ElectionCreation.plugin(uniqueValidator);
module.exports = mongoose.model('ElectionDetails', ElectionCreation);
