import React from "react";
import { Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { DailyForecast } from "../types";
import Card from "./Card";
import { Text, View } from "./Themed";


export default function ({ forecast, index }: { forecast: DailyForecast | undefined, index: number }) {


  if (!forecast) return null

  const styles = makeStyles();

  const dayForecast = forecast.list[index]

  const date = new Date(dayForecast.dt * 1000)
  const day = date.toLocaleDateString(navigator.language, { weekday: 'short' })

  if (!forecast) return null

  return (
    <Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ flex: 1, textAlign: 'center' }}>{index === 0 ? 'Today' : day}</Text>

        <View style={{ flex: 1.5, height: 45, marginVertical: -16, alignItems: 'center' }}>
          <Image
            style={styles.weatherIcon}
            source={{ uri: `https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@4x.png` }}
          />
        </View>


        {/* <Text>L {dayForecast.temp.min.toFixed(0)}˚</Text>
        <Text>H {dayForecast.temp.max.toFixed(0)}˚</Text> */}


        <LowHighTempInterval
          minLow={forecast.minLow}
          low={dayForecast.temp.min}
          high={dayForecast.temp.max}
          maxHigh={forecast.maxHigh}
        />

        {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

      </View>
    </Card>
  )
}

const LowHighTempInterval = ({ minLow, low, high, maxHigh }: { minLow: number, low: number, high: number, maxHigh: number }) => {
  const styles = makeStyles()

  return (
    <View style={styles.intervalContainer}>
      <View style={{ flex: low - minLow }} />

      <View style={[styles.intervalTempContainer, { borderColor: '#aaf7' }]}>
        <Text style={styles.intervalTemp}>{low.toFixed(0)}˚</Text>
      </View>


      <View style={{ flex: high - low }} />

      <View style={[styles.intervalTempContainer, { borderColor: '#faa7' }]}>
        <Text style={styles.intervalTemp}>{high.toFixed(0)}˚</Text>
      </View>

      <View style={{ flex: maxHigh - high }} />
    </View>
  )
}

const makeStyles = () => {
  const theme = useColorScheme()
  return StyleSheet.create({
    weatherIcon: {
      aspectRatio: 1,
      height: 45
    },
    intervalContainer: {
      flex: 5,
      height: '100%',
      flexDirection: 'row',
      backgroundColor: Colors[theme].subtle,
      borderRadius: Layout.borderRadius - Layout.margin,
    },
    intervalTempContainer: {
      justifyContent: 'center',
      padding: Layout.margin / 2,
      borderColor: Colors[theme].light,
      borderRadius: Layout.borderRadius - Layout.margin,
      borderWidth: Layout.borderWidth
    },
    intervalTemp: {
      fontWeight: 'bold'
    }
  })
}