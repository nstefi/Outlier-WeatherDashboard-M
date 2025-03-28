import { useWeather, LocationData } from '../lib/useWeather';
import { WeatherData } from '../lib/weatherApi';
import LocationSearch from '../components/LocationSearch';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import HourlyForecast from '../components/HourlyForecast';

export default function WeatherDashboard() {
  const {
    location,
    weatherData,
    isLoading,
    error,
    savedLocations,
    searchLocation,
    saveCurrentLocation,
    removeLocation,
    loadSavedLocation,
    getUserLocation,
  } = useWeather();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Weather Dashboard</h1>
          <p className="text-sm opacity-80">Real-time weather data powered by Open-Meteo</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <LocationSearch
          onSearch={searchLocation}
          isLoading={isLoading}
          savedLocations={savedLocations}
          onSaveLocation={saveCurrentLocation}
          onLoadLocation={loadSavedLocation}
          onRemoveLocation={removeLocation}
          onUseCurrentLocation={getUserLocation}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && weatherData && location && (
          <div>
            <CurrentWeather weatherData={weatherData} location={location} />
            <HourlyForecast weatherData={weatherData} />
            <Forecast weatherData={weatherData} />
          </div>
        )}

        {!isLoading && !weatherData && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Welcome to Weather Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Search for a location or use your current location to get started.
            </p>
            <button
              onClick={getUserLocation}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              📍 Use My Location
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Weather Dashboard | Data from Open-Meteo</p>
      </footer>
    </div>
  );
}
