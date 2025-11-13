import { Edit, Trash2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = ({ users, onEdit, onDelete }) => {
  const getRoleBadge = (role) => {
    const styles = {
      'Admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Manager': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Technician': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Operator': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-700">
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Username</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Role</th>
            <th className="text-left py-4 px-4 text-gray-400 font-semibold">Created At</th>
            <th className="text-right py-4 px-4 text-gray-400 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="font-semibold text-white">{user.username}</div>
              </td>
              <td className="py-4 px-4 text-gray-300">{user.email}</td>
              <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
              <td className="py-4 px-4 text-gray-300">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {users?.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;