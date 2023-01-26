import React, { useCallback, useContext, useEffect } from 'react';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { WeatherContext } from '../contexts/Weather';
import { refreshDelay } from '../utils/wait';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';

import DayForecastCard from '../components/DayForecastCard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../constants/Layout';

export default function ({ navigation }: RootTabScreenProps<'DailyTab'>) {

  const theme = useColorScheme()
  const headerHeight = useHeaderHeight()
  const tabBarHeight = useBottomTabBarHeight()
  const styles = makeStyles()

  // Contexts
  const weather = useContext(WeatherContext);
  const forecast = weather.dailyForecast;

  // States
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('');


  useEffect(() => {
    weather.getDailyForecastAsync()
  }, [])

  const reload = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refreshDelay(),
      weather.getDailyForecastAsync()
      // refetch things
    ]).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const city = forecast?.city
    // const country = forecast?.city.country
    if (city) {
      navigation.setOptions({ title: `ClearCast: ${city.name}` })
    }
  }, [forecast?.city])



  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>)

  return (

    <ScreenContainer >

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-tabBarHeight}
        style={{ flex: 1 }}
      >



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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
          data={forecast?.list}
          renderItem={({ item, index, separators }) => <DayForecastCard forecast={forecast} index={index} />}
          // ItemSeparatorComponent={() => <View style={{ height: Layout.margin }} />}
        />


        {/* <View style={{ zIndex: Layout.gradientOverlayZIndex + 1, position: 'relative', bottom: 0, backgroundColor: 'transparent' }}> */}
        <LinearGradient
          colors={[Colors[theme].background + '00', Colors[theme].background + 'aa', Colors[theme].background]}
          locations={[0, 0.3, 1]}
          // style={{ marginTop: -3 * tabBarHeight, paddingBottom: tabBarHeight, paddingTop: tabBarHeight / 2 }}
          style={{ marginTop: -3 * tabBarHeight, paddingBottom: tabBarHeight, paddingTop: tabBarHeight / 2 }}
        >
          <SearchBar
            containerStyle={{ height: tabBarHeight }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Current Location"
          />
        </LinearGradient>


        {/* </View> */}


      </KeyboardAvoidingView>

    </ScreenContainer >

  );
}
