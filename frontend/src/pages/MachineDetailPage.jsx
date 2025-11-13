import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Activity } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import MachineDetail from '../components/machines/MachineDetail';
import ReadingsForm from '../components/machines/ReadingsForm';
import { machineAPI } from '../utils/api';

const MachineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

  useEffect(() => {
    loadMachineData();
  }, [id]);

  const loadMachineData = async () => {
    try {
      setLoading(true);
      const response = await machineAPI.getById(id);
      setMachine(response.data);
      setReadings(response.data.readings || []);
    } catch (error) {
      console.error('Error loading machine:', error);
      alert('Error loading machine details');
      navigate('/machines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReading = async (formData) => {
    try {
      await machineAPI.addReading(id, formData);
      setIsReadingModalOpen(false);
      loadMachineData();
    } catch (error) {
      console.error('Error adding reading:', error);
      alert('Error adding reading');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Topbar />
          <div className="p-8">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <button
            onClick={() => navigate('/machines')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Machines
          </button>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{machine?.name}</h1>
              <p className="text-gray-400">{machine?.model} - {machine?.department}</p>
            </div>
            <button
              onClick={() => setIsReadingModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Activity size={20} />
              Add Reading
            </button>
          </div>

          <MachineDetail machine={machine} readings={readings} />

          <Modal
            isOpen={isReadingModalOpen}
            onClose={() => setIsReadingModalOpen(false)}
            title="Add Machine Reading"
            size="lg"
          >
            <ReadingsForm
              onSubmit={handleAddReading}
              onCancel={() => setIsReadingModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailPage;