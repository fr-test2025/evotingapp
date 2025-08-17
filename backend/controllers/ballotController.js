//View Ballots
const Ballot = require('../models/Ballot');

const getBallot = async(req,res)=>{

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


//Update Ballot
const updateBallot = async (req , res ) => {
const { topic, option1, option2, option3 } = req.body;
try {
const ballot = await Ballot.findById(req.params.id);
if (!ballot) return res.status(404).json({ message: 'Ballot not found' });

ballot.topic = topic || ballot.topic;
ballot.option1 = option1 || ballot.option1;
ballot.option2 = option2 || ballot.option2;
ballot.option3 = option3 || ballot.option3;

const updatedBallot = await ballot.save();
res.json(updatedBallot);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


//Delete Ballot
const deleteBallot = async (req, res) => {
    try {
        const ballot = await Ballot.findById(req.params.id);
        if (!ballot) return res.status(404).json({ message: 'Ballot not found' });

        await ballot.remove();
        res.json({ message: 'Ballot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBallots,
    addBallot,
    updateBallot,
    deleteBallot
};

//Exporting the functions to be used in route