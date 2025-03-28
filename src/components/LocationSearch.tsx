import { useState, FormEvent } from 'react';
import { LocationData } from '../lib/useWeather';

interface LocationSearchProps {
  onSearch: (location: string) => Promise<void>;
  isLoading: boolean;
  savedLocations: LocationData[];
  onSaveLocation: () => void;
  onLoadLocation: (location: LocationData) => Promise<void>;
  onRemoveLocation: (index: number) => void;
  onUseCurrentLocation: () => void;
}

export default function LocationSearch({
  onSearch,
  isLoading,
  savedLocations,
  onSaveLocation,
  onLoadLocation,
  onRemoveLocation,
  onUseCurrentLocation,
}: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await onSearch(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter city or location"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading || !searchTerm.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            📍 Use My Location
          </button>
          <button
            type="button"
            onClick={onSaveLocation}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            disabled={isLoading}
          >
            💾 Save Location
          </button>
        </div>
      </form>

      {savedLocations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Saved Locations</h3>
          <div className="flex flex-wrap gap-2">
            {savedLocations.map((location, index) => (
              <div 
                key={`${location.name}-${index}`}
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
              >
                <button
                  onClick={() => onLoadLocation(location)}
                  className="text-sm text-gray-800 dark:text-white hover:underline mr-1"
                  disabled={isLoading}
                >
                  {location.name}, {location.country}
                </button>
                <button
                  onClick={() => onRemoveLocation(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  disabled={isLoading}
                  aria-label={`Remove ${location.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
