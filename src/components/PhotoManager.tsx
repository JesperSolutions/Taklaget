import React from 'react';
import { Photo } from '../types/report';
import { Upload, Trash2, Image } from 'lucide-react';

interface PhotoManagerProps {
  data: Photo[];
  onChange: (data: Photo[]) => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({ data, onChange }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: Photo[] = [];
    Array.from(files).forEach((file, index) => {
      const photo: Photo = {
        id: Date.now().toString() + index,
        file,
        caption: `Foto ${data.length + newPhotos.length + 1}`
      };
      newPhotos.push(photo);
    });

    onChange([...data, ...newPhotos]);
  };

  const updateCaption = (id: string, caption: string) => {
    const newData = data.map(photo => 
      photo.id === id ? { ...photo, caption } : photo
    );
    onChange(newData);
  };

  const removePhoto = (id: string) => {
    const newData = data.filter(photo => photo.id !== id);
    onChange(newData);
  };

  const getImageUrl = (photo: Photo): string => {
    if (photo.file) {
      return URL.createObjectURL(photo.file);
    }
    if (photo.url) {
      return photo.url;
    }
    return 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  return (
    <div className="form-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
          Dokumentation
        </h2>
        <label className="btn-secondary flex items-center cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Upload billeder
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 photo-grid">
        {data.map((photo) => (
          <div key={photo.id} className="bg-gray-50 rounded-lg p-4 photo-item">
            <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
              <img
                src={getImageUrl(photo)}
                alt={photo.caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400';
                }}
              />
            </div>
            <div className="flex items-start space-x-2">
              <input
                type="text"
                value={photo.caption}
                onChange={(e) => updateCaption(photo.id, e.target.value)}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Billedtekst"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="text-red-600 hover:text-red-800 p-1 no-print"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Ingen billeder uploadet endnu</p>
            <p className="text-sm">Klik på "Upload billeder" for at tilføje dokumentation</p>
          </div>
        )}
      </div>
    </div>
  );
};