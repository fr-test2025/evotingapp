//View Ballots
const Ballot = require('../models/Ballot');

const getBallots = async(req,res)=>{

try {

const ballots = await Ballot.find({ userId: req.user.id });
res.json(ballots);
} catch (error) {
res.status(500).json({ message: error.message });

}
};


//Add Ballot
const addBallot = async (req , res ) => {
const { topic , option1, option2, option3 } = req.body;
try {
const ballot = await Ballot.create({ userId: req.user.id, topic , option1, option2, option3 });
res.status(201).json(ballot);
} catch (error) {
res.status(500).json({ message: error.message });
}
};