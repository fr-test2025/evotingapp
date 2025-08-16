
const Ballot = require('../models/Ballot');

const getBallots = async(req,res)=>{

try {

const ballots = await Ballot.find({ userId: req.user.id });
res.json(ballots);
} catch (error) {
res.status(500).json({ message: error.message });

}
};