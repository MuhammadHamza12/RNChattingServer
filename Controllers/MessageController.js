const Messages = require('../DataModalsSchema/MessageModal');
const io = require('socket.io');
function Message(req,res) {
    console.log(req.body);
}

module.exports = {
  Message,
}