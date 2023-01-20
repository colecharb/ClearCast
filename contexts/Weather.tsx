import React, { createContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export type WeatherData = {
  "coord": {
    "lon": number,
    "lat": number
  },
  "weather": [
    {
      "id": number,
      "main": string,
      "description": string,
      "icon": string
    }
  ],
  "base": string,
  "main": {
    "temp": number,
    "feels_like": number,
    "temp_min": number,
    "temp_max": number,
    "pressure": number,
    "humidity": number,
    "sea_level": number,
    "grnd_level": number
  },
  "visibility": number,
  "wind": {
    "speed": number,
    "deg": number,
    "gust": number
  },
  "rain": {
    "1h": number
  },
  "clouds": {
    "all": number
  },
  "dt": number,
  "sys": {
    "type": number,
    "id": number,
    "country": string,
    "sunrise": number,
    "sunset": number
  },
  "timezone": number,
  "id": number,
  "name": string,
  "cod": number
}

export type WeatherContextData = {
  location: React.MutableRefObject<Location.LocationObject | undefined>,
  currentWeather: WeatherData | undefined,
  getCurrentWeatherAsync: () => Promise<void>,
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
  const [currentWeather, setCurrentWeather] = useState<WeatherData>()

  const API_KEY = 'f82f1ad0af0d696e1c657915946d75c2'
  // const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${57}&lon=${-2.15}&appid=${API_KEY}&units=imperial`

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
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`)
        .then((response) => response.json())
        .then((response) => {
          setCurrentWeather(response)
          console.log('here');
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
    errorMessage: errorMessage
  }

  return (
    <WeatherContext.Provider value={weatherContextData}>
      {children}
    </WeatherContext.Provider>
  );
};