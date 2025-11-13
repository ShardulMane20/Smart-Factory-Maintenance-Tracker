import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import MaintenanceCalendar from '../components/calendar/MaintenanceCalendar';
import { maintenanceAPI } from '../utils/api';

const Calendar = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaintenance();
  }, []);

  const loadMaintenance = async () => {
    try {
      setLoading(true);
      const response = await maintenanceAPI.getAll();
      setMaintenance(response.data);
    } catch (error) {
      console.error('Error loading maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Maintenance Calendar</h1>
          <p className="text-gray-400 mb-8">View and manage maintenance schedules</p>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <MaintenanceCalendar maintenanceRecords={maintenance} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;