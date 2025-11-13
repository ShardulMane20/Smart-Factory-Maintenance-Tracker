import { useState, useEffect } from 'react';

const MachineForm = ({ machine, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    department: '',
    last_maintenance_date: '',
    frequency_days: 30,
    frequency_hours: 500,
    total_hours_run: 0,
    status: 'OK',
  });

  useEffect(() => {
    if (machine) {
      setFormData(machine);
    }
  }, [machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Machine Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., CNC Machine 01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., XYZ-2000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., Production"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Maintenance Date
          </label>
          <input
            type="date"
            name="last_maintenance_date"
            value={formData.last_maintenance_date}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Maintenance Frequency (Days)
          </label>
          <input
            type="number"
            name="frequency_days"
            value={formData.frequency_days}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Maintenance Frequency (Hours)
          </label>
          <input
            type="number"
            name="frequency_hours"
            value={formData.frequency_hours}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total Hours Run
          </label>
          <input
            type="number"
            step="0.1"
            name="total_hours_run"
            value={formData.total_hours_run}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="OK">OK</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Overdue">Overdue</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-dark-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {machine ? 'Update Machine' : 'Add Machine'}
        </button>
      </div>
    </form>
  );
};

export default MachineForm;