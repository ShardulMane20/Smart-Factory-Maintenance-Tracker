import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { machineAPI } from '../../utils/api';

const Topbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await machineAPI.getAll();
      const machines = response.data;
      
      const alerts = machines
        .filter(m => m.status !== 'OK')
        .map(m => ({
          id: m.id,
          name: m.name,
          status: m.status,
          message: `${m.name} - ${m.status}`
        }));
      
      setNotifications(alerts);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  return (
    <div className="h-16 bg-dark-900 border-b border-dark-700 px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search machines, parts, maintenance..."
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-dark-700">
              <h3 className="font-semibold text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-dark-700 hover:bg-dark-700 transition-colors">
                    <p className="text-sm text-white">{notif.message}</p>
                    <span className={`text-xs ${
                      notif.status === 'Overdue' ? 'text-red-400' :
                      notif.status === 'Due Soon' ? 'text-yellow-400' :
                      'text-orange-400'
                    }`}>
                      {notif.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;