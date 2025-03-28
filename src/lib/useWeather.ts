import { useState, useEffect } from 'react';
import { fetchWeatherData, geocodeLocation, WeatherData } from './weatherApi';

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export function useWeather() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([]);

  // Load saved locations from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedLocations');
      if (saved) {
        setSavedLocations(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load saved locations:', err);
    }
  }, []);

  // Save locations to localStorage when they change
  useEffect(() => {
    if (savedLocations.length > 0) {
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    }
  }, [savedLocations]);

  // Search for a location by name
  const searchLocation = async (locationName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const locationData = await geocodeLocation(locationName);
      
      if (!locationData) {
        setError(`Location "${locationName}" not found`);
        setIsLoading(false);
        return;
      }
      
      setLocation(locationData);
      
      // Fetch weather data for the location
      const weather = await fetchWeatherData({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone,
      });
      
      setWeatherData(weather);
    } catch (err) {
      setError(`Error searching for location: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current location to saved locations
  const saveCurrentLocation = () => {
    if (location && !savedLocations.some(loc => 
      loc.latitude === location.latitude && 
      loc.longitude === location.longitude
    )) {
      setSavedLocations([...savedLocations, location]);
    }
  };

  // Remove a location from saved locations
  const removeLocation = (index: number) => {
    setSavedLocations(savedLocations.filter((_, i) => i !== index));
  };

  // Load weather for a saved location
  const loadSavedLocation = async (locationData: LocationData) => {
    setIsLoading(true);
    setError(null);
    setLocation(locationData);
    
    try {
      const weather = await fetchWeatherData({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezone: locationData.timezone,
      });
      
      setWeatherData(weather);
    } catch (err) {
      setError(`Error loading weather data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's current location and load weather
  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&count=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location name');
          }
          
          const data = await response.json();
          let locationName = 'Current Location';
          let country = '';
          let timezone = 'auto';
          
          if (data.results && data.results.length > 0) {
            locationName = data.results[0].name;
            country = data.results[0].country;
            timezone = data.results[0].timezone;
          }
          
          const locationData = {
            name: locationName,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country,
            timezone,
          };
          
          setLocation(locationData);
          
          // Fetch weather data for the location
          const weather = await fetchWeatherData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone,
          });
          
          setWeatherData(weather);
        } catch (err) {
          setError(`Error getting weather for your location: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(`Error getting your location: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  return {
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
  };
}
