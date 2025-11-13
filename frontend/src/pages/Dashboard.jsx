import { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import SummaryCards from '../components/dashboard/SummaryCards';
import MaintenanceChart from '../components/dashboard/MaintenanceChart';
import HealthTrendChart from '../components/dashboard/HealthTrendChart';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import { machineAPI, maintenanceAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    dueSoon: 0,
    overdue: 0,
    atRisk: 0
  });
  const [machines, setMachines] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats and machines
      const [statsRes, machinesRes, maintenanceRes] = await Promise.all([
        machineAPI.getStats(),
        machineAPI.getAll(),
        maintenanceAPI.getAll(),
      ]);

      setStats(statsRes.data);
      setMachines(machinesRes.data);
      setMaintenance(maintenanceRes.data);

      // Get readings from first machine for health trend (if exists)
      if (machinesRes.data.length > 0) {
        try {
          const readingsRes = await machineAPI.getReadings(machinesRes.data[0].id);
          setReadings(readingsRes.data);
        } catch (error) {
          console.log('No readings available yet');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      alert('Error loading dashboard: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400 mb-8">Monitor your factory's maintenance status</p>

          <SummaryCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MaintenanceChart data={maintenance} />
            <HealthTrendChart readings={readings} />
          </div>

          <NotificationsPanel machines={machines} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;