const app = require("express")();
const server = app.listen(8080);
const io = require("socket.io")();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const CORS = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config');
const router = require('./services/router');
// const Message = require('./Controllers/MessageController');
//** chating Modals */
const MessageModal = require('./DataModalsSchema/MessageModal');
const SignUpModal = require('./DataModalsSchema/ChatingModals/SignUpModal');
const FeildCheckingMiddleWare = require('./middleware/checkValidation');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(CORS('*'))
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/v1',router);

require('./dbConnection');

const PORT = process.env.PORT || 8080;

// app.use(express.static(path.join(__dirname, '/static')));
/** chatting application apis */

app.post('/login/Auth', FeildCheckingMiddleWare.checkFeildsForLogin , (req, res) => {
    console.log(req.body);
    const { email , password } = req.body;
    let isOnline = true;
    const SearchOBJ = { email };
    SignUpModal.findOne(SearchOBJ)
    .then((success)=>{
      if (success !== null) {
        try {
          if (Object.is(success.password,password)) {
            SignUpModal.findOneAndUpdate({email},{isOnline}).then((success2)=>{
              console.log('updated obj: ',success2);
            }).catch((error)=>{
              console.log('error:',error);
            })
            const token = jwt.sign({
              id: success._id,
              email: success.email,
              name: success.name,
              isOnline: success.isOnline,
            }, config.jwtSecret, {
              expiresIn: '1d',
            });
            res.json({
              token,
            });
            console.log(token);
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
    }).catch((error)=>{

    })
});
app.put('/logout/confirm', (req, res) => {
    console.log(req.body);
    const { isOnline , _id } = req.body;
  SignUpModal.findByIdAndUpdate({_id},{isOnline})
  .then((success)=>{
    SignUpModal.find({})
  .then((success1)=>{
    console.log(success);
    let getFilteredData = [ ...success1];
    let status = getFilteredData.map((item)=>{
      return { isOnline:item.isOnline , email : item.email , id:item._id }
    })
    console.log('status data:',status);
     io.emit('getStatus',status);
      res.json({status:200});
  }).catch((error)=>{
     res.json({error});
  })
     }).catch((err)=>{
    console.log(err);
  })
  });
app.post('/signup/api', FeildCheckingMiddleWare.checkFeilds, (req, res) => {
  console.log(req.body);
  const {
    email,
    name,
    password
  } = req.body;
  const SaveOBJ = {
    email,
    name,
    password,
    isOnline:true,
  }
  SignUpModal.findOne({
      email
    })
    .then((success1) => {
      if(!Object.is(success1,null)){
        console.log('got user already exist');
        res.status(500).json({
          errors: {
            form: 'Sorry! already exist',
          },
        });
      } else{
        const signUPModal = new SignUpModal(SaveOBJ)
        signUPModal
          .save()
          .then((success2) => {
            if(!Object.is(success2,null)){
              const token = jwt.sign({
                id: success2._id,
                email: success2.email,
                isOnline:success2.isOnline,
              }, config.jwtSecret, {
                expiresIn: '1d',
              });
              res.json({
                token,
              });
            } else {
               res.json({dataErr:success2});
            }
          })
          .catch((error1) => {
            console.log(error1);
          })
        console.log('user not exist need to be create a new user?')
      }
    })
    .catch((error2) => {
      console.log(error2);
    })
});
app.get('/get/onlinStatus',(req,res)=>{
  SignUpModal.find({})
  .then((success)=>{
    console.log(success);
    let getFilteredData = [ ...success];
    let status = getFilteredData.map((item)=>{
      return { name:item.name , isOnline:item.isOnline , email : item.email ,id:item._id }
    });
     io.emit('getStatus',status);
      res.json({status:200});
  }).catch((error)=>{
     res.json({error});
  })
})

app.get('/get/messages', (req, res) => {
  console.log(req.body);
  MessageModal.find({}).sort({_id:-1})
  .then((result) => {
    let desireFormate = [...result];
    let getDataFormate = desireFormate.map((item=>{
      return { _id:item._id , text:item.message, createdAt: new Date(item.Date) , user:{
        _id:item.email,
        name:item.name,
      }  
    }
    }))
    console.log('ulta result chaiye',result);
     console.log(getDataFormate);
      res.json({
        // mes: result,
        mblData:getDataFormate,
      });
    }).catch((error) => {
      console.log(error);
    })
});

app.post('/api/message', (req, res) => {
  console.log(req.body);
  const {
    message , email , name
  } = req.body;
  console.log(message);
  const messageModal = new MessageModal({
    message , email , name
  })
  messageModal
    .save()
    .then((success) => {
      console.log('in success');
      console.log(success)
      const success2 = {
        _id:success._id,
        text:success.message,
        createdAt: new Date(success.Date),
        user:{
          _id:success.email,
          name:success.name,
        }
      }
      res.json({
        status: 200,
        data: success,
        mbldata:success2,
      });
      io.emit('messages', success);
      io.emit('messages1',success2);
    }).catch((error) => {
      console.log(error);
    })
});

/*** end of chattting application */
app.get('/api', (req, res) => {
  console.log(req.headers);
  res.status(200).json({
    ok: 'value',
    message: 'ok'
  })
});

io.on("connection", client => {
  console.log('a user connected', client.id);
  client.on("onlineStatus", ({
    email,
  }) => {
    console.log("msges", email);

  });

  

  client.on("getRemoveUpdate", () => {
    console.log('remove update');

  })
  client.on("subscribeToActiveStatus", () => {

    console.log('subs called')
    subscribeToActiveStatus({
      client,
      connection
    })
  });
})

const port = 8080;
io.listen(server);
console.log("listening on port ", port);