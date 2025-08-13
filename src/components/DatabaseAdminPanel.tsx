import React, { useState } from 'react';
import { DatabaseInitService } from '../services/DatabaseInitService';

export const DatabaseAdminPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const dbInitService = DatabaseInitService.getInstance();
      await dbInitService.initializeDatabase();
      setMessage('Database initialized successfully!');
    } catch (error) {
      setMessage(`Error initializing database: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all data!')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const dbInitService = DatabaseInitService.getInstance();
      await dbInitService.resetDatabase();
      setMessage('Database reset successfully!');
    } catch (error) {
      setMessage(`Error resetting database: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Database Administration</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleInitializeDatabase}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded mr-4"
          >
            {isLoading ? 'Initializing...' : 'Initialize Database'}
          </button>
          
          <button
            onClick={handleResetDatabase}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded"
          >
            {isLoading ? 'Resetting...' : 'Reset Database'}
          </button>
        </div>
        
        {message && (
          <div className={`p-3 rounded ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Initialize Database:</strong> Creates required collections and sample data if database is empty.</p>
          <p><strong>Reset Database:</strong> Clears all data and allows re-initialization (use with caution).</p>
        </div>
      </div>
    </div>
  );
};
