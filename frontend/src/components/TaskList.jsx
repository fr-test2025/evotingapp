import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BallotList = ({ ballots, setBallots, setEditingBallot }) => {
  const { user } = useAuth();

  const handleDelete = async (ballotId) => {
    try {
      await axiosInstance.delete(`/api/ballots/${ballotId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBallots(ballots.filter((ballot) => ballot._id !== ballotId));
    } catch (error) {
      alert('Failed to delete ballot.');
    }
  };

  return (
    <div>
      {ballot.map((ballot) => (
        <div key={ballot._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{ballot.topic}</h2>
          <p>{ballot.description}</p>
          <p className="text-sm text-gray-500">Topic: {new Date(ballot.topic).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingBallot(ballot)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(ballot._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BallotList;
