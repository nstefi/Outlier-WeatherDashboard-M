import { useEffect } from 'react';
import WeatherDashboard from '../components/WeatherDashboard';

export default function Home() {
  // Add theme detection
  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <WeatherDashboard />
  );
}
