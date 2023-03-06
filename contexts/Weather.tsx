import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { DailyForecast, HourlyForecast, CurrentWeather, HistoricalHours, Units, PlaceDetailsResponse, Place, PlaceNearbyResponse } from '../types';
import Constants from 'expo-constants';
import { LayoutAnimation } from 'react-native';

export type Coordinates = {
  latitude: number,
  longitude: number
}

export type WeatherContextData = {
  units: Units,
  setUnits: React.Dispatch<React.SetStateAction<"imperial" | "metric" | "kelvin">>,
  // toggleTemperatureUnits: () => void,
  coordinates: Coordinates | undefined,
  getCoordinatesAsync: (params?: { placeID: string, sessionToken: string }) => Promise<void>,
  place: Place | undefined,
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
  const [units, setUnits] = useState<Units>('imperial')
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [place, setPlace] = useState<Place>();
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>();
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast>();
  const [dailyForecast, setDailyForecast] = useState<DailyForecast>();
  const [historicalHours, setHistoricalHours] = useState<HistoricalHours>();
  const [loading, setLoading] = useState<boolean>(false);

  const OWM_API_KEY = Constants.expoConfig?.extra?.owmApiKey;
  const GOOGLE_API_KEY = Constants.manifest?.extra?.googleApiKey;

  const CURRENT_WEATHER_URL = "https://pro.openweathermap.org/data/2.5/weather";
  const makeCurrentWeatherUrlParams = (lat: number, lon: number) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=${units}`
  );
  const HOURLY_FORECAST_URL = "https://pro.openweathermap.org/data/2.5/forecast/hourly";
  const makeHourlyForecastUrlParams = (lat: number, lon: number, cnt: number = 96) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  );
  const DAILY_FORECAST_URL = "https://pro.openweathermap.org/data/2.5/forecast/daily";
  const makeDailyForecastUrlParams = (lat: number, lon: number, cnt: number = 4) => (
    `?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&cnt=${cnt}&units=${units}`
  );
  const HISTORICAL_HOURLY_URL = "https://history.openweathermap.org/data/2.5/history/city";
  const makeHistoricalHourlyUrlParams = (lat: number, lon: number, start: number, end: number) => (
    `?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&units=${units}&appid=${OWM_API_KEY}`
  );
  // const HISTORICAL_DAILY_URL = `https://history.openweathermap.org/data/2.5/aggregated/day`;
  // const makeHistoricalDailyUrlParams = (lat: number, lon: number, month: number, day: number) => (
  //   `?lat=${lat}&lon=${lon}&month=${month}&day=${day}&appid=${OWM_API_KEY}`
  // );
  const GOOGLE_PLACES_DETAILS_API_URL = "https://maps.googleapis.com/maps/api/place/details/json?"
  const makeGooglePlacesUrlParams = (placeID: string, sessionToken: string) => (
    `place_id=${placeID}&sessiontoken=${sessionToken}&fields=geometry,name,vicinity&key=${GOOGLE_API_KEY}`
  )

  const GOOGLE_PLACES_NEARBY_API_URL = (theCoords: Coordinates) => (
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${theCoords.latitude},${theCoords.longitude}&type=sublocality&rankby=distance&key=${GOOGLE_API_KEY}`
  );

  async function getCoordinatesAsync(obj?: { placeID: string, sessionToken: string }) {
    if (obj) {
      await fetch(GOOGLE_PLACES_DETAILS_API_URL + makeGooglePlacesUrlParams(obj.placeID, obj.sessionToken), {
        method: 'get'
      }).then((response) => {
        return response.json();
      }).then((response: PlaceDetailsResponse) => {
        // console.log("the data:\n", JSON.stringify(response, null, '  '))
        const theCoords: Coordinates = { latitude: response.result.geometry.location.lat, longitude: response.result.geometry.location.lng };
        // console.log(theCoords);

        setPlace(response.result)
        setCoordinates(theCoords)
        getAllWeatherAsync(theCoords);

      }).catch((err) => {
        console.log(err)
      });

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

      getAllWeatherAsync(theCoords);
      getPlaceAsync(theCoords)
    }
  }

  async function getPlaceAsync(theCoords: Coordinates) {

    // console.log(theCoords);


    await fetch(GOOGLE_PLACES_NEARBY_API_URL(theCoords), {
      method: 'get'
    }).then((response) => {
      return response.json();
    }).then((response: PlaceNearbyResponse) => {
      // console.log(JSON.stringify(response, null, '  '));

      setPlace(response.results[0]);
    })
  }

  async function getCurrentWeatherAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(CURRENT_WEATHER_URL + makeCurrentWeatherUrlParams(coords.latitude, coords.longitude))
      .then((response) => response.json())
      .then((response) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCurrentWeather(response)
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getHourlyForecastAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(HOURLY_FORECAST_URL + makeHourlyForecastUrlParams(coords.latitude, coords.longitude))
      .then((response) => response.json())
      .then((hourlyForecast) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setHourlyForecast(addExtremesToHourlyForecast(hourlyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getDailyForecastAsync(coords: Coordinates) {
    // if (!coordinates) return;
    fetch(DAILY_FORECAST_URL + makeDailyForecastUrlParams(coords.latitude, coords.longitude))
      .then((response) => response.json())
      .then((dailyForecast) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDailyForecast(addExtremesToDailyForecast(dailyForecast))
        // console.log('here');
      })
      .catch((error) => console.error(error))
  }

  async function getHistoricalWeatherAsync(coords: Coordinates) {


    const now = new Date();
    now.setMinutes(0, 0, 0)
    const thisTimeYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfYesterday = new Date(thisTimeYesterday.getFullYear(), thisTimeYesterday.getMonth(), thisTimeYesterday.getDate());

    // console.log(startOfYesterday.getTime(), now.getTime());



    fetch(
      HISTORICAL_HOURLY_URL + makeHistoricalHourlyUrlParams(coords.latitude, coords.longitude, startOfYesterday.getTime() / 1000, now.getTime() / 1000)
    ).then((response) => (
      response.json()
    )).then((historicalHours: HistoricalHours) => {
      // console.log(historicalHours)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  async function getAllWeatherAsync(coords: Coordinates) {
    setLoading(true)
    await Promise.all([
      getCurrentWeatherAsync(coords),
      getDailyForecastAsync(coords),
      getHourlyForecastAsync(coords),
      getHistoricalWeatherAsync(coords),
    ])
    setLoading(false)
    // console.log('got weather');
  }

  async function getWeathersAndPlaceAsync(coords: Coordinates) {
    setLoading(true)
    await Promise.all([
      getPlaceAsync(coords),
      getAllWeatherAsync(coords)
    ])
    setLoading(false)
    // console.log('got weather');
  }

  useEffect(() => {
    getCoordinatesAsync();
  }, [])

  useEffect(() => {
    coordinates ? getAllWeatherAsync(coordinates) : null;
  }, [units])

  const weatherContextData = {
    units: units,
    setUnits: setUnits,
    // toggleTemperatureUnits: toggleTemperatureUnits,
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