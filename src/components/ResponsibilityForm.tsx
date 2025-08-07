import React from 'react';
import { ResponsibilityItem } from '../types/report';
import { Plus, Trash2, Users } from 'lucide-react';

interface ResponsibilityFormProps {
  data: ResponsibilityItem[];
  onChange: (data: ResponsibilityItem[]) => void;
}

export const ResponsibilityForm: React.FC<ResponsibilityFormProps> = ({ data, onChange }) => {
  const addItem = () => {
    const newItem: ResponsibilityItem = {
      task: '',
      responsible: '',
      deadline: '',
      status: 'pending'
    };
    onChange([...data, newItem]);
  };

  const updateItem = (index: number, field: keyof ResponsibilityItem, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const removeItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const getStatusColor = (status: ResponsibilityItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ResponsibilityItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Afsluttet';
      case 'in-progress':
        return 'I gang';
      default:
        return 'Afventer';
    }
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
          Ansvar
        </h2>
        <button
          onClick={addItem}
          className="btn-secondary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tilføj opgave
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Opgave</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Ansvarlig</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Deadline</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 no-print">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => updateItem(index, 'task', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm"
                    placeholder="Opgave beskrivelse"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.responsible}
                    onChange={(e) => updateItem(index, 'responsible', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm"
                    placeholder="Ansvarlig person"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="date"
                    value={item.deadline}
                    onChange={(e) => updateItem(index, 'deadline', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm text-center"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <select
                    value={item.status}
                    onChange={(e) => updateItem(index, 'status', e.target.value)}
                    className={`border-none bg-transparent focus:ring-0 text-xs px-2 py-1 rounded-full ${getStatusColor(item.status as ResponsibilityItem['status'])}`}
                  >
                    <option value="pending">Afventer</option>
                    <option value="in-progress">I gang</option>
                    <option value="completed">Afsluttet</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center no-print">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Ingen ansvarsområder defineret endnu</p>
          <p className="text-sm">Klik på "Tilføj opgave" for at komme i gang</p>
        </div>
      )}
    </div>
  );
};