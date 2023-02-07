import React, { createContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { DailyForecast, HourlyForecast, Weather } from '../types';
import Constants from 'expo-constants';

export type Coordinates = {
  latitude: number,
  longitude: number
}

export type WeatherContextData = {
  coordinates: Coordinates | undefined,
  getCoordinatesAsync: (address?: string) => Promise<void>,
  currentWeather: Weather | undefined,
  // getCurrentWeatherAsync: () => Promise<void>,
  hourlyForecast: HourlyForecast | undefined,
  // getHourlyForecastAsync: () => Promise<void>,
  dailyForecast: DailyForecast | undefined,
  // getDailyForecastAsync: () => Promise<void>,
  loading: boolean,
  errorMessage: string | undefined,
};

const addExtremesToHourlyForecast = (forecast: HourlyForecast) => {
  const temps = forecast.list.map((interval) => interval.main.temp)
  forecast.minTemp = Math.min(...temps)
  forecast.maxTemp = Math.max(...temps)
  forecast.minLow = Math.min(...forecast.list.map((interval) => interval.main.temp_min))
  forecast.maxHigh = Math.max(...forecast.list.map((interval) => interval.main.temp_max))
  return forecast
}

const addExtremesToDailyForecast = (forecast: DailyForecast) => {
  forecast.minLow = Math.min(...forecast.list.map((day) => day.temp.min))
  forecast.maxHigh = Math.max(...forecast.list.map((day) => day.temp.max))
  return forecast
}

// Create the Auth Context with the data type specified
// and an empty object typed as such
export const WeatherContext = createContext({} as WeatherContextData);

export const WeatherProvider = ({ children }: { children: any }) => {

  // console.log('AuthProvider has been called.');
  const [errorMessage, setErrorMessage] = useState<string>()

  // hooks
  const [coordinates, setCoordinates] = useState<Coordinates>()
  const [currentWeather, setCurrentWeather] = useState<Weather>()
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast>()
  const [dailyForecast, setDailyForecast] = useState<DailyForecast>()
  const [loading, setLoading] = useState<boolean>(false)

  const OWM_API_KEY = Constants.expoConfig?.extra?.owmApiKey;

  const CURRENT_WEATHER_URL = `https://pro.openweathermap.org/data/2.5/weather`
  const makeCurrentWeatherUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric') => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=${units}`
  )
  const HOURLY_FORECAST_URL = `https://pro.openweathermap.org/data/2.5/forecast/hourly`
  const makeHourlyForecastUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric', cnt: number = 96) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  )
  const DAILY_FORECAST_URL = `https://pro.openweathermap.org/data/2.5/forecast/daily`
  const makeDailyForecastUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric', cnt: number = 5) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  )

  async function getCoordinatesAsync(address?: string) {
    if (address) {
      const potentialLocations = await Location.geocodeAsync(address)
      const theCoords: Coordinates = {
        latitude: potentialLocations[0].latitude,
        longitude: potentialLocations[0].longitude
      }
      setCoordinates(theCoords)
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).then((loc: Location.LocationObject) => {
        const theCoords: Coordinates = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
        setCoordinates(theCoords)
      });
    }

  }

  async function getCurrentWeatherAsync() {
    if (!coordinates) return;
    fetch(CURRENT_WEATHER_URL + makeCurrentWeatherUrlParams(coordinates.latitude, coordinates.longitude, 'imperial'))
      .then((response) => response.json())
      .then((response) => {
        setCurrentWeather(response)
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getHourlyForecastAsync() {
    if (!coordinates) return;
    fetch(HOURLY_FORECAST_URL + makeHourlyForecastUrlParams(coordinates.latitude, coordinates.longitude, 'imperial'))
      .then((response) => response.json())
      .then((hourlyForecast) => {
        setHourlyForecast(addExtremesToHourlyForecast(hourlyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getDailyForecastAsync() {
    if (!coordinates) return;
    fetch(DAILY_FORECAST_URL + makeDailyForecastUrlParams(coordinates.latitude, coordinates.longitude, 'imperial'))
      .then((response) => response.json())
      .then((dailyForecast) => {
        setDailyForecast(addExtremesToDailyForecast(dailyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    getCoordinatesAsync()
  }, [])

  useEffect(() => {
    async function getWeather() {
      setLoading(true)
      await Promise.all([
        getCurrentWeatherAsync(),
        getDailyForecastAsync(),
        getHourlyForecastAsync(),
        // refreshDelay()
      ])
      setLoading(false)
      console.log('got weather');
    }
    getWeather()
  }, [coordinates])

  const weatherContextData = {
    coordinates: coordinates,
    getCoordinatesAsync: getCoordinatesAsync,
    currentWeather: currentWeather,
    // getCurrentWeatherAsync: getCurrentWeatherAsync,
    hourlyForecast: hourlyForecast,
    // getHourlyForecastAsync: getHourlyForecastAsync,
    dailyForecast: dailyForecast,
    // getDailyForecastAsync: getDailyForecastAsync,
    loading: loading,
    errorMessage: errorMessage
  }

  return (
    <WeatherContext.Provider value={weatherContextData}>
      {children}
    </WeatherContext.Provider>
  );
};