var router = require('express').Router();


function protected(req,res,next) {
    res.send('Here is the secret ');
};

router.route('/protected')
.get(protected);

module.exports = router;