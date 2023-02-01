import React, { useCallback, useContext, useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, SectionList } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { DailyForecast, HourInterval, HourlyForecast, RootTabScreenProps } from '../types';
import { WeatherContext, WeatherContextData } from '../contexts/Weather';
import { refreshDelay } from '../utils/wait';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';
import { DayForecastCard } from '../components/ForecastCards';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../constants/Layout';


export default function ({ navigation }: RootTabScreenProps<'ClearCast'>) {

  // hooks
  const theme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = makeStyles();

  // weather context
  const weather = useContext(WeatherContext);
  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>);

  // States
  // const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useCityNameInHeaderTitle(navigation, weather)

  const renderDayForecastCard = ({ index }: { index: number }) => (
    <DayForecastCard
      weather={weather}
      dailyForecast={weather.dailyForecast}
      index={index}
    />
  )

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight}
        style={{ flex: 1 }}
      >
        {weather.loading ? (
          <ActivityIndicator
            size='large'
            style={{ marginTop: headerHeight + Layout.margin }}
          />
        ) : (
          <FlatList
          contentContainerStyle={[
            styles.container,
            { paddingTop: headerHeight, paddingBottom: tabBarHeight * 2.5 }
          ]}
          style={{ flex: 1 }}
          // contentInset={{ top: headerHeight, left: 0, right: 0, bottom: 0 }}
          // initialScrollIndex={1}
          // getItemLayout={(data, index) => ({
          //   length: styles,
          //   offset: Layout.margin,
          //   index:
          // })}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          automaticallyAdjustsScrollIndicatorInsets={false}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshWeather} />}
          data={weather.dailyForecast?.list}
          renderItem={renderDayForecastCard}
        // ItemSeparatorComponent={() => <View style={{ height: Layout.margin }} />}
        />
        )}



        {/* <View style={{ zIndex: Layout.gradientOverlayZIndex + 1, position: 'relative', bottom: 0, backgroundColor: 'transparent' }}> */}
        <LinearGradient
          pointerEvents='box-none'
          colors={[Colors[theme].background + '00', Colors[theme].background + 'aa', Colors[theme].background]}
          locations={[0, 0.3, 1]}
          // style={{ marginTop: -3 * tabBarHeight, paddingBottom: tabBarHeight, paddingTop: tabBarHeight / 2 }}
          style={{ marginTop: -3 * tabBarHeight, paddingBottom: tabBarHeight, paddingTop: tabBarHeight / 2 }}
        >
          <SearchBar
            containerStyle={{ height: tabBarHeight }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            onSubmitEditing={() => weather.getCoordinatesAsync(searchQuery)}
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

const useCityNameInHeaderTitle = (navigation: any, weather: WeatherContextData) => {
  useEffect(() => {
    const city = weather.dailyForecast?.city
    // const country = forecast?.city.country
    if (city) {
      navigation.setOptions({ title: `ClearCast: ${city.name}` })
    }
  }, [weather.dailyForecast?.city])
}