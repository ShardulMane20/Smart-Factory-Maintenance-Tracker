import { Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const PartsInventory = ({ parts, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parts?.map((part, index) => {
        const isLowStock = part.quantity <= part.min_quantity;
        
        return (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-dark-800 rounded-lg p-6 border ${
              isLowStock ? 'border-red-500/50' : 'border-dark-700'
            } relative overflow-hidden`}
          >
            {isLowStock && (
              <div className="absolute top-4 right-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            )}
            
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <Package className="text-primary-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{part.part_name}</h3>
                <p className="text-sm text-gray-400">#{part.part_number}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className={`font-semibold ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                  {part.quantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Min Quantity:</span>
                <span className="text-gray-300">{part.min_quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-gray-300">{part.location || 'N/A'}</span>
              </div>
            </div>

            {isLowStock && (
              <div className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded text-center">
                <p className="text-red-400 text-sm font-semibold">⚠️ Low Stock Alert</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(part)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => onDelete(part.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        );
      })}

      {parts?.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Package className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-500">No spare parts in inventory</p>
        </div>
      )}
    </div>
  );
};

export default PartsInventory;