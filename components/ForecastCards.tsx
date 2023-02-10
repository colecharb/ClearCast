import React, { useContext, useState } from "react";
import { FlatList, LayoutAnimation, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { WeatherContext, WeatherContextData } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { DailyForecast, HourInterval } from "../types";
import emojiFromIcon from "../utils/emojiFromIcon";
import Card from "./Card";
import { Text, View } from "./Themed";


export function DayForecastCard({ dailyForecast, index }: { weather: WeatherContextData, dailyForecast: DailyForecast | undefined, index: number }) {

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  const theme = useColorScheme();
  const styles = makeStyles();

  const weather = useContext(WeatherContext);

  // for showing or hiding the hours view
  const [showHours, setShowHours] = useState<boolean>(false);

  if (!dailyForecast) return null;

  const dayInterval = dailyForecast.list[index];
  if (!dayInterval) return null;

  const date = new Date(dayInterval.dt * 1000);
  const day = date.toLocaleDateString(navigator.language, { weekday: 'short' });

  const sunriseDate = new Date(dayInterval.sunrise * 1000);
  const sunsetDate = new Date(dayInterval.sunset * 1000);
  const sunrise = sunriseDate.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });
  const sunset = sunsetDate.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });

  // filter hours:
  // only want this day and only want evey two hours
  const hoursThisDay = weather.hourlyForecast?.list.filter(
    hourInterval => {
      const hourDate = new Date(hourInterval.dt * 1000);
      // console.log(hourDate.getDate(), date.getDate());
      return ((hourDate.getDate() === date.getDate()) && (hourDate.getHours() % 2 === 0));
    }
  );

  if (hoursThisDay?.length === 0) return null;


  const renderHourForecast = ({ item }: { item: HourInterval }) => (
    <HourForecastCard
      hourInterval={item}
      minLow={dailyForecast.minLow}
      low={dayInterval.temp.min}
      high={dayInterval.temp.max}
      maxHigh={dailyForecast.maxHigh}
    />
  );

  return (
    <Card>
      <Pressable
        hitSlop={Layout.margin}
        onPress={() => {
          setShowHours(!showHours)
          // console.log(showHours);
          // console.log(hoursThisDay)
        }}
      >

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <View style={{ flex: 3, marginRight: Layout.margin, marginBottom: Layout.margin / 2 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={[styles.dayText, { flex: 1, textAlign: 'center' }]}>
                {index === 0 ? 'Today' : day}
              </Text>

              <Text style={[styles.emojiLg, { flex: 1, textAlign: 'center', marginVertical: -Layout.margin }]}>
                {emojiFromIcon(dayInterval.weather[0].icon)}
              </Text>

            </View>

            {showHours ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Layout.margin }}>
                <View style={{ flex: 1, opacity: 0.5, marginTop: -Layout.margin, alignItems: 'center' }}>
                  <Text style={styles.riseSetText}>☀️ {sunrise}</Text>
                  <Text style={styles.riseSetText}>🌙 {sunset}</Text>
                </View>

                <Text style={[styles.statsText, { flex: 1, textAlign: 'center', alignSelf: 'flex-end' }]}>
                  💧{(dayInterval.pop * 100).toFixed(0)}%
                </Text>
              </View>
            ) : (
              null
            )}


          </View>

          <View style={styles.rightSideContainer}>
            <View style={{ flex: 1, justifyContent: (showHours ? 'space-between' : 'center') }}>
              {showHours ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={[styles.statsText, { textAlign: 'left', color: Colors[theme].medium }]}>
                    {dayInterval.weather[0].description}.
                  </Text>
                </View>
              ) : (
                null
              )}



              <LowHighTempInterval
                minLow={dailyForecast.minLow}
                low={dayInterval.temp.min}
                high={dayInterval.temp.max}
                maxHigh={dailyForecast.maxHigh}
              />
            </View>
          </View>


          {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

        </View>

      </Pressable>

      {showHours ? (
        <FlatList
          style={{ marginTop: Layout.margin / 4, marginBottom: -Layout.margin / 4 }}
          scrollEnabled={false}
          data={hoursThisDay}
          renderItem={renderHourForecast}
        />
      ) : (
        null
      )}

    </Card>
  );
};

const LowHighTempInterval = ({ minLow, low, high, maxHigh }: { minLow: number, low: number, high: number, maxHigh: number }) => {
  const styles = makeStyles();

  return (
    <View style={[styles.intervalContainer, styles.intervalContainerHighlight]}>
      <View style={{ flex: low - minLow }} />

      <View style={[styles.intervalExtremeContainer, { backgroundColor: '#adf5' }]}>
        <Text style={styles.intervalTemp}>{low.toFixed(0)}˚</Text>
      </View>


      <View style={{ flex: high - low, flexDirection: 'row' }} />

      <View style={[styles.intervalExtremeContainer, { backgroundColor: '#ec95' }]}>
        <Text style={styles.intervalTemp}>{high.toFixed(0)}˚</Text>
      </View>

      <View style={{ flex: maxHigh - high }} />
    </View>
  );
};

export function HourForecastCard({ hourInterval, minLow, low, high, maxHigh }: { hourInterval: HourInterval, minLow: number, low: number, high: number, maxHigh: number }) {

  const styles = makeStyles();
  const theme = useColorScheme();

  const date = new Date(hourInterval.dt * 1000);
  const hour = date.toLocaleTimeString(navigator.language, { hour: 'numeric' });

  return (
    <View style={{ marginVertical: Layout.margin / 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

      <View style={{ height: '100%', flexDirection: 'row', alignSelf: 'flex-start', flex: 3, alignItems: 'center', justifyContent: 'space-between', marginRight: Layout.margin }}>

        <Text style={[styles.hourText, { flex: 4, textAlign: 'right', paddingRight: Layout.margin, color: Colors[theme].medium }]}>{hour}</Text>
        <Text style={[styles.emojiSm, { flex: 4, textAlign: 'center' }]}>{emojiFromIcon(hourInterval.weather[0].icon)}</Text>
        <Text style={[styles.statsText, { flex: 3 }]}>{hourInterval.pop ? `${(hourInterval.pop * 100).toFixed(0)}%` : null}</Text>

        </View>

      <View style={styles.rightSideContainer}>
        <HourTempInterval
          minLow={minLow}
          low={low}
          temp={hourInterval.main.temp}
          high={high}
          maxHigh={maxHigh}
        />
      </View>


        {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

    </View>
  );
};

const HourTempInterval = ({ minLow, low, temp, high, maxHigh }: { minLow: number, low: number, temp: number, high: number, maxHigh: number }) => {
  const styles = makeStyles();
  // todo: figure out what this stretch factor should be, and where it should go. 
  const STRETCH_FACTOR = 3.6;

  return (
    <View style={styles.intervalContainer}>
      <View style={{ flex: low - minLow }} />

      {/* <View style={styles.intervalExtremeContainer} />
      <View style={[{ marginRight: -50, borderWidth: 2, borderColor: 'red' }]} /> */}
      <View style={[styles.intervalContainerHighlight, { flex: (high - low) * 3.3 }]}>

        <View style={{ flex: temp - low }} />


        <View style={[styles.intervalTempContainer]}>
          <Text style={[styles.intervalTemp]}>{temp.toFixed(0)}˚</Text>
        </View>


        <View style={{ flex: high - temp }} />

      </View>
      {/* <View style={[{ marginLeft: -50, borderWidth: 2, borderColor: 'red' }]} />
      <View style={styles.intervalExtremeContainer} /> */}

      <View style={{ flex: maxHigh - high }} />
    </View>

  );
};

const makeStyles = () => {
  const theme = useColorScheme();
  return StyleSheet.create({
    dayText: {
      fontSize: 18,
    },
    hourText: {
      fontSize: 16,
      // lineHeight: 20
      // fontVariant: ['tabular-nums']
    },
    smallText: {
      fontSize: 14,
    },
    riseSetText: {
      fontSize: 12,
      lineHeight: 16,
      fontVariant: ['tabular-nums']
    },
    emojiLg: {
      fontSize: 42,
      lineHeight: 45,
    },
    emojiSm: {
      fontSize: 25,
      lineHeight: 30,
    },
    statsText: {
      fontSize: 14,
      // flex: 1,
      // marginHorizontal: Layout.margin / 2,
      textAlign: 'right',
      fontVariant: ['tabular-nums']
    },
    // weatherIcon: {
    //   aspectRatio: 1,
    //   height: 45
    // },
    intervalContainer: {
      // flex: 1,
      height: 30,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightSideContainer: {
      flex: 3,
      justifyContent: 'space-between',
      // height: '100%',
    },
    intervalContainerHighlight: {
      backgroundColor: Colors[theme].subtle,
      borderRadius: Layout.borderRadius - Layout.margin,
      flexDirection: 'row',
      // height: '100%'
    },
    intervalExtremeContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.margin / 2,
      // borderColor: Colors[theme].light,
      borderRadius: Layout.borderRadius - Layout.margin,
      // borderWidth: Layout.borderWidth,
      aspectRatio: 1.4
    },
    intervalTempContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.margin / 2,
      borderColor: Colors[theme].light,
      borderRadius: Layout.borderRadius - Layout.margin,
      borderWidth: Layout.borderWidth,
      aspectRatio: 1.4,
      // marginHorizontal: -60
    },
    intervalTemp: {
      fontSize: 14,
      // lineHeight: 18,
      fontWeight: 'bold',
      // textAlign: 'center'
    }
  });
};