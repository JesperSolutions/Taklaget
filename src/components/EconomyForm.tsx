import React from 'react';
import { EconomyItem } from '../types/report';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface EconomyFormProps {
  data: EconomyItem[];
  onChange: (data: EconomyItem[]) => void;
}

export const EconomyForm: React.FC<EconomyFormProps> = ({ data, onChange }) => {
  const addItem = () => {
    const newItem: EconomyItem = {
      description: '',
      amount: 1,
      unit: 'stk',
      price: 0,
      total: 0
    };
    onChange([...data, newItem]);
  };

  const updateItem = (index: number, field: keyof EconomyItem, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    
    // Recalculate total
    if (field === 'amount' || field === 'price') {
      newData[index].total = newData[index].amount * newData[index].price;
    }
    
    onChange(newData);
  };

  const removeItem = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const totalSum = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
          Økonomi
        </h2>
        <button
          onClick={addItem}
          className="btn-secondary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tilføj post
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">Beskrivelse</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Antal</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">Enhed</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium text-gray-700">Pris</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium text-gray-700">Total</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 no-print">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm"
                    placeholder="Beskrivelse"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm text-center"
                    min="0"
                    step="0.1"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm text-center"
                  >
                    <option value="stk">stk</option>
                    <option value="timer">timer</option>
                    <option value="m²">m²</option>
                    <option value="m">m</option>
                    <option value="kg">kg</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full border-none bg-transparent focus:ring-0 text-sm text-right"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">
                  {item.total.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
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
            <tr className="bg-primary-50 font-medium">
              <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">
                <strong>Total:</strong>
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                <strong>{totalSum.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</strong>
              </td>
              <td className="border border-gray-300 px-3 py-2 no-print"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Ingen økonomiske poster tilføjet endnu</p>
          <p className="text-sm">Klik på "Tilføj post" for at komme i gang</p>
        </div>
      )}
    </div>
  );
};