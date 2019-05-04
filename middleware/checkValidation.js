const validator = require('validator');

function checkFeildsForLogin(req,res,next) {
  const { email , password } = req.body;
  if(!Object.is(email,"") && !Object.is(password,"")){
    next();
  } else
   res.json({error:'Feild Required'});
}
function checkFeilds(req,res,next) {
    const { email , name , password } = req.body;

    if(!Object.is(email,"") && !Object.is(name,"") && !Object.is(password,"")){
      next();
    } else
     res.json({error:'Feild Required'});
  } 
  module.exports = {
    checkFeilds,
    checkFeildsForLogin,
  }