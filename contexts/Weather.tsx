import React, { createContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Forecast, Weather } from '../types';

export type WeatherContextData = {
  location: React.MutableRefObject<Location.LocationObject | undefined>,
  currentWeather: Weather | undefined,
  getCurrentWeatherAsync: () => Promise<void>,
  hourlyForecast: Forecast | undefined,
  getHourlyForecastAsync: () => Promise<void>,
  errorMessage: string | undefined,
};

// Create the Auth Context with the data type specified
// and an empty object typed as such
export const WeatherContext = createContext({} as WeatherContextData);

export const WeatherProvider = ({ children }: { children: any }) => {

  // console.log('AuthProvider has been called.');
  const [errorMessage, setErrorMessage] = useState<string>()

  // location hooks
  // const [locationWatcher, setLocationWatcher] = useState<Location.LocationSubscription>();
  const location = useRef<Location.LocationObject>()
  const [currentWeather, setCurrentWeather] = useState<Weather>()
  const [hourlyForecast, setHourlyForecast] = useState<Forecast>()

  const API_KEY = 'f82f1ad0af0d696e1c657915946d75c2'
  const CURRENT_WEATHER_URL = `https://pro.openweathermap.org/data/2.5/weather`
  const HOURLY_FORECAST_URL = `https://pro.openweathermap.org/data/2.5/forecast/hourly`
  // easy way to generate params to append either API URL
  const makeUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric') => (
    `?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  )

  async function getCurrentWeatherAsync() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
      return;
    }
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }).then((loc: Location.LocationObject) => {
      location.current = loc;
      // console.log(loc);
      const { latitude, longitude } = loc.coords;
      fetch(CURRENT_WEATHER_URL + makeUrlParams(latitude, longitude, 'imperial'))
        .then((response) => response.json())
        .then((response) => {
          setCurrentWeather(response)
          // console.log('here');
        })
        .catch((error) => console.error(error))
    }).catch((error: string) => {
      console.log(error);
    })
  }

  async function getHourlyForecastAsync() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission to access location was denied');
      return;
    }
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }).then((loc: Location.LocationObject) => {
      location.current = loc;
      // console.log(loc);
      const { latitude, longitude } = loc.coords;
      fetch(HOURLY_FORECAST_URL + makeUrlParams(latitude, longitude, 'imperial'))
        .then((response) => response.json())
        .then((response) => {
          setHourlyForecast(response)
          // console.log('here');
        })
        .catch((error) => console.error(error))
    }).catch((error: string) => {
      console.log(error);
    })
  }

  const weatherContextData = {
    location: location,
    currentWeather: currentWeather,
    getCurrentWeatherAsync: getCurrentWeatherAsync,
    hourlyForecast: hourlyForecast,
    getHourlyForecastAsync: getHourlyForecastAsync,
    errorMessage: errorMessage
  }

  return (
    <WeatherContext.Provider value={weatherContextData}>
      {children}
    </WeatherContext.Provider>
  );
};

export const fetchIcon = async (icon: string) => {
  const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
  const response = await fetch(iconURL)
  return URL.createObjectURL(await response.blob());
}