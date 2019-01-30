const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const VoterDataModal = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
  },
  name:{
    type:String,
    require:true
  },
  updatedAt:{
    type:Date,
  },
  password:{
    type:String,
  },
  ApplyAsCandidate:{
    type:Boolean,
    default:false,
  },
  isVotingStart:{
    type:Boolean,
    default:false,
  },
  readyToCastVote:{
    type:Boolean,
    default:false,
  },
  readyToCastVote1:{
    type:Boolean,
    default:false,
  },
  description:{
    type:String,
  },
  isVoteCasted:{
    type:Boolean,
    default:false,
  }
});
VoterDataModal.plugin(uniqueValidator);
module.exports = mongoose.model('VoterDetails', VoterDataModal);
