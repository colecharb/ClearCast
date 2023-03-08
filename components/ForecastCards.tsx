import React, { useContext, useEffect, useState, memo } from "react";
import { FlatList, LayoutAnimation, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { WeatherContext, WeatherContextData } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { DailyForecast, HistoricalHourInterval, HourInterval } from "../types";
import emojiFromIcon from "../utils/emojiFromIcon";
import rescale from "../utils/rescale";
import { Text, View } from "./Themed";
import makeStyles from "../constants/Styles";
import { LinearGradient } from "expo-linear-gradient";


export const DayForecastCard = memo(function ({ dailyForecast, index }: { weather: WeatherContextData, dailyForecast: DailyForecast | undefined, index: number }) {

  const theme = useColorScheme();
  const styles = makeLocalStyles();
  const globalStyles = makeStyles();

  const weather = useContext(WeatherContext);

  // for showing or hiding the hours view
  const [showHours, setShowHours] = useState<boolean>(false);

  if (!dailyForecast) return null;

  const dayInterval = dailyForecast.list[index];
  if (!dayInterval) return null;

  // const dateNow = new Date();
  // dateNow.setHours(0, 0, 0, 0);

  const date = new Date((dayInterval.dt) * 1000);
  date.setHours(0, 0, 0, 0);
  // date.setHours(0, 0, 0, 0);

  // console.log(date, dateNow);


  const tomorrowDate = new Date((dayInterval.dt + 24 * 60 * 60) * 1000);
  tomorrowDate.setHours(0, 0, 0, 0);

  const day = date.toLocaleDateString(navigator.language, { weekday: 'short' });

  const sunriseDate = new Date(dayInterval.sunrise * 1000);
  const sunsetDate = new Date(dayInterval.sunset * 1000);
  // const sunrise = sunriseDate.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });
  // const sunset = sunsetDate.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });
  const sunriseTimeProportion = (sunriseDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000); // divide by # milliseconds in 25 h
  const sunsetTimeProportion = (sunsetDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);

  const DAYLIGHT_GRADIENT_FEATHER = 0.02;
  const VERTICAL_OFFSET = 1 / 25;

  const precipType = (
    dayInterval.rain ? (
      dayInterval.snow ? (
        'Rain and Snow'
      ) : (
        'Rain'
      )
    ) : (
      dayInterval.snow ? (
        'Snow'
      ) : (
        'Precip'
      )
    )
  )

  // filter hours:
  // only want this day and only want every two hours
  const pastHours = weather.historicalHours?.list ? (
    weather.historicalHours.list.filter(
      (historicalHourInterval: HistoricalHourInterval) => {
        const hourDate = new Date(historicalHourInterval.dt * 1000);
        // console.log(hourDate.getDate(), date.getDate());
        return ((hourDate.getDate() === date.getDate()) && (hourDate.getHours() % 2 === 0));
      }
    )
  ) : (
    []
  );

  // console.log(JSON.stringify(weather.historicalHours?.list, null, '  '))

  const forecastedHours = weather.hourlyForecast?.list ? (
    weather.hourlyForecast.list.filter(
      hourInterval => {
        const hourDate = new Date(hourInterval.dt * 1000);
        // console.log(hourDate.getDate(), date.getDate());
        return ((hourDate.getDate() === date.getDate()) && (hourDate.getHours() % 2 === 0));
      }
    )
  ) : (
    []
  );

  const hoursThisDay = [...pastHours, ...forecastedHours]

  if (hoursThisDay?.length === 0) return null;


  const renderHourForecast = ({ item }: { item: HourInterval | HistoricalHourInterval }) => (
    <HourForecastCard
      hourInterval={item}
      minLow={dailyForecast.minLow}
      low={dayInterval.temp.min}
      high={dayInterval.temp.max}
      maxHigh={dailyForecast.maxHigh}
    />
  );

  return (
    <View style={[globalStyles.card, globalStyles.container]}>
      <Pressable
        // style={[globalStyles.card]}
        hitSlop={Layout.margin}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setShowHours(!showHours)
          // console.log(showHours);
          // console.log(hoursThisDay)
        }}
      >

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

          <View style={{ flex: 3, marginBottom: Layout.margin / 2 }}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Text style={[styles.dayText, { flex: 4, textAlign: 'right' }]}>
                {index === 0 ? 'Today' : day}
              </Text>

              <Text style={[styles.emojiLg, { flex: 8, textAlign: 'center', marginBottom: -Layout.margin }]}>
                {emojiFromIcon(dayInterval.weather[0].icon)}
              </Text>

            </View>

            {showHours ? (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: Layout.margin }}>
                {/* <View style={{ flex: 1, opacity: 0.5, marginTop: -Layout.margin, alignItems: 'center' }}>
                  <Text style={styles.riseSetText}>☀️ {sunrise}</Text>
                  <Text style={styles.riseSetText}>🌙 {sunset}</Text>
                </View> */}

                {dayInterval.pop ? (
                  <>
                    <Text style={[styles.statsText, { marginRight: Layout.margin, fontWeight: '700' }]}>
                      {precipType}
                      <Text style={{}}>
                        {': ' + (dayInterval.pop * 100).toFixed(0)}%
                      </Text>
                    </Text>
                  </>
                ) : (
                  null
                )}



              </View>
            ) : (
              null
            )}


          </View>

          <View style={styles.rightSideContainer}>
            <View style={{ flex: 1, justifyContent: (showHours ? 'space-between' : 'center') }}>
              {showHours ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={[styles.statsText, { textAlign: 'left', color: Colors[theme].medium, textTransform: 'capitalize' }]}>
                    {dayInterval.weather[0].description}
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
        <View>


          <LinearGradient
            style={{
              position: 'absolute',
              top: Layout.margin / 4,
              bottom: -Layout.margin / 4,
              left: `${4.5 / 24 * 100}%`,
              right: `${16.5 / 24 * 100}%`
            }}
            colors={[
              Colors[theme].night,
              Colors[theme].night,
              Colors[theme].daylight,
              Colors[theme].daylight,
              Colors[theme].night,
              Colors[theme].night
            ]}
            locations={[
              0,
              sunriseTimeProportion - DAYLIGHT_GRADIENT_FEATHER + VERTICAL_OFFSET,
              sunriseTimeProportion + DAYLIGHT_GRADIENT_FEATHER + VERTICAL_OFFSET,
              sunsetTimeProportion - DAYLIGHT_GRADIENT_FEATHER + VERTICAL_OFFSET,
              sunsetTimeProportion + DAYLIGHT_GRADIENT_FEATHER + VERTICAL_OFFSET,
              1
            ]}
          />

          <FlatList
            style={{ marginTop: Layout.margin / 4, marginBottom: -Layout.margin / 4 }}
            scrollEnabled={false}
            data={hoursThisDay}
            renderItem={renderHourForecast}
          />

        </View>
      ) : (
        null
      )}

    </View>
  );
});

const LowHighTempInterval = ({ minLow, low, high, maxHigh }: { minLow: number, low: number, high: number, maxHigh: number }) => {
  const styles = makeLocalStyles();

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

const HourForecastCard = memo(function ({ hourInterval, minLow, low, high, maxHigh }: { hourInterval: HourInterval | HistoricalHourInterval, minLow: number, low: number, high: number, maxHigh: number }) {

  const styles = makeLocalStyles();
  const theme = useColorScheme();

  const weather = useContext(WeatherContext);
  // const locale = weather.hourlyForecast?.city.country;

  const now = new Date();

  const date = new Date(hourInterval.dt * 1000);
  const hour = date.toLocaleTimeString(navigator.language, { hour: 'numeric' });

  const thisIntervalIsNow = now.getDate() === date.getDate() && (2 * Math.round(now.getHours() / 2)) === date.getHours();

  // console.log(date.toLocaleDateString(locale, { dateStyle: 'short' }));
  // console.log(navigator.language);



  return (
    <View style={{ marginVertical: Layout.margin / 4, flexDirection: 'row', alignItems: 'center' }}>

      <View style={{ height: '100%', flexDirection: 'row', alignSelf: 'flex-start', flex: 3, alignItems: 'center', justifyContent: 'space-between' }}>

        <Text style={[
          styles.hourText,
          {
            flex: 4,
            textAlign: 'right',
            // paddingRight: Layout.margin,
            color: thisIntervalIsNow ? Colors[theme].text : Colors[theme].medium,
          }
        ]}>
          {thisIntervalIsNow ? 'Now' : hour}
        </Text>
        <Text style={[styles.emojiSm, { flex: 4, textAlign: 'center' }]}>{emojiFromIcon(hourInterval.weather[0].icon)}</Text>
        <View style={{ flex: 4 }}>
          <Text style={[
            styles.statsText,
            {
              fontWeight: '600',
              marginRight: Layout.margin,
              opacity: rescale({
                value: hourInterval.pop ? hourInterval.pop : 0,
                oldMin: 0,
                oldMax: 1,
                newMin: 0.3,
                newMax: 1,
              })
            }
          ]}>
            {hourInterval.pop ? `${(hourInterval.pop * 100).toFixed(0)}` : '–'}
            <Text style={{ opacity: hourInterval.pop ? 1 : 0 }}>%</Text>
          </Text>
        </View>

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
});

const HourTempInterval = ({ minLow, low, temp, high, maxHigh }: { minLow: number, low: number, temp: number, high: number, maxHigh: number }) => {
  const styles = makeLocalStyles();
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

const makeLocalStyles = () => {
  const theme = useColorScheme();
  return StyleSheet.create({
    dayText: {
      fontSize: 18,
      fontWeight: '500'
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
