const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Ballot = require('../models/Ballot.js');
const { updateBallot,getBallot,addBallot,deleteBallot } = require('../controllers/ballotController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddBallot Function Test', () => {

  it('should create a new ballot successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { topic: "New Ballot", option1: "Option 1", option2: "Option 2", option3: "Option 3" }
    };

    // Mock ballot that would be created
    const createdBallot = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Ballot.create to return the createdBallot
    const createStub = sinon.stub(Ballot, 'create').resolves(createdBallot);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addBallot(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdBallot)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Ballot.create to throw an error
    const createStub = sinon.stub(Ballot, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { topic: "New Ballot", option1: "Option 1", option2: "Option 2", option3: "Option 3" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addBallot(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Ballot Test', () => {

  it('should update ballot successfully', async () => {
    // Mock ballot data
    const ballotId = new mongoose.Types.ObjectId();
    const existingBallot = {
      _id: ballotId,
      topic: "Previous Topic",
      option1: "Previous Option 1",
      option2: "Previous Option 2",
      option3: "Previous Option 3",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Ballot.findById to return mock ballot
    const findByIdStub = sinon.stub(Ballot, 'findById').resolves(existingBallot);

    // Mock request & response
    const req = {
      params: { id: ballotId },
      body: { topic: "New Topic", option1: "New Option 1", option2: "New Option 2", option3: "New Option 3" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateBallot(req, res);

    // Assertions
    expect(existingBallot.topic).to.equal("New Topic");
    expect(existingBallot.option1).to.equal("New Option 1");
    expect(existingBallot.option2).to.equal("New Option 2");
    expect(existingBallot.option3).to.equal("New Option 3");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if ballot is not found', async () => {
    const findByIdStub = sinon.stub(getBallot, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateBallot(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Ballot not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Ballot, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateBallot(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetBallot Function Test', () => {

  it('should return ballots for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock ballot data
    const ballot = [
      { _id: new mongoose.Types.ObjectId(), topic: "Ballot 1", userId, option1: "Option 1", option2: "Option 2", option3: "Option 3" },
      { _id: new mongoose.Types.ObjectId(), topic: "Ballot 2", userId, option1: "Option 1", option2: "Option 2", option3: "Option 3" }
    ];

    // Stub Ballot.find to return mock ballots
    const findStub = sinon.stub(Ballot, 'find').resolves(ballot);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getBallot(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(ballot)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Ballot.find to throw an error
    const findStub = sinon.stub(Ballot, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getBallot(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteBallot Function Test', () => {

  it('should delete a ballot successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock ballot found in the database
    const ballot = { remove: sinon.stub().resolves() };

    // Stub Ballot.findById to return the mock ballot
    const findByIdStub = sinon.stub(Ballot, 'findById').resolves(ballot);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBallot(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(ballot.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Ballot deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if ballot is not found', async () => {
    // Stub Ballot.findById to return null
    const findByIdStub = sinon.stub(Ballot, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBallot(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Ballot not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Ballot.findById to throw an error
    const findByIdStub = sinon.stub(Ballot, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteBallot(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});