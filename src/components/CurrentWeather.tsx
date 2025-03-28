import { WeatherData, weatherCodeMap } from '../lib/weatherApi';
import { LocationData } from '../lib/useWeather';

interface CurrentWeatherProps {
  weatherData: WeatherData;
  location: LocationData;
}

export default function CurrentWeather({ weatherData, location }: CurrentWeatherProps) {
  if (!weatherData || !weatherData.current_weather) {
    return null;
  }

  const { current_weather } = weatherData;
  const weatherInfo = weatherCodeMap[current_weather.weathercode] || { 
    label: 'Unknown', 
    icon: '❓' 
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {location.name}, {location.country}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date(current_weather.time).toLocaleString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <span className="text-6xl mr-4">{weatherInfo.icon}</span>
          <div>
            <div className="text-4xl font-bold text-gray-800 dark:text-white">
              {Math.round(current_weather.temperature)}°C
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {weatherInfo.label}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Wind</div>
          <div className="text-gray-800 dark:text-white font-medium">
            {Math.round(current_weather.windspeed)} km/h
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            Direction: {current_weather.winddirection}°
          </div>
        </div>
        
        {weatherData.hourly && (
          <>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 text-sm">Humidity</div>
              <div className="text-gray-800 dark:text-white font-medium">
                {weatherData.hourly.relativehumidity_2m[0]}%
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400 text-sm">Precipitation</div>
              <div className="text-gray-800 dark:text-white font-medium">
                {weatherData.hourly.precipitation[0]} mm
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Chance: {weatherData.hourly.precipitation_probability[0]}%
              </div>
            </div>
          </>
        )}
        
        {weatherData.daily && (
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Today</div>
            <div className="text-gray-800 dark:text-white font-medium">
              {Math.round(weatherData.daily.temperature_2m_max[0])}° / {Math.round(weatherData.daily.temperature_2m_min[0])}°
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
