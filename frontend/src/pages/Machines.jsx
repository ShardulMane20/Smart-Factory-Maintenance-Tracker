import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import MachineList from '../components/machines/MachineList';
import MachineForm from '../components/machines/MachineForm';
import { machineAPI } from '../utils/api';
import useAuthStore from '../store/authStore';

const Machines = () => {
  const { user } = useAuthStore();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const response = await machineAPI.getAll();
      setMachines(response.data);
    } catch (error) {
      console.error('Error loading machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedMachine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) {
      return;
    }

    try {
      await machineAPI.delete(id);
      loadMachines();
    } catch (error) {
      console.error('Error deleting machine:', error);
      alert('Error deleting machine');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedMachine) {
        await machineAPI.update(selectedMachine.id, formData);
      } else {
        await machineAPI.create(formData);
      }
      setIsModalOpen(false);
      loadMachines();
    } catch (error) {
      console.error('Error saving machine:', error);
      alert('Error saving machine');
    }
  };

  const canAddMachine = ['Admin', 'Manager'].includes(user?.role);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Machines</h1>
              <p className="text-gray-400">Manage your factory machines</p>
            </div>
            {canAddMachine && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={20} />
                Add Machine
              </button>
            )}
          </div>

          <Card className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <MachineList
                machines={machines}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedMachine ? 'Edit Machine' : 'Add New Machine'}
            size="lg"
          >
            <MachineForm
              machine={selectedMachine}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Machines;