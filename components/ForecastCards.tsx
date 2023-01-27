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
      console.log(hourDate.getDate(), date.getDate());
      return ((hourDate.getDate() === date.getDate()) && (hourDate.getHours() % 2 === 0))
    }
  )



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
          console.log(showHours);
          console.log(hoursThisDay)
        }}
      >

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flex: 3, alignItems: 'center', justifyContent: 'space-between', marginRight: Layout.margin }}>

            <Text style={[styles.dayText, { flex: 1, textAlign: 'left' }]}>{index === 0 ? 'Today' : day}</Text>
            <Text style={[styles.emoji, { textAlign: 'right' }]}>{emojiFromIcon(dayInterval.weather[0].icon)}</Text>

          </View>

          <LowHighTempInterval
            minLow={dailyForecast.minLow}
            low={dayInterval.temp.min}
            high={dayInterval.temp.max}
            maxHigh={dailyForecast.maxHigh}
          />

          {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

        </View>

      </Pressable>

      {showHours ? (
        <FlatList
          style={{ marginTop: Layout.margin / 3, marginBottom: 0 }}
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
    <View style={{ marginVertical: Layout.margin / 4, height: 35 }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flex: 3, alignItems: 'center', justifyContent: 'space-between', marginRight: Layout.margin }}>

          <Text style={[styles.hourText, { flex: 1, textAlign: 'right', paddingHorizontal: Layout.margin, color: Colors[theme].medium }]}>{hour}</Text>
          <Text style={styles.emoji}>{emojiFromIcon(hourInterval.weather[0].icon)}</Text>

        </View>

        <HourTempInterval
          minLow={minLow}
          low={low}
          temp={hourInterval.main.temp}
          high={high}
          maxHigh={maxHigh}
        />

        {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

      </View>
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
          <Text style={[styles.intervalTemp, styles.smallText]}>{temp.toFixed(0)}˚</Text>
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
      fontSize: 12,
    },
    emoji: {
      zIndex: 10,
      fontSize: 30,
      lineHeight: 35,
    },
    // weatherIcon: {
    //   aspectRatio: 1,
    //   height: 45
    // },
    intervalContainer: {
      flex: 6,
      height: '100%',
      flexDirection: 'row',
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
      fontWeight: 'bold'
    }
  })
}