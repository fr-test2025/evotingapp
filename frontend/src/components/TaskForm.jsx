import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BallotForm = ({ ballot, setBallots, editingBallot, setEditingBallot }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ topic: '', option1: '', option2: '', option3: '' });

  useEffect(() => {
    if (editingBallot) {
      setFormData({
        topic: editingBallot.topic,
        option1: editingBallot.option1,
        option2: editingBallot.option2,
        option3: editingBallot.option3,
      });
    } else {
      setFormData({ topic: '', option1: '', option2: '', option3: '' });
    }
  }, [editingBallot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBallot) {
        const response = await axiosInstance.put(`/api/ballots/${editingBallot._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBallots(ballots.map((ballot) => (ballot._id === response.data._id ? response.data : ballot)));
      } else {
        const response = await axiosInstance.post('/api/ballots', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBallots([...ballots, response.data]);
      }
      setEditingBallot(null);
      setFormData({ topic: '', option1: '', option2: '', option3: '' });
    } catch (error) {
      alert('Failed to save ballot .');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingBallot   ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Option 1"
        value={formData.option1}
        onChange={(e) => setFormData({ ...formData, option1: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Option 2"
        value={formData.option2}
        onChange={(e) => setFormData({ ...formData, option2: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Option 3"
        value={formData.option3}
        onChange={(e) => setFormData({ ...formData, option3: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingBallot ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default BallotForm;
