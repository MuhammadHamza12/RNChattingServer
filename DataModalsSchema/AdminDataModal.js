const mongoose = require('mongoose');

const AdminDataModal = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  password: {
    type: String,
    required:true,
  },
  step1:{
    type:Boolean,
    default:false,
  },
  step2:{
    type:Boolean,
    default:false,
  },
  step3:{
    type:Boolean,
    default:false,
  },
  step4:{
    type:Boolean,
    default:false,
  },
  updatedAt:{
    type:Date,
  },
});
module.exports = mongoose.model('AdminDataModal', AdminDataModal);
