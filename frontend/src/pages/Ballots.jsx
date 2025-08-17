import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import BallotForm from '../components/BallotForm';
import BallotList from '../components/BallotList';
import { useAuth } from '../context/AuthContext';

const Ballots = () => {
  const { user } = useAuth();
  const [ballots, setBallots] = useState([]);
  const [editingBallot, setEditingBallot] = useState(null);

  useEffect(() => {
    const fetchBallots = async () => {
      try {
        const response = await axiosInstance.get('/api/ballots', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBallots(response.data);
      } catch (error) {
        alert('Failed to fetch ballots.');
      }
    };

    fetchBallots();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <BallotForm
        ballots={ballots}
        setBallots={setBallots}
        editingBallot={editingBallot}
        setEditingBallot={setEditingBallot}
      />
      <BallotList ballots={ballots} setBallots={setBallots} setEditingBallot={setEditingBallot} />
    </div>
  );
};

export default Ballots;
