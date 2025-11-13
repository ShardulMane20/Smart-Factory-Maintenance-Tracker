
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const HealthTrendChart = ({ readings }) => {
  // Get last 10 readings for trend
  const chartData = readings?.slice(0, 10).reverse().map(reading => ({
    date: new Date(reading.reading_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: reading.temperature,
    vibration: reading.vibration,
  })) || [];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Machine Health Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Temperature (°C)"
          />
          <Line 
            type="monotone" 
            dataKey="vibration" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            name="Vibration (mm/s)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default HealthTrendChart;