import { useState, useEffect } from 'react';
import { WeatherData } from '../lib/weatherApi';
import { LocationData } from '../lib/useWeather';

interface HourlyForecastProps {
  weatherData: WeatherData;
}

export default function HourlyForecast({ weatherData }: HourlyForecastProps) {
  if (!weatherData || !weatherData.hourly) {
    return null;
  }

  const { hourly } = weatherData;
  
  // Get the next 24 hours of data
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    weathercode: hourly.weathercode[index],
    precipitation: hourly.precipitation[index],
    precipitation_probability: hourly.precipitation_probability[index],
    windspeed: hourly.windspeed_10m[index],
    winddirection: hourly.winddirection_10m[index],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 overflow-x-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Hourly Forecast</h2>
      
      <div className="flex space-x-4 pb-2">
        {next24Hours.map((hour) => {
          const date = new Date(hour.time);
          const weatherCode = weatherData.hourly.weathercode[next24Hours.findIndex(h => h.time === hour.time)];
          const weatherInfo = weatherData.hourly.weathercode ? { 
            icon: '☀️',  // Default icon
            label: 'Clear'
          } : { icon: '❓', label: 'Unknown' };
          
          // Get the correct weather icon and label based on the weather code
          if (weatherCode !== undefined) {
            const weatherCodeInfo = {
              0: { icon: '☀️', label: 'Clear' },
              1: { icon: '🌤️', label: 'Mainly clear' },
              2: { icon: '⛅', label: 'Partly cloudy' },
              3: { icon: '☁️', label: 'Overcast' },
              45: { icon: '🌫️', label: 'Fog' },
              48: { icon: '🌫️', label: 'Depositing rime fog' },
              51: { icon: '🌦️', label: 'Light drizzle' },
              53: { icon: '🌦️', label: 'Moderate drizzle' },
              55: { icon: '🌧️', label: 'Dense drizzle' },
              56: { icon: '🌨️', label: 'Light freezing drizzle' },
              57: { icon: '🌨️', label: 'Dense freezing drizzle' },
              61: { icon: '🌦️', label: 'Slight rain' },
              63: { icon: '🌧️', label: 'Moderate rain' },
              65: { icon: '🌧️', label: 'Heavy rain' },
              66: { icon: '🌨️', label: 'Light freezing rain' },
              67: { icon: '🌨️', label: 'Heavy freezing rain' },
              71: { icon: '🌨️', label: 'Slight snow fall' },
              73: { icon: '🌨️', label: 'Moderate snow fall' },
              75: { icon: '❄️', label: 'Heavy snow fall' },
              77: { icon: '❄️', label: 'Snow grains' },
              80: { icon: '🌦️', label: 'Slight rain showers' },
              81: { icon: '🌧️', label: 'Moderate rain showers' },
              82: { icon: '⛈️', label: 'Violent rain showers' },
              85: { icon: '🌨️', label: 'Slight snow showers' },
              86: { icon: '❄️', label: 'Heavy snow showers' },
              95: { icon: '⛈️', label: 'Thunderstorm' },
              96: { icon: '⛈️', label: 'Thunderstorm with slight hail' },
              99: { icon: '⛈️', label: 'Thunderstorm with heavy hail' },
            }[weatherCode];
            
            if (weatherCodeInfo) {
              weatherInfo.icon = weatherCodeInfo.icon;
              weatherInfo.label = weatherCodeInfo.label;
            }
          }
          
          return (
            <div 
              key={hour.time} 
              className="flex flex-col items-center min-w-[80px]"
            >
              <div className="text-gray-800 dark:text-white">
                {date.getHours()}:00
              </div>
              <div className="text-3xl my-2">{weatherInfo.icon}</div>
              <div className="text-gray-800 dark:text-white font-medium">
                {Math.round(hour.temperature)}°C
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                <span className="inline-block mr-1">💧</span>
                {hour.precipitation_probability}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-xs">
                <span className="inline-block mr-1">💨</span>
                {Math.round(hour.windspeed)} km/h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
