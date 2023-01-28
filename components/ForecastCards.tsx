import React, { useContext, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { WeatherContext, WeatherContextData } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { DailyForecast, HourlyForecast, DayInterval, HourInterval } from "../types";
import emojiFromIcon from "../utils/emojiFromIcon";
import Card from "./Card";
import { Text, View } from "./Themed";


export function DayForecastCard({ dailyForecast, index }: { weather: WeatherContextData, dailyForecast: DailyForecast | undefined, index: number }) {


  const theme = useColorScheme();

  // for showing or hiding the hours view
  const [showHours, setShowHours] = useState<boolean>(false)

  const weather = useContext(WeatherContext)

  if (!dailyForecast) return null

  const styles = makeStyles();

  const dayInterval = dailyForecast.list[index];
  if (!dayInterval) return null

  const date = new Date(dayInterval.dt * 1000)
  const day = date.toLocaleDateString(navigator.language, { weekday: 'short' })

  // filter hours:
  // only want this day and only want evey two hours
  const hoursThisDay = weather.hourlyForecast?.list.filter(
    hourInterval => {
      const hourDate = new Date(hourInterval.dt * 1000)
      // console.log(hourDate.getDate(), date.getDate());
      return ((hourDate.getDate() === date.getDate()) && (hourDate.getHours() % 2 === 0))
    }
  )

  if (hoursThisDay?.length === 0) return null



  const renderHourForecast = ({ item }: { item: HourInterval }) => (
    <HourForecastCard
      hourInterval={item}
      minLow={dailyForecast.minLow}
      low={dayInterval.temp.min}
      high={dayInterval.temp.max}
      maxHigh={dailyForecast.maxHigh}
    />
  )

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

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>

          <View style={{ flexDirection: 'row', flex: 3, alignItems: 'center', justifyContent: 'space-between', marginRight: Layout.margin }}>

            <Text style={[styles.dayText, { flex: 4, textAlign: 'right', paddingHorizontal: Layout.margin }]}>{index === 0 ? 'Today' : day}</Text>
            <Text style={[styles.emojiLg, { flex: 4, textAlign: 'center' }]}>{emojiFromIcon(dayInterval.weather[0].icon)}</Text>
            <Text style={[styles.statsText, { flex: 3 }]}>{(dayInterval.pop * 100).toFixed(0)}%💧</Text>

          </View>

          <View style={styles.rightSideContainer}>
            <View style={{ flexDirection: 'row', marginBottom: Layout.margin / 2 }}>


              <Text style={[styles.statsText, { flex: 1, textAlign: 'center', color: Colors[theme].medium }]}>{dayInterval.weather[0].description}</Text>

            </View>


            <LowHighTempInterval
              minLow={dailyForecast.minLow}
              low={dayInterval.temp.min}
              high={dayInterval.temp.max}
              maxHigh={dailyForecast.maxHigh}
            />
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
  )
}

const LowHighTempInterval = ({ minLow, low, high, maxHigh }: { minLow: number, low: number, high: number, maxHigh: number }) => {
  const styles = makeStyles()

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
  )
}

export function HourForecastCard({ hourInterval, minLow, low, high, maxHigh }: { hourInterval: HourInterval, minLow: number, low: number, high: number, maxHigh: number }) {

  const styles = makeStyles()
  const theme = useColorScheme()

  const date = new Date(hourInterval.dt * 1000)
  const hour = date.toLocaleTimeString(navigator.language, { hour: 'numeric' })

  return (
    <View style={{ marginVertical: Layout.margin / 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flex: 3, alignItems: 'center', justifyContent: 'space-between', marginRight: Layout.margin }}>

        <Text style={[styles.hourText, { flex: 4, textAlign: 'right', paddingHorizontal: Layout.margin, color: Colors[theme].medium }]}>{hour}</Text>
        <Text style={[styles.emojiSm, { flex: 4, textAlign: 'center' }]}>{emojiFromIcon(hourInterval.weather[0].icon)}</Text>
        <Text style={[styles.statsText, { flex: 3 }]}>{(hourInterval.pop * 100).toFixed(0)}%</Text>

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
  )
}

const HourTempInterval = ({ minLow, low, temp, high, maxHigh }: { minLow: number, low: number, temp: number, high: number, maxHigh: number }) => {
  const styles = makeStyles()
  // todo: figure out what this stretch factor should be, and where it should go. 
  const STRETCH_FACTOR = 2.2

  return (
    <View style={styles.intervalContainer}>
      <View style={{ flex: low - minLow }} />

      {/* <View style={styles.intervalExtremeContainer} />
      <View style={[{ marginRight: -50, borderWidth: 2, borderColor: 'red' }]} /> */}
      <View style={[styles.intervalContainerHighlight, { flex: (high - low) * STRETCH_FACTOR }]}>

        <View style={{ flex: temp - low }} />

        <View style={[styles.intervalTempContainer]}>
          <Text style={[styles.intervalTemp, styles.hourText]}>{temp.toFixed(0)}˚</Text>
        </View>

        <View style={{ flex: high - temp }} />


      </View>
      {/* <View style={[{ marginLeft: -50, borderWidth: 2, borderColor: 'red' }]} />
      <View style={styles.intervalExtremeContainer} /> */}

      <View style={{ flex: maxHigh - high }} />
    </View>

  )
}

const makeStyles = () => {
  const theme = useColorScheme()
  return StyleSheet.create({
    dayText: {
      fontSize: 18,
    },
    hourText: {
      fontSize: 16,
    },
    smallText: {
      fontSize: 14,
    },
    emojiLg: {
      fontSize: 40,
      lineHeight: 45,
    },
    emojiSm: {
      fontSize: 20,
      lineHeight: 25,
    },
    statsText: {
      fontSize: 14,
      // flex: 1,
      // marginHorizontal: Layout.margin / 2,
      textAlign: 'center',
    },
    // weatherIcon: {
    //   aspectRatio: 1,
    //   height: 45
    // },
    intervalContainer: {
      flex: 6,
      // height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightSideContainer: {
      flex: 3,
      // height: '100%',
    },
    intervalContainerHighlight: {
      backgroundColor: Colors[theme].subtle,
      borderRadius: Layout.borderRadius - Layout.margin,
      flexDirection: 'row',
    },
    intervalExtremeContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.margin / 2,
      // borderColor: Colors[theme].light,
      borderRadius: Layout.borderRadius - Layout.margin,
      // borderWidth: Layout.borderWidth,
      aspectRatio: 1.4
    },
    intervalTempContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: Layout.margin / 2,
      borderColor: Colors[theme].light,
      borderRadius: Layout.borderRadius - Layout.margin,
      borderWidth: Layout.borderWidth,
      aspectRatio: 1.4
    },
    intervalTemp: {
      fontSize: 16,
      fontWeight: 'bold',
    }
  })
}