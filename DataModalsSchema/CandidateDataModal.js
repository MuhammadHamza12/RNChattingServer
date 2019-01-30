const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const CandidateDataModal = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
  },
  name:{
    type:String,
    require:true,
  },
  description:{
    type:String,
    require:true
  },
  updatedAt:{
    type:Date,
  },
});
CandidateDataModal.plugin(uniqueValidator);
module.exports = mongoose.model('CandidateDetails', CandidateDataModal);
