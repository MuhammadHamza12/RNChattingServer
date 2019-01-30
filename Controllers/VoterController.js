const AdminDataModal = require('../DataModalsSchema/AdminDataModal');
const jwt = require('jsonwebtoken');
const VoterDataModal = require('../DataModalsSchema/VoterDataModal');
const config = require('../config');
const validator = require('validator');

function VoterSetAuthSetDetails(req, res) {
  const {
    email,
    password
  } = req.body;
  console.log('email and password:', email, password);
  const SearchOBJ = {
    email,
  }
  console.log(email, password);
  VoterDataModal.findOne(SearchOBJ)
    .then((success) => {
      console.log('response data: ', success);
      if (success !== null) {
        try {
          if (validator.equals(password, success.password)) {
            const token = jwt.sign({
              id: success._id,
              email: success.email,
            }, config.jwtSecret2, {
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

function getVoterDetails(req, res) {
  const {
    email
  } = req.body;
  console.log('email received: ', email);
  VoterDataModal.findOne({
      email: email
    })
    .then((success) => {
      console.log(success);
      if (success !== null) {
        const SuccessOBJ = {
          ApplyAsCandidate:success.ApplyAsCandidate,
          isVotingStart:success.isVotingStart,
          isVoteCasted:success.isVoteCasted,
          email:success.email,
          readyToCastVote1:success.readyToCastVote1,
          readyToCastVote:success.readyToCastVote,
          name:success.name,
          _id:success._id
        }
        res.json({
          status: true,
          data: SuccessOBJ
        });
      }
    }).catch((error) => {
      res.json({
        status: false,
        error: error,
      });
    })
}

module.exports = {
  VoterSetAuthSetDetails,
  getVoterDetails
}