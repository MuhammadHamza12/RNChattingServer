const ElectionModal = require('../DataModalsSchema/ElectionCreationModal');
const AdminDetailModal = require('../DataModalsSchema/AdminDataModal');
const VoterDetails = require('../DataModalsSchema/VoterDataModal');
const nodemailer = require('nodemailer');
const config = require('../config');
const VoteCastDataModal = require('../DataModalsSchema/VoterCastVoteModal');
const jwt = require('jsonwebtoken');
const generate_password = require('generate-password');

function EmailFunctionality(accountID, accountpass, SenderName, Email, Password) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: accountID, // generated ethereal user
      pass: accountpass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },

  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: `${SenderName} <transelection@voting.com>`, // sender address
    to: Email, // list of receivers
    subject: 'Credentials For Voting', // Subject line
    text: 'TRANSELECTION', // plain text body
    html: `<b>Credentails For Voting: </b> <br/> EMAIL: ${Email} <br/> PASSWORD: ${Password} `, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

function AddVoter(req, res) {
  const {
    email,
    name
  } = req.body;
  let password = generate_password.generate({
    length: 10,
    numbers: true
  });
  const SaveOBJ = {
    email: email,
    name: name,
    password: password,
  };
  const voterDetail = new VoterDetails(SaveOBJ)
  voterDetail
    .save()
    .then((success) => {
      if (success !== null) {
        res.json({
          status: true,
          message: 'data saved Successfully'
        });
        EmailFunctionality(config.username, config.password, 'Admin',email, password);
      }
    }).catch((error) => {
      res.json({
        error: error
      });
    });
}

function setVotingDetails(req, res) {
  console.log(req.body);
  const {
    title,
    description,
    SDate,
    STime,
    ETime,
    email
  } = req.body;
  console.log(title, description, SDate, STime, ETime);
  const SaveOBJ = {
    title: title,
    description: description,
    SDate: SDate,
    STime: STime,
    ETime: ETime,
  }
  const UpdateOBJ = {
    email: email,
  }
  const electionDetail = new ElectionModal(SaveOBJ)
  electionDetail
    .save()
    .then((success) => {
      console.log('come into success', success);
      AdminDetailModal.findOneAndUpdate(UpdateOBJ, {
        $set: {
          step3: true,
        },
      }, {
        new: true,
      }).then((result) => {
        console.log(result);
        VoterDetails.updateMany({}, {
          $set: {
            isVotingStart: true,
          }
        }).then((result) => {
          console.log('all updated with voting time', result);
          res.json({
            status: true,
            message: 'data has been succcessfully Saved and updated'
          });
        }).catch((error) => {
          console.log('error aya : ', error);
          res.json({
            status: false,
            error: error,
          });
        });


      }).catch((error) => {
        res.json({
          status: false,
          message: 'update failed'
        });
      })
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: false,
        message: 'falied saved'
      });
    })
}

function AddCandidates(req, res) {
  const {
    email,
    description,
    ademail
  } = req.body;
  const SearchOBJ = {
    email: email,
  }
  VoterDetails.findOne(SearchOBJ)
    .then((success) => {
      if ((success !== null)) {
        console.log('not null');
        console.log('success obj: ', success);
        console.log('check boolean value: ', success.ApplyAsCandidate)
        if ((success.ApplyAsCandidate)) {
          console.log('exist');
          res.json({
            status: false,
            msg: 'Candidate Already Exist!'
          });
        } else {
          VoterDetails.findOneAndUpdate({
            email: email
          }, {
            $set: {
              ApplyAsCandidate: true,
              description: description,
            },
          }, {
            new: true,
          }).then((success1) => {
            console.log('updated', success1);
            res.json({
              status: true,
              msg: 'candidate has been added'
            });
          }).catch((error) => {
            res.json({
              status: false,
              error: error
            });
          })
        }
      } else {
        console.log('exist');
        res.json({
          status: false,
          msg: 'Candidate must be a voter!'
        })
      }
    }).catch((error) => {
      res.json({
        status: false,
        error: error
      });
    })
}

function getElectionDetails(req, res) {
  ElectionModal.find({})
    .then((success) => {
      if (success.length >= 1) {
        res.json({
          status: true,
          data: success
        });
      } else {
        res.json({
          status: false,
          data: success
        });
      }
    }).catch((error) => {
      res.json({
        status: false,
        error: error
      });
    })
}

function sendConfirmation(req, res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email: email,
  }
  AdminDetailModal.findOneAndUpdate(UpdateOBJ, {
    $set: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
    },
  }, {
    new: true,
  }).then((result) => {
    console.log(result);
    VoterDetails.remove({}).then((result) => {
        console.log('all updated with voting time', result);
        ElectionModal.remove({})
          .then((success12) => {
            VoteCastDataModal.remove({})
              .then((success13) => {
                res.json({
                  status: true,
                  message: 'data has been Reset Saved and updated'
                });
              })
              .catch((error) => {
                res.json({
                  status: false,
                  error: error,
                });
              })
          }).catch((error) => {
            res.json({
              status: false,
              error: error,
            });
          })
      }).catch((error) => {
        console.log('error aya : ', error);
        res.json({
          status: false,
          error: error,
        });
      })
      .catch((error) => {
        res.json({
          status: false,
          message: 'update failed'
        });
      })
  })
}

function EmailFunctionalityForVote(accountID, accountpass, subject, SenderName, Email, Link) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: accountID, // generated ethereal user
      pass: accountpass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // setup email data with unicode symbols
  let mailOptions = {
    from: `${SenderName} <transelection@voting.com>`, // sender address
    to: Email, // list of receivers
    subject: `${subject}`, // Subject line
    text: 'Transelection', // plain text body
    html: `<b>Link : </b> <br/> ${Link} `, // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

function isTokenExpire(req, res) {
  const authorizationHeader = req.headers.authorization;
  console.log(authorizationHeader);
  console.log('token zinda hai');
  res.status(200).json({
    status: true,
    message: 'token zinda hai',
  });
}

function sentVoteLink(req, res) {
  console.log(req.body);
  const {
    email
  } =
  req.body;
  VoterDetails.findOne({
      email: email
    })
    .then((success) => {
      if (success !== null) {
        console.log('found:  ', success);
        if (!success.isVoteCasted) {
          console.log('all data', success._id, success.email, success.isVoteCasted);
          const Data = {
            id: success._id,
          };
          const token = jwt.sign(Data, 'newSecret', {
            expiresIn: '50m',
          });
          console.log(token);
          EmailFunctionalityForVote(config.username, config.password, 'Secure Vote Link Valid for 10 mints', 'Admin', email, `http://localhost:3000/voterDash/CastVote/?token=${token}`);
          res.json({
            status: true,
            message: 'email has been sent!'
          });
        }
      }
    }).catch((error) => {
      console.log('not found error:', error);
    });

}

function getCandidateDetails(req, res) {
  VoterDetails.find({
      ApplyAsCandidate: true
    })
    .then((result) => {
      res.json({
        status: true,
        data: result
      });
    }).catch((error) => {
      res.json({
        status: false,
        error: error
      });
    })
}

function SetFlag1(req, res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email: email,
  }
  VoterDetails.findOneAndUpdate(UpdateOBJ, {
    $set: {
      readyToCastVote: true,
    },
  }, {
    new: true,
  }).then((result) => {
    console.log(result);
    res.json({
      status: true,
      message: 'update successfully'
    });
  }).catch((error) => {
    res.json({
      status: false,
      message: 'update failed'
    });
  })
}

function SetFlag2Flase(req, res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email: email,
  }
  VoterDetails.findOneAndUpdate(UpdateOBJ, {
    $set: {
      readyToCastVote1: false,
    },
  }, {
    new: true,
  }).then((result) => {
    console.log(result);
    res.json({
      status: true,
      message: 'update successfully'
    });
  }).catch((error) => {
    res.json({
      status: false,
      message: 'update failed'
    });
  })
}

function SetFlag2(req, res) {
  const {
    email
  } = req.body;
  const UpdateOBJ = {
    email: email,
  }
  VoterDetails.findOneAndUpdate(UpdateOBJ, {
    $set: {
      readyToCastVote1: true,
    },
  }, {
    new: true,
  }).then((result) => {
    console.log(result);
    res.json({
      status: true,
      message: 'update successfully'
    });
  }).catch((error) => {
    res.json({
      status: false,
      message: 'update failed'
    });
  })
}

function CollectVotingData(req, res) {
  const {
    Candidateemail,
    VoterEmail
  } = req.body;
  console.log(Candidateemail, VoterEmail)
  const SaveOBJ = {
    Candidateemail: Candidateemail,
    VoterEmail: VoterEmail
  };
  const voteCastDetail = new VoteCastDataModal(SaveOBJ)
  voteCastDetail
    .save()
    .then((success) => {
      if (success !== null) {
        console.log('run success', success)
        const SearchOBJ = {
          email: VoterEmail
        };
        VoterDetails.findOneAndUpdate(SearchOBJ, {
          $set: {
            readyToCastVote1: false,
            isVoteCasted: true,
          },
        }, {
          new: true,
        }).then((result) => {
          console.log(result);
          res.json({
            status: true,
            message: 'update has successfully!'
          });
        }).catch((error) => {
          res.json({
            status: false,
            message: 'update failed'
          });
        })
      }
    }).catch((error) => {
      console.log('error in casting!', error);
      res.json({
        status: false,
        msg: 'vote cast failed'
      });
    })
}

function GetVoteCount(req, res) {
  VoteCastDataModal.aggregate([{
      $group: {
        _id: '$Candidateemail',
        Vote_Count: {
          $sum: 1
        }
      }
    }])
    .then((success) => {
      console.log(success);
      res.json({
        data: success
      });
    }).catch((error) => {
      console.log(error);
      res.json({
        value: error
      });
    });
}
module.exports = {
  setVotingDetails,
  AddVoter,
  AddCandidates,
  getElectionDetails,
  sendConfirmation,
  sentVoteLink,
  isTokenExpire,
  getCandidateDetails,
  SetFlag1,
  SetFlag2,
  SetFlag2Flase,
  CollectVotingData,
  GetVoteCount
}