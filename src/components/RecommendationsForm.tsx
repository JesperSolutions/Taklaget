import React from 'react';
import { Recommendation } from '../types/report';
import { Plus, Trash2 } from 'lucide-react';

interface RecommendationsFormProps {
  data: Recommendation[];
  onChange: (data: Recommendation[]) => void;
}

export const RecommendationsForm: React.FC<RecommendationsFormProps> = ({ data, onChange }) => {
  const addRecommendation = () => {
    const newRecommendation: Recommendation = {
      id: Date.now().toString(),
      text: ''
    };
    onChange([...data, newRecommendation]);
  };

  const updateRecommendation = (id: string, text: string) => {
    const newData = data.map(rec => 
      rec.id === id ? { ...rec, text } : rec
    );
    onChange(newData);
  };

  const removeRecommendation = (id: string) => {
    const newData = data.filter(rec => rec.id !== id);
    onChange(newData);
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
          Anbefalinger
        </h2>
        <button
          onClick={addRecommendation}
          className="btn-secondary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tilføj anbefaling
        </button>
      </div>

      <div className="space-y-4">
        {data.map((recommendation, index) => (
          <div key={recommendation.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <textarea
              value={recommendation.text}
              onChange={(e) => updateRecommendation(recommendation.id, e.target.value)}
              className="flex-1 form-textarea"
              placeholder="Skriv anbefaling..."
              rows={3}
            />
            <button
              onClick={() => removeRecommendation(recommendation.id)}
              className="flex-shrink-0 text-red-600 hover:text-red-800 p-1 no-print"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Ingen anbefalinger tilføjet endnu</p>
            <p className="text-sm">Klik på "Tilføj anbefaling" for at komme i gang</p>
          </div>
        )}
      </div>
    </div>
  );
};