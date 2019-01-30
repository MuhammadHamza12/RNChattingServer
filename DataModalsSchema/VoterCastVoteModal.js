const mongoose = require('mongoose');

const VoterDataSchema = new mongoose.Schema({
  Candidateemail:{
    type:String,
    required:true,
  },
  VoterEmail: {
    type: String,
    required:true,
  },
    updatedAt:{
    type:Date,
  },
});
module.exports = mongoose.model('votes',VoterDataSchema);
