import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, Calendar, Package } from 'lucide-react';
import Card from '../common/Card';
import { machineAPI, sparePartAPI } from '../../utils/api';

const MachineDetail = ({ machine, readings }) => {
  const [prediction, setPrediction] = useState(null);
  const [replacements, setReplacements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (machine?.id) {
      loadPrediction();
      loadReplacements();
    }
  }, [machine?.id]);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      const response = await machineAPI.predictFailure(machine.id);
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReplacements = async () => {
    try {
      const response = await sparePartAPI.getReplacements(machine.id);
      setReplacements(response.data);
    } catch (error) {
      console.error('Load replacements error:', error);
    }
  };

  const chartData = readings?.slice(0, 20).reverse().map(r => ({
    date: new Date(r.reading_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: r.temperature,
    vibration: r.vibration,
    pressure: r.pressure || 0,
  })) || [];

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-500 bg-red-500/20 border-red-500';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500';
      case 'Low': return 'text-green-500 bg-green-500/20 border-green-500';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Machine Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Runtime</p>
              <h3 className="text-2xl font-bold text-white">{machine?.total_hours_run?.toFixed(1)} hrs</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Calendar className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Maintenance</p>
              <h3 className="text-lg font-bold text-white">
                {machine?.last_maintenance_date || 'Never'}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Package className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Parts Replaced</p>
              <h3 className="text-2xl font-bold text-white">{replacements.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Prediction Card */}
      {prediction && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertCircle size={24} />
                Predictive Maintenance Analysis
              </h3>
              <p className="text-gray-400">AI-powered failure risk assessment</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Failure Probability</p>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-white">
                  {(prediction.failure_probability * 100).toFixed(1)}%
                </div>
                <span className={`px-4 py-2 rounded-lg border font-semibold ${getRiskColor(prediction.risk_level)}`}>
                  {prediction.risk_level} Risk
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 bg-dark-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                prediction.risk_level === 'High' ? 'bg-red-500' :
                prediction.risk_level === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${prediction.failure_probability * 100}%` }}
            />
          </div>
        </Card>
      )}

      {/* Readings Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Sensor Readings Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature °C" />
            <Line type="monotone" dataKey="vibration" stroke="#10b981" strokeWidth={2} name="Vibration mm/s" />
            <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} name="Pressure bar" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Maintenance History */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Maintenance History</h3>
        <div className="space-y-3">
          {machine?.maintenanceHistory?.length > 0 ? (
            machine.maintenanceHistory.map((record) => (
              <div key={record.id} className="p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{record.maintenance_type}</h4>
                    <p className="text-sm text-gray-400 mt-1">Performed by: {record.performed_by}</p>
                    {record.notes && <p className="text-sm text-gray-500 mt-1">{record.notes}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      record.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {record.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">{record.maintenance_date}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No maintenance records yet</p>
          )}
        </div>
      </Card>

      {/* Spare Parts Replacements */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Spare Parts Replacement Log</h3>
        <div className="space-y-3">
          {replacements.length > 0 ? (
            replacements.map((replacement) => (
              <div key={replacement.id} className="p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{replacement.part_name}</h4>
                    <p className="text-sm text-gray-400 mt-1">Part #: {replacement.part_number}</p>
                    <p className="text-sm text-gray-400">Replaced by: {replacement.replaced_by}</p>
                    {replacement.notes && <p className="text-sm text-gray-500 mt-1">{replacement.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Qty: {replacement.quantity_used}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(replacement.replacement_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No parts replaced yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MachineDetail;