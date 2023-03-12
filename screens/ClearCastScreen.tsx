import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, Pressable, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text } from '../components/Themed';
import { PlacesAutocompleteResponse, RootStackScreenProps } from '../types';
import { WeatherContext } from '../contexts/Weather';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import makeStyles from '../constants/Styles';
import { DayForecastCard } from '../components/ForecastCards';
import { LinearGradient } from 'expo-linear-gradient';
import CurrentWeather from '../components/CurrentWeather';
import HorizontalLine from '../components/HorizontalLine';
import Layout from '../constants/Layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from "expo-constants";
import AutocompleteResults from '../components/AutocompleteResults';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import ClearCastHeader from '../components/ClearCastHeader';


export default function ({ navigation }: RootStackScreenProps<'ClearCast'>) {

  // hooks
  const theme = useColorScheme();
  const styles = makeStyles();
  const headerHeight = useHeaderHeight();
  const searchBarHeight = 100 //useBottomTabBarHeight();
  const safeAreaInsets = useSafeAreaInsets();

  // weather context
  const weather = useContext(WeatherContext);
  if (weather.errorMessage) return (<Text>{weather.errorMessage}</Text>);

  // States
  const initUuid = uuidv4();
  const [sessionToken, setSessionToken] = useState<string>(initUuid);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [autocompleteResponse, setAutocompleteResponse] = useState<PlacesAutocompleteResponse>();

  const GOOGLE_API_KEY = Constants.manifest?.extra?.googleApiKey;
  const GOOGLE_PLACES_AUTOCOMPLETE_API_URL = (
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchQuery}&sessiontoken=${sessionToken}&key=${GOOGLE_API_KEY}`
  );
  // &types=locality|sublocality|neighborhood|colloquial_area|postal_code

  Keyboard.addListener('keyboardWillShow', () => {
    setKeyboardOpen(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  });
  Keyboard.addListener('keyboardWillHide', () => {
    setKeyboardOpen(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  });

  async function placesAutoComplete() {
    if (!GOOGLE_API_KEY) {
      console.log('no goog maps api key found')
      return null
    }
    console.log(GOOGLE_PLACES_AUTOCOMPLETE_API_URL);

    fetch(GOOGLE_PLACES_AUTOCOMPLETE_API_URL, {
      method: 'get'
    }).then((response) => {
      return response.json();
    }).then((response) => {
      // console.log("the data:\n", JSON.stringify(response, null, '  '))
      setAutocompleteResponse(response)
    }).catch((err) => {
      console.log(err)
    });
  }

  // fetch autocomplete upon changing search query
  useEffect(() => {
    placesAutoComplete()
  }, [searchQuery])

  const renderDayForecastCard = ({ index }: { index: number }) => (
    <DayForecastCard
      weather={weather}
      dailyForecast={weather.dailyForecast}
      index={index}
    />
  );

  const SearchZone = (
    <LinearGradient
      pointerEvents='box-none'
      colors={[Colors[theme].background + '00', Colors[theme].background + 'bb', Colors[theme].background]}
      locations={[0, 0.3, 1]}
      style={{ bottom: 0, left: 0, right: 0, paddingTop: (keyboardOpen ? 0 : searchBarHeight / 2), paddingBottom: safeAreaInsets.bottom }}
    >

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {keyboardOpen ? (
          null
        ) : (
          <Pressable onPress={() => {
            weather.getCoordinatesAsync(undefined);
            setSearchQuery('');
          }}>
            <Icon
              name='location-arrow'
              size={25}
              color={Colors[theme].text}
              style={{ padding: Layout.margin, marginLeft: Layout.margin }}
            />
          </Pressable>
        )}

        <SearchBar
          value={searchQuery}
          style={{ height: searchBarHeight }}
          containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
          onChangeText={setSearchQuery}
          placeholder={'Search'}
        // onSubmitEditing={() => {
        //   weather.getCoordinatesAsync(searchQuery);
        // }}
        // onCancel={() => setSearchQueryToLocation(weather, setSearchQuery)}
        // onEndEditing={() => setSearchQueryToLocation(weather, setSearchQuery)}
        />

        {keyboardOpen ? (
          null
        ) : (
          <Pressable onPress={() => Alert.alert("Recent Places", "You opened the Recent Places list.")}>
            <Icon
              name='list-ul'
              size={25}
              color={Colors[theme].text}
              style={{ padding: Layout.margin, marginRight: Layout.margin }}
            />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );


  return (
    <ScreenContainer>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-safeAreaInsets.bottom}
        style={{ flex: 1 }}
      >

        {keyboardOpen ? (
          <AutocompleteResults
            style={{ flex: 1 }}
            autocompleteResponse={autocompleteResponse}
            sessionToken={sessionToken}
            contentContainerStyle={{ paddingBottom: headerHeight }}
            onSelectPlace={() => {
              setSearchQuery('');

              const newToken = uuidv4();
              setSessionToken(newToken)
              // console.log(newToken);

              Keyboard.dismiss();
            }}
          />
        ) : (
          weather.dailyForecast ? (
            <FlatList
              contentContainerStyle={[styles.container, { paddingTop: headerHeight, paddingBottom: Layout.window.height / 3 }]}
              style={{ flex: 1, opacity: (keyboardOpen ? 0.5 : 1), marginBottom: -1.5 * searchBarHeight - 100 }}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              automaticallyAdjustsScrollIndicatorInsets={false}
              data={weather.dailyForecast?.list}
              renderItem={renderDayForecastCard}
              ItemSeparatorComponent={HorizontalLine}
              ListHeaderComponent={CurrentWeather}
            />
          ) : (
            <ActivityIndicator
              size='large'
              style={{ flex: 1 }}
            />
          )
        )}

        {SearchZone}

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