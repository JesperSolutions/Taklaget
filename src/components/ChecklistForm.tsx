import React from 'react';
import { ChecklistItem } from '../types/report';
import { Plus, Trash2 } from 'lucide-react';

interface ChecklistFormProps {
  data: ChecklistItem[];
  onChange: (data: ChecklistItem[]) => void;
}

export const ChecklistForm: React.FC<ChecklistFormProps> = ({ data, onChange }) => {
  const handleItemChange = (index: number, field: keyof ChecklistItem, value: string | boolean) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      name: '',
      ikkeRelevant: false,
      ikkeEtableret: false,
      etableret: false,
      m2: '',
      kommentar: ''
    };
    onChange([...data, newItem]);
  };

  const removeItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
          Check Liste
        </h2>
        <button
          onClick={addItem}
          className="btn-secondary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tilføj punkt
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 checklist-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Element</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Ikke relevant</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Ikke etableret</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Etableret</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">m²</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Kommentar / Anbefalinger</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 no-print">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm"
                    placeholder="Element navn"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.ikkeRelevant}
                    onChange={(e) => handleItemChange(index, 'ikkeRelevant', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.ikkeEtableret}
                    onChange={(e) => handleItemChange(index, 'ikkeEtableret', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.etableret}
                    onChange={(e) => handleItemChange(index, 'etableret', e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.m2}
                    onChange={(e) => handleItemChange(index, 'm2', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm text-center"
                    placeholder="m²"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.kommentar}
                    onChange={(e) => handleItemChange(index, 'kommentar', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm"
                    placeholder="Kommentar"
                  />
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
    </div>
  );
};