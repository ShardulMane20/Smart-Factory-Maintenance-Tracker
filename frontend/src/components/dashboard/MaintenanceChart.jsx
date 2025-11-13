import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const MaintenanceChart = ({ data }) => {
  // Transform data for the chart
  const chartData = data?.reduce((acc, item) => {
    const month = new Date(item.maintenance_date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(d => d.month === month);
    
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    
    return acc;
  }, []) || [];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Maintenance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
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
          <Bar dataKey="count" fill="#0ea5e9" name="Maintenance Count" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MaintenanceChart;