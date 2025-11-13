import { useState, useEffect } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import Card from '../common/Card';
import { machineAPI, maintenanceAPI } from '../../utils/api';
import { generateMachineReport, generateAllMachinesReport } from '../../utils/pdfGenerator';

const ReportGenerator = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [machinesRes, statsRes] = await Promise.all([
        machineAPI.getAll(),
        machineAPI.getStats()
      ]);
      setMachines(machinesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const handleGenerateMachineReport = async () => {
    if (!selectedMachine) {
      alert('Please select a machine');
      return;
    }

    try {
      setLoading(true);
      const response = await machineAPI.getById(selectedMachine);
      const machine = response.data;
      
      generateMachineReport(
        machine,
        machine.readings || [],
        machine.maintenanceHistory || []
      );
    } catch (error) {
      console.error('Generate report error:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummaryReport = () => {
    try {
      setLoading(true);
      generateAllMachinesReport(machines, stats);
    } catch (error) {
      console.error('Generate summary report error:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileText size={24} />
          Generate Machine Report
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Machine
            </label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">-- Select a machine --</option>
              {machines.map(machine => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} - {machine.model}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGenerateMachineReport}
            disabled={loading || !selectedMachine}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <Download size={20} />}
            Generate PDF Report
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileText size={24} />
          Generate Summary Report
        </h3>
        
        <p className="text-gray-400 mb-4">
          Generate a comprehensive report for all machines including statistics and status overview.
        </p>
        
        <button
          onClick={handleGenerateSummaryReport}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" size={20} /> : <Download size={20} />}
          Generate Summary PDF
        </button>
      </Card>

      {/* Statistics Preview */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Current Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-dark-700/50 rounded-lg">
            <p className="text-gray-400 text-sm">Total Machines</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.total || 0}</p>
          </div>
          <div className="text-center p-4 bg-dark-700/50 rounded-lg">
            <p className="text-gray-400 text-sm">Due Soon</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.dueSoon || 0}</p>
          </div>
          <div className="text-center p-4 bg-dark-700/50 rounded-lg">
            <p className="text-gray-400 text-sm">Overdue</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{stats.overdue || 0}</p>
          </div>
          <div className="text-center p-4 bg-dark-700/50 rounded-lg">
            <p className="text-gray-400 text-sm">At Risk</p>
            <p className="text-3xl font-bold text-orange-400 mt-2">{stats.atRisk || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportGenerator;