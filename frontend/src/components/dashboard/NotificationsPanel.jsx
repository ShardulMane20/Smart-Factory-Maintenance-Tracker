import { AlertTriangle, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import { motion } from 'framer-motion';

const NotificationsPanel = ({ machines }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Overdue':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'Due Soon':
        return <Clock className="text-yellow-500" size={20} />;
      case 'At Risk':
        return <AlertCircle className="text-orange-500" size={20} />;
      default:
        return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overdue':
        return 'border-l-red-500 bg-red-500/5';
      case 'Due Soon':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'At Risk':
        return 'border-l-orange-500 bg-orange-500/5';
      default:
        return 'border-l-green-500 bg-green-500/5';
    }
  };

  const alertMachines = machines?.filter(m => m.status !== 'OK') || [];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Alerts & Notifications</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alertMachines.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
            <p className="text-gray-400">All machines are running smoothly!</p>
          </div>
        ) : (
          alertMachines.map((machine, index) => (
            <motion.div
              key={machine.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-l-4 ${getStatusColor(machine.status)} p-4 rounded-r-lg`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(machine.status)}
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{machine.name}</h4>
                  <p className="text-sm text-gray-400">{machine.model} - {machine.department}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last maintenance: {machine.last_maintenance_date || 'N/A'}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  machine.status === 'Overdue' ? 'bg-red-500/20 text-red-400' :
                  machine.status === 'Due Soon' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {machine.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationsPanel;