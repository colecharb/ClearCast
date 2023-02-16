import React, { createContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { DailyForecast, HourlyForecast, CurrentWeather, HistoricalHours } from '../types';
import Constants from 'expo-constants';
import { refreshDelay } from '../utils/wait';

export type Coordinates = {
  latitude: number,
  longitude: number
}

export type WeatherContextData = {
  coordinates: Coordinates | undefined,
  getCoordinatesAsync: (address?: string) => Promise<void>,
  place: LocationGeocodedAddress | undefined,
  currentWeather: CurrentWeather | undefined,
  hourlyForecast: HourlyForecast | undefined,
  dailyForecast: DailyForecast | undefined,
  historicalHours: HistoricalHours | undefined,
  loading: boolean,
  errorMessage: string | undefined,
}

export type LocationGeocodedAddress = {
  city: string | null,
  country: string | null,
  district: string | null,
  isoCountryCode: string | null,
  name: string | null,
  postalCode: string | null,
  region: string | null,
  street: string | null,
  streetNumber: string | null,
  subregion: string | null,
  timezone: string | null,
}

const addExtremesToHourlyForecast = (forecast: HourlyForecast) => {
  const temps = forecast.list.map((interval) => interval.main.temp);
  forecast.minTemp = Math.min(...temps);
  forecast.maxTemp = Math.max(...temps);
  forecast.minLow = Math.min(...forecast.list.map((interval) => interval.main.temp_min));
  forecast.maxHigh = Math.max(...forecast.list.map((interval) => interval.main.temp_max));
  return forecast
}

const addExtremesToDailyForecast = (forecast: DailyForecast) => {
  forecast.minLow = Math.min(...forecast.list.map((day) => day.temp.min));
  forecast.maxHigh = Math.max(...forecast.list.map((day) => day.temp.max));
  return forecast;
}

// Create the Auth Context with the data type specified
// and an empty object typed as such
export const WeatherContext = createContext({} as WeatherContextData);

export const WeatherProvider = ({ children }: { children: any }) => {

  // console.log('AuthProvider has been called.');
  const [errorMessage, setErrorMessage] = useState<string>();

  // hooks
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [place, setPlace] = useState<LocationGeocodedAddress>();
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>();
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast>();
  const [dailyForecast, setDailyForecast] = useState<DailyForecast>();
  const [historicalHours, setHistoricalHours] = useState<HistoricalHours>();
  const [loading, setLoading] = useState<boolean>(false);

  const OWM_API_KEY = Constants.expoConfig?.extra?.owmApiKey;

  const CURRENT_WEATHER_URL = "https://pro.openweathermap.org/data/2.5/weather";
  const makeCurrentWeatherUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric') => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=${units}`
  );
  const HOURLY_FORECAST_URL = "https://pro.openweathermap.org/data/2.5/forecast/hourly";
  const makeHourlyForecastUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric', cnt: number = 96) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  );
  const DAILY_FORECAST_URL = "https://pro.openweathermap.org/data/2.5/forecast/daily";
  const makeDailyForecastUrlParams = (lat: number, lon: number, units: 'imperial' | 'metric', cnt: number = 5) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  );



  async function getCoordinatesAsync(address?: string) {
    if (address) {
      const potentialLocations = await Location.geocodeAsync(address)
      const theCoords: Coordinates = {
        latitude: potentialLocations[0].latitude,
        longitude: potentialLocations[0].longitude
      }
      setCoordinates(theCoords);

      getWeathersAndPlaceAsync(theCoords);

    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }
      const theLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const theCoords: Coordinates = { latitude: theLocation.coords.latitude, longitude: theLocation.coords.longitude }
      setCoordinates(theCoords)
      // console.log(theCoords);

      getWeathersAndPlaceAsync(theCoords);
    }
  }

  async function getPlaceAsync(coords: Coordinates) {
    const places = await Location.reverseGeocodeAsync({ ...coords });
    setPlace(places[0]);
  }

  async function getCurrentWeatherAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(CURRENT_WEATHER_URL + makeCurrentWeatherUrlParams(coords.latitude, coords.longitude, 'imperial'))
      .then((response) => response.json())
      .then((response) => {
        setCurrentWeather(response)
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getHourlyForecastAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(HOURLY_FORECAST_URL + makeHourlyForecastUrlParams(coords.latitude, coords.longitude, 'imperial'))
      .then((response) => response.json())
      .then((hourlyForecast) => {
        setHourlyForecast(addExtremesToHourlyForecast(hourlyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getDailyForecastAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(DAILY_FORECAST_URL + makeDailyForecastUrlParams(coords.latitude, coords.longitude, 'imperial'))
      .then((response) => response.json())
      .then((dailyForecast) => {
        setDailyForecast(addExtremesToDailyForecast(dailyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getHistoricalWeatherAsync(coords: Coordinates) {
    const HISTORICAL_HOURLY_URL = "https://history.openweathermap.org/data/2.5/history/city";
    const makeHistoricalHourlyUrlParams = (lat: number, lon: number, start: number, end: number, units: 'imperial' | 'metric') => (
      `?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&units=${units}&appid=${OWM_API_KEY}`
    );
    // const HISTORICAL_DAILY_URL = `https://history.openweathermap.org/data/2.5/aggregated/day`;
    // const makeHistoricalDailyUrlParams = (lat: number, lon: number, month: number, day: number) => (
    //   `?lat=${lat}&lon=${lon}&month=${month}&day=${day}&appid=${OWM_API_KEY}`
    // );

    const now = new Date();
    now.setMinutes(0, 0, 0)
    const thisTimeYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfYesterday = new Date(thisTimeYesterday.getFullYear(), thisTimeYesterday.getMonth(), thisTimeYesterday.getDate());

    console.log(startOfYesterday.getTime(), now.getTime());



    fetch(
      HISTORICAL_HOURLY_URL + makeHistoricalHourlyUrlParams(coords.latitude, coords.longitude, startOfYesterday.getTime() / 1000, now.getTime() / 1000, 'imperial')
    ).then((response) => (
      response.json()
    )).then((historicalHours: HistoricalHours) => {
      console.log(historicalHours)
      setHistoricalHours(historicalHours)
    }).catch((error) => {
      console.error(error)
    });

    // fetch(
    //   HISTORICAL_DAILY_URL + makeHistoricalDailyUrlParams(coords.latitude, coords.longitude, thisTimeYesterday.getMonth(), thisTimeYesterday.getDate())
    // ).then((response) => (
    //   response.json()
    // )).then((yesterday))
  }

  async function getWeathersAndPlaceAsync(coords: Coordinates) {
    setLoading(true)
    await Promise.all([
      getPlaceAsync(coords),
      getCurrentWeatherAsync(coords),
      getDailyForecastAsync(coords),
      getHourlyForecastAsync(coords),
      getHistoricalWeatherAsync(coords),
    ])
    setLoading(false)
    // console.log('got weather');
  }

  useEffect(() => {
    getCoordinatesAsync();
  }, [])

  // useEffect(() => {
  //   getAllWeatherAsync()
  // }, [coordinates])

  const weatherContextData = {
    coordinates: coordinates,
    place: place,
    getCoordinatesAsync: getCoordinatesAsync,
    currentWeather: currentWeather,
    // getCurrentWeatherAsync: getCurrentWeatherAsync,
    hourlyForecast: hourlyForecast,
    // getHourlyForecastAsync: getHourlyForecastAsync,
    dailyForecast: dailyForecast,
    // getDailyForecastAsync: getDailyForecastAsync,
    historicalHours: historicalHours,
    loading: loading,
    errorMessage: errorMessage
  }

  return (
    <WeatherContext.Provider value={weatherContextData}>
      {children}
    </WeatherContext.Provider>
  );
};