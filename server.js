const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const CORS = require('cors');
const path = require('path');
const app = express();
const adminController = require('./Controllers/AdminDataControllers');
const electionController = require('./Controllers/ElectionController');
const voterController = require('./Controllers/VoterController');
const castVoteMiddleWare = require('./middleware/checkToken');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(CORS('*'))
app.use(bodyParser.urlencoded({
  extended: false
}));

require('./dbConnection');

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '/static')));
app.post('/api/AdminAuth',adminController.AdminDataController);
app.post('/get/AdminStep/data',adminController.getAdminStepData);
app.post('/api/Step1/Flag',adminController.setFlagStep1);
app.post('/api/GetElection/Details',electionController.setVotingDetails);
app.post('/api/Addvoter/Details',electionController.AddVoter);
app.post('/api/Step2/Flag',adminController.setFlagStep2);
app.post('/api/AddCandidate/Details',electionController.AddCandidates);
app.get('/api/getElection/Details',electionController.getElectionDetails);
app.post('/api/Step4/Flag',adminController.setFlagStep4);
app.post('/api/DoneConfimation',electionController.sendConfirmation);
app.post('/api/voterAuth',voterController.VoterSetAuthSetDetails);
app.post('/api/getVoterDetails/Voter',voterController.getVoterDetails);
app.post('/api/getVotinig/Link',electionController.sentVoteLink);
app.post('/api/CheckToken',castVoteMiddleWare,electionController.isTokenExpire);
app.get('/api/getCandidate/Data',electionController.getCandidateDetails);
app.post('/api/SetCandidate/Flag',electionController.SetFlag1);
app.post('/api/SetCandidate/Flag1',electionController.SetFlag2);
app.post('/api/SetCandidate/Flag1False',electionController.SetFlag2Flase);
app.post('/api/GetVoterCast/Vote',electionController.CollectVotingData);
app.get('/api/getVote/Count',electionController.GetVoteCount);
app.get('/', (req, res) => {
  console.log(req.headers);
  res.status(200).json({
    ok: 'value',
    message: 'ok'
  })
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});