import { useState, useEffect } from 'react';

const PartsForm = ({ part, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    part_name: '',
    part_number: '',
    quantity: 0,
    min_quantity: 5,
    location: '',
  });

  useEffect(() => {
    if (part) {
      setFormData(part);
    }
  }, [part]);

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
            Part Name *
          </label>
          <input
            type="text"
            name="part_name"
            value={formData.part_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., Bearing XYZ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Part Number *
          </label>
          <input
            type="text"
            name="part_number"
            value={formData.part_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., BRG-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Quantity *
          </label>
          <input
            type="number"
            name="min_quantity"
            value={formData.min_quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Storage Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
            placeholder="e.g., Warehouse A - Shelf 3"
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
          {part ? 'Update Part' : 'Add Part'}
        </button>
      </div>
    </form>
  );
};

export default PartsForm;