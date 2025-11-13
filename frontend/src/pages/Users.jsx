import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import UserManagement from '../components/users/UserManagement';
import UserForm from '../components/users/UserForm';
import { userAPI, authAPI } from '../utils/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userAPI.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await userAPI.update(selectedUser.id, formData);
      } else {
        // For new users, we need to include password
        await authAPI.register({ ...formData, password: 'changeme123' });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400">Manage user accounts and roles</p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <UserPlus size={20} />
              Add User
            </button>
          </div>

          <Card className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <UserManagement
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedUser ? 'Edit User' : 'Add New User'}
          >
            <UserForm
              user={selectedUser}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Users;