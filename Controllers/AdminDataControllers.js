const AdminDataModal = require('../DataModalsSchema/AdminDataModal');
const jwt = require('jsonwebtoken');
const config = require('../config');
const validator = require('validator');

function AdminDataController(req, res) {
  const {
    email,
    password
  } = req.body;
  const SearchOBJ = {
    email,
  }
  console.log(email,password);
  AdminDataModal.findOne(SearchOBJ)
  .then((success) => {
    console.log('response data: ', success);
    if (success !== null) {
      try {
        if (validator.equals(password,success.password)) {
          const token = jwt.sign({
            id: success._id,
            email: success.email,
          }, config.jwtSecret, {
            expiresIn: '1d',
          });
          res.json({
            token,
          });
        } else {
          res.status(401).json({
            errors: {
              form: 'Invalid Credentials',
            },
          });
        }
      } catch (e) {
        res.status(401).json({
          errors: {
            form: 'Invalid Credentials',
          },
        });
      }
    } else {
      res.status(401).json({
        errors: {
          form: 'Invalid Credentials',
        },
      });
    }
  })
  .catch((err) => {
    console.log('err', err);
  });
}
function getAdminStepData(req,res) {
  const {
    email
  } = req.body;
  console.log(email);
  AdminDataModal.findOne({email:email})
  .then((success)=>{
    const SendOBJ = {
      step1:success.step1,
      step2:success.step2,
      step3:success.step3,
      step4:success.step4,
      email:success.email,
      _id:success._id,
    }
    console.log(success);
     res.json({
       data:SendOBJ,
     });
  })
  .catch((error)=>{
    res.json({
      error:error,
    });
  });
}
function setFlagStep1(req,res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email:email,
  }
  AdminDataModal.findOneAndUpdate(UpdateOBJ, {
    $set: {
      step1: true,
    },
  }, {
    new: true,
  }).then((result)=>{
     console.log(result);
    res.json({status:true,message:'update successfully'});
  }).catch((error)=>{
    res.json({status:false,message:'update failed'});
  })
}
function setFlagStep4(req,res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email:email,
  }
  AdminDataModal.findOneAndUpdate(UpdateOBJ, {
    $set: {
      step4: true,
    },
  }, {
    new: true,
  }).then((result)=>{
     console.log(result);
    res.json({status:true,message:'update successfully'});
  }).catch((error)=>{
    res.json({status:false,message:'update failed'});
  })
}

function setFlagStep2(req,res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email:email,
  }
  AdminDataModal.findOneAndUpdate(UpdateOBJ, {
    $set: {
      step2: true,
    },
  }, {
    new: true,
  }).then((result)=>{
     console.log(result);
    res.json({status:true,message:'update successfully'});
  }).catch((error)=>{
    res.json({status:false,message:'update failed'});
  })
}

module.exports = {
  AdminDataController,
  getAdminStepData,
  setFlagStep1,
  setFlagStep2,
  setFlagStep4
}