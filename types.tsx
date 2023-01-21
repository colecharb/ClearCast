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
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  ForecastTab: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type Conditions = {
  "id": number,
  "main": string,
  "description": string,
  "icon": string
}

export type Weather = {
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

export type ForecastInterval = {
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

export type Forecast = {
  "cod": string,
  "message": number,
  "cnt": number,
  "list": ForecastInterval[],
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