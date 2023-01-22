import React, { useEffect, useRef } from "react";
import { Image, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { WeatherContext } from "../contexts/Weather";
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{day}</Text>

          <View style={{ aspectRatio: 1, height: 45, marginVertical: -16 }}>
            <Image
              style={styles.weatherIcon}
              source={{ uri: `https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@4x.png` }}
            />
          </View>
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

      <View style={styles.intervalTempContainer}>
        <Text style={styles.intervalTemp}>{low.toFixed(0)}˚</Text>
      </View>


      <View style={{ flex: high - low }} />

      <View style={styles.intervalTempContainer}>
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
      width: undefined,
      height: undefined
    },
    intervalContainer: {
      width: 150,
      height: '100%',
      flexDirection: 'row',
      backgroundColor: '#444',
      borderRadius: Layout.borderRadius / 2,
    },
    intervalTempContainer: {
      justifyContent: 'center',
      padding: Layout.margin / 2,
      borderRadius: Layout.borderRadius - Layout.margin,
      backgroundColor: Colors[theme].tint
    },
    intervalTemp: {
      fontWeight: 'bold'
    }
  })
}