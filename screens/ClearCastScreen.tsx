import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { WeatherContext, WeatherContextData } from '../contexts/Weather';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';
import { DayForecastCard } from '../components/ForecastCards';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../constants/Layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ClearCastHeader from '../components/ClearCastHeader';

export default function ({ navigation }: RootStackScreenProps<'ClearCast'>) {

  // hooks
  const theme = useColorScheme();
  const styles = makeStyles();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = 100 //useBottomTabBarHeight();
  const safeAreaInsets = useSafeAreaInsets();

  // weather context
  const weather = useContext(WeatherContext);
  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>);

  // States
  // const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [listHeaderLocation, setListHeaderLocation] = useState<string>()

  // useCityNameInHeaderTitle(navigation, weather)
  // useLocationInSearchBar(weather, setSearchQuery);
  // useLocationInListHeader(setListHeaderLocation, weather);

  // const ListHeaderComponent = () => {
  //   return (
  //     <View style={{ margin: Layout.margin, justifyContent: 'center' }}>
  //       <Text style={{ fontWeight: '200', textAlign: 'center', fontSize: 24, color: Colors[theme].text, marginBottom: Layout.margin / 2 }}>
  //         {'ClearCast'}
  //       </Text>
  //       <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '900' }}>
  //         {listHeaderLocation}
  //       </Text>
  //     </View>
  //   )
  // }

  const renderDayForecastCard = ({ index }: { index: number }) => (
    <DayForecastCard
      weather={weather}
      dailyForecast={weather.dailyForecast}
      index={index}
    />
  );

  return (

    <ScreenContainer>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight / 2}
        style={{ flex: 1 }}
      >
        {weather.loading ? (
          <ActivityIndicator
            size='large'
            style={{ marginTop: headerHeight + Layout.margin }}
          />
        ) : (
          <FlatList
              contentContainerStyle={[styles.container, { paddingTop: headerHeight, paddingBottom: tabBarHeight * 2.5 }]}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              automaticallyAdjustsScrollIndicatorInsets={false}
              // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshWeather} />}
              data={weather.dailyForecast?.list}
              renderItem={renderDayForecastCard}
              // ListHeaderComponent={ClearCastHeader}
            />
        )}

        <LinearGradient
          pointerEvents='box-none'
          colors={[Colors[theme].background + '00', Colors[theme].background + 'aa', Colors[theme].background]}
          locations={[0, 0.3, 1]}
          style={{ marginTop: -3 * tabBarHeight, paddingBottom: tabBarHeight / 2, paddingTop: tabBarHeight / 2 }}
        >
          <SearchBar
            value={searchQuery}
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