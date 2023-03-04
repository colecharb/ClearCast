/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  ClearCast: undefined;
  Settings: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {

  SettingsTab: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export const ALL_UNITS = ['imperial', 'metric', 'kelvin'] as const;
type UnitTuple = typeof ALL_UNITS;
export type Units = UnitTuple[number];

export type Conditions = {
  "id": number,
  "main": string,
  "description": string,
  "icon": string
}

export type CurrentWeather = {
  "coord": {
    "lon": number,
    "lat": number
  },
  "weather": Conditions[],
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

export type HourInterval = {
  "__typename": "HourInterval",
  "dt": number,
  "main": {
    "temp": number,
    "feels_like": number,
    "temp_min": number,
    "temp_max": number,
    "pressure": number,
    "sea_level": number,
    "grnd_level": number,
    "humidity": number,
    "temp_kf": number
  },
  "weather": Conditions[],
  "clouds": {
    "all": number
  },
  "wind": {
    "speed": number,
    "deg": number,
    "gust": number
  },
  "visibility": number,
  "pop": number,
  "rain": {
    "3h": number
  },
  "sys": {
    "pod": string
  },
  "dt_txt": string
}

export type HourlyForecast = {
  "__typename": "HourlyForecast",
  "cod": string,
  "message": number,
  "cnt": number,
  "list": HourInterval[],
  "minTemp": number,
  "maxTemp": number,
  "minLow": number,
  "maxHigh": number,
  "city": {
    "id": number,
    "name": string,
    "coord": {
      "lat": number,
      "lon": number
    },
    "country": string,
    "population": number,
    "timezone": number,
    "sunrise": number,
    "sunset": number
  }
}

export type DayInterval = {
  "__typename": "DayInterval",
  "dt": number,
  "sunrise": number,
  "sunset": number,
  "temp": {
    "day": number,
    "min": number,
    "max": number,
    "night": number,
    "eve": number,
    "morn": number
  },
  "feels_like": {
    "day": number,
    "night": number,
    "eve": number,
    "morn": number
  },
  "pressure": number,
  "humidity": number,
  "weather": [
    {
      "id": number,
      "main": string,
      "description": string,
      "icon": string
    }
  ],
  "speed": number,
  "deg": number,
  "gust": number,
  "clouds": number,
  "pop": number,
  "rain": number,
  "snow": number,
}

export type DailyForecast = {
  "__typename": "DailyForecast",
  "city": {
    "id": number,
    "name": string,
    "coord": {
      "lon": number,
      "lat": number
    },
    "country": string,
    "population": number,
    "timezone": number
  },
  "cod": string,
  "message": number,
  "cnt": number,
  "list": DayInterval[]
  "minLow": number,
  "maxHigh": number
}

export type HistoricalHourInterval = {
  "dt": number,
  "main": {
    "temp": number,
    "feels_like": number,
    "pressure": number,
    "humidity": number,
    "temp_min": number,
    "temp_max": number
  },
  "wind": {
    "speed": number,
    "deg": number
  },
  "clouds": {
    "all": number
  },
  "weather": [
    {
      "id": number,
      "main": string,
      "description": string,
      "icon": string
    }
  ],
  "rain": {
    "1h": number,
    "3h": number
  },
  "snow": {
    "1h": number,
    "3h": number
  }
}

export type HistoricalHours = {
  "message": string,
  "cod": string,
  "city_id": number,
  "calctime": number,
  "cnt": number,
  "list": HistoricalHourInterval[],
}

// types for google places autocomplete responses
export type PlaceAutocompletePrediction = {
  "description": string,
  "matched_substrings": { [key: string]: number }[], //[{ "length": 5, "offset": 0 }],
  "place_id": string,
  "reference": string,
  "structured_formatting": {
    "main_text": string,
    "main_text_matched_substrings": { [key: string]: number }[], //[{ "length": 5, "offset": 0 }],
    "secondary_text": string,
  },
  "terms": { [key: string]: number }[],
  "types": string[], //["locality", "political", "geocode"],
};

export type PlacesAutocompleteStatus = ('OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR');

export type PlacesAutocompleteResponse = {
  predictions: PlaceAutocompletePrediction[],
  status: PlacesAutocompleteStatus,
  error_message: string,
  info_messages: string[],
};


// types for google places details responses
type AddressComponent = {
  long_name: string,
  short_name: string,
  types: string[],
}

export type Place = {
  name: string,
  vicinity: string,
  geometry: {
    location: { "lat": number, "lng": number },
    viewport: {
      northeast: { "lat": number, "lng": number },
      southwest: { "lat": number, "lng": number },
    },
  },

  // fill this type out with additional fields as necessary
}

type PlaceDetailsStatus = 'OK' | 'ZERO_RESULTS' | 'NOT_FOUND' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';

export type PlaceDetailsResponse = {
  html_attributions: string[],
  result: Place,
  status: PlaceDetailsStatus,
  info_messages: string[],
}

type PlaceSearchStatus = 'OK' | 'ZERO_RESULTS' | 'INVALID_REQUEST' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR';

export type PlaceNearbyResponse = {
  html_attributions: string[],
  results: Place[],
  status: PlaceSearchStatus,
  info_messages: string[],
  error_message: string,
  next_page_token: string,
}