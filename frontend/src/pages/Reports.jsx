import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';
import ReportGenerator from '../components/reports/ReportGenerator';

const Reports = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400 mb-8">Generate comprehensive maintenance reports</p>

          <ReportGenerator />
        </div>
      </div>
    </div>
  );
};

export default Reports;