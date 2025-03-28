import { WeatherData, weatherCodeMap } from '../lib/weatherApi';

interface ForecastProps {
  weatherData: WeatherData;
}

export default function Forecast({ weatherData }: ForecastProps) {
  if (!weatherData || !weatherData.daily) {
    return null;
  }

  const { daily } = weatherData;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">7-Day Forecast</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {daily.time.map((time, index) => {
          const date = new Date(time);
          const weatherInfo = weatherCodeMap[daily.weathercode[index]] || { 
            label: 'Unknown', 
            icon: '❓' 
          };
          
          return (
            <div 
              key={time} 
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex flex-col items-center"
            >
              <div className="text-gray-800 dark:text-white font-medium">
                {index === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-4xl my-2">{weatherInfo.icon}</div>
              <div className="text-gray-800 dark:text-white font-medium">
                {Math.round(daily.temperature_2m_max[index])}° / {Math.round(daily.temperature_2m_min[index])}°
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {weatherInfo.label}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                <span className="inline-block mr-1">💧</span>
                {daily.precipitation_sum[index]} mm
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                <span className="inline-block mr-1">☂️</span>
                {daily.precipitation_probability_max[index]}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
