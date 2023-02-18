import React, { useContext } from 'react';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { WeatherContext } from '../contexts/Weather';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';
import { DayForecastCard } from '../components/ForecastCards';
import { LinearGradient } from 'expo-linear-gradient';
import CurrentWeather from '../components/CurrentWeather';
import HorizontalLine from '../components/HorizontalLine';
import Layout from '../constants/Layout';

export default function ({ navigation }: RootStackScreenProps<'ClearCast'>) {

  // hooks
  const theme = useColorScheme();
  const styles = makeStyles();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = 100 //useBottomTabBarHeight();

  // weather context
  const weather = useContext(WeatherContext);
  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>);

  // States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);

  Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true));
  Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false));

  const renderDayForecastCard = ({ index }: { index: number }) => (
    <DayForecastCard
      weather={weather}
      dailyForecast={weather.dailyForecast}
      index={index}
    />
  );

  return (
    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight}
        style={{ flex: 1 }}
      >
        {!weather.dailyForecast ? (
          <ActivityIndicator
            size='large'
            style={{ flex: 1, paddingBottom: tabBarHeight }}
          />
        ) : (
          <FlatList
              contentContainerStyle={[styles.container, { paddingTop: headerHeight, paddingBottom: Layout.window.height / 4 }]}
              style={{ flex: 1, opacity: (keyboardOpen ? 0.5 : 1) }}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              automaticallyAdjustsScrollIndicatorInsets={false}
              data={weather.dailyForecast?.list}
              renderItem={renderDayForecastCard}
              ItemSeparatorComponent={HorizontalLine}
              ListHeaderComponent={CurrentWeather}
            />
        )}

        <LinearGradient
          pointerEvents='box-none'
          colors={[Colors[theme].background + '00', Colors[theme].background + 'bb', Colors[theme].background]}
          locations={[0, 0.3, 1]}
          style={{ marginTop: -1.5 * tabBarHeight - 100, paddingBottom: tabBarHeight, paddingTop: tabBarHeight / 2 }}
        >
          <SearchBar
            value={searchQuery}
            style={{ height: 100 }}
            onChangeText={setSearchQuery}
            placeholder={'Search'}
            onSubmitEditing={() => {
              weather.getCoordinatesAsync(searchQuery);
            }}
            // onCancel={() => setSearchQueryToLocation(weather, setSearchQuery)}
            // onEndEditing={() => setSearchQueryToLocation(weather, setSearchQuery)}
          />
        </LinearGradient>


        {/* </View> */}


      </KeyboardAvoidingView>

    </ScreenContainer >

  );
}

// const useRefreshWeather = (weather: WeatherContextData, setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => {
//   useCallback(() => {
//     setRefreshing(true);
//     Promise.all([
//       refreshDelay(),
//       getWeatherAsync(weather)
//     ]).then(() => setRefreshing(false));
//   }, []);
// }

// const useLocationInListHeader = (setListHeaderLocation: React.Dispatch<React.SetStateAction<string | undefined>>, weather: WeatherContextData) => {
//   useEffect(() => {
//     if (weather.place) {
//       setListHeaderLocation(`${weather.place.city}, ${weather.place.region}`)
//     }
//   }, [weather.place]);
// };