import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import PartsInventory from '../components/spare-parts/PartsInventory';
import PartsForm from '../components/spare-parts/PartsForm';
import { sparePartAPI } from '../utils/api';
import useAuthStore from '../store/authStore';

const SpareParts = () => {
  const { user } = useAuthStore();
  const [parts, setParts] = useState([]);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const [partsRes, lowStockRes] = await Promise.all([
        sparePartAPI.getAll(),
        sparePartAPI.getLowStock(),
      ]);
      setParts(partsRes.data);
      setLowStockParts(lowStockRes.data);
    } catch (error) {
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleEdit = (part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this part?')) {
      return;
    }

    try {
      await sparePartAPI.delete(id);
      loadParts();
    } catch (error) {
      console.error('Error deleting part:', error);
      alert('Error deleting part');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedPart) {
        await sparePartAPI.update(selectedPart.id, formData);
      } else {
        await sparePartAPI.create(formData);
      }
      setIsModalOpen(false);
      loadParts();
    } catch (error) {
      console.error('Error saving part:', error);
      alert('Error saving part');
    }
  };

  const canManageParts = ['Admin', 'Manager'].includes(user?.role);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Spare Parts Inventory</h1>
              <p className="text-gray-400">Manage spare parts and track replacements</p>
            </div>
            {canManageParts && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={20} />
                Add Part
              </button>
            )}
          </div>

          {/* Low Stock Alert */}
          {lowStockParts.length > 0 && (
            <Card className="p-6 mb-6 border-red-500/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-xl font-bold text-white">Low Stock Alert</h3>
              </div>
              <p className="text-gray-400 mb-4">
                {lowStockParts.length} part(s) are running low on stock
              </p>
              <div className="flex flex-wrap gap-2">
                {lowStockParts.map(part => (
                  <span key={part.id} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                    {part.part_name} ({part.quantity} left)
                  </span>
                ))}
              </div>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <PartsInventory
              parts={parts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedPart ? 'Edit Spare Part' : 'Add New Spare Part'}
          >
            <PartsForm
              part={selectedPart}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SpareParts;