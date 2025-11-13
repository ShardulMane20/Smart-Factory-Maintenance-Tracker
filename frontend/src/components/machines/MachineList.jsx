import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const MachineList = ({ machines, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMachines = machines?.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.department.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status) => {
    const styles = {
      'OK': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Due Soon': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Overdue': 'bg-red-500/20 text-red-400 border-red-500/30',
      'At Risk': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['OK']}`}>
        {status}
      </span>
    );
  };

  const canEdit = ['Admin', 'Manager', 'Technician'].includes(user?.role);
  const canDelete = user?.role === 'Admin';

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search machines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Name</th>
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Model</th>
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Department</th>
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Total Hours</th>
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
              <th className="text-left py-4 px-4 text-gray-400 font-semibold">Last Maintenance</th>
              <th className="text-right py-4 px-4 text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.map((machine, index) => (
              <motion.tr
                key={machine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="font-semibold text-white">{machine.name}</div>
                </td>
                <td className="py-4 px-4 text-gray-300">{machine.model}</td>
                <td className="py-4 px-4 text-gray-300">{machine.department}</td>
                <td className="py-4 px-4 text-gray-300">{machine.total_hours_run.toFixed(1)} hrs</td>
                <td className="py-4 px-4">{getStatusBadge(machine.status)}</td>
                <td className="py-4 px-4 text-gray-300">
                  {machine.last_maintenance_date || 'Never'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/machines/${machine.id}`)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onEdit(machine)}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(machine.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredMachines.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-500">No machines found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineList;