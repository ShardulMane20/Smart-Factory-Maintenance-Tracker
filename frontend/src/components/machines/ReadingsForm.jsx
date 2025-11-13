import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const ReadingsForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    temperature: '',
    pressure: '',
    vibration: '',
    runtime_hours: '',
    operator_name: user?.username || '',
    notes: '',
  });

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
            Temperature (°C) *
          </label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., 65.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pressure (bar)
          </label>
          <input
            type="number"
            step="0.1"
            name="pressure"
            value={formData.pressure}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., 2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Vibration (mm/s) *
          </label>
          <input
            type="number"
            step="0.1"
            name="vibration"
            value={formData.vibration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., 2.3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Runtime Hours *
          </label>
          <input
            type="number"
            step="0.1"
            name="runtime_hours"
            value={formData.runtime_hours}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., 8.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operator Name *
          </label>
          <input
            type="text"
            name="operator_name"
            value={formData.operator_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="Any observations or issues..."
          />
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
          Submit Reading
        </button>
      </div>
    </form>
  );
};

export default ReadingsForm;