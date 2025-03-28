/**
 * Weather API client for Open-Meteo
 * Documentation: https://open-meteo.com/en/docs
 */

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
  winddirection_10m: number[];
}

export interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
}

export interface WeatherApiParams {
  latitude: number;
  longitude: number;
  timezone?: string;
  current?: boolean;
  hourly?: string[];
  daily?: string[];
  past_days?: number;
  forecast_days?: number;
}

export const weatherCodeMap: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Moderate drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  56: { label: 'Light freezing drizzle', icon: '🌨️' },
  57: { label: 'Dense freezing drizzle', icon: '🌨️' },
  61: { label: 'Slight rain', icon: '🌦️' },
  63: { label: 'Moderate rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  66: { label: 'Light freezing rain', icon: '🌨️' },
  67: { label: 'Heavy freezing rain', icon: '🌨️' },
  71: { label: 'Slight snow fall', icon: '🌨️' },
  73: { label: 'Moderate snow fall', icon: '🌨️' },
  75: { label: 'Heavy snow fall', icon: '❄️' },
  77: { label: 'Snow grains', icon: '❄️' },
  80: { label: 'Slight rain showers', icon: '🌦️' },
  81: { label: 'Moderate rain showers', icon: '🌧️' },
  82: { label: 'Violent rain showers', icon: '⛈️' },
  85: { label: 'Slight snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

/**
 * Fetches weather data from Open-Meteo API
 */
export async function fetchWeatherData(params: WeatherApiParams): Promise<WeatherData> {
  const { latitude, longitude, timezone = 'auto', current = true } = params;
  
  // Default hourly variables if not provided
  const hourly = params.hourly || [
    'temperature_2m',
    'relativehumidity_2m',
    'precipitation_probability',
    'precipitation',
    'weathercode',
    'windspeed_10m',
    'winddirection_10m'
  ];
  
  // Default daily variables if not provided
  const daily = params.daily || [
    'weathercode',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_sum',
    'precipitation_probability_max'
  ];
  
  // Build URL with query parameters
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append('timezone', timezone);
  
  if (current) {
    url.searchParams.append('current_weather', 'true');
  }
  
  if (hourly.length > 0) {
    url.searchParams.append('hourly', hourly.join(','));
  }
  
  if (daily.length > 0) {
    url.searchParams.append('daily', daily.join(','));
  }
  
  if (params.past_days !== undefined) {
    url.searchParams.append('past_days', params.past_days.toString());
  }
  
  if (params.forecast_days !== undefined) {
    url.searchParams.append('forecast_days', params.forecast_days.toString());
  }
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

/**
 * Geocodes a location name to coordinates using Open-Meteo Geocoding API
 */
export async function geocodeLocation(locationName: string): Promise<{
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
} | null> {
  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.append('name', locationName);
    url.searchParams.append('count', '1');
    url.searchParams.append('language', 'en');
    url.searchParams.append('format', 'json');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const result = data.results[0];
    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      timezone: result.timezone
    };
  } catch (error) {
    console.error('Failed to geocode location:', error);
    throw error;
  }
}
