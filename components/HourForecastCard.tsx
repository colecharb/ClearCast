import React from "react";
import { Image, StyleSheet } from "react-native";
import { HourlyForecast } from "../types";
import Card from "./Card";
import { Text, View } from "./Themed";


export default function ({ forecast, index }: { forecast: HourlyForecast | undefined, index: number }) {


  if (!forecast) return null


  const forecastInterval = forecast.list[index]

  const date = new Date(forecastInterval.dt * 1000)
  const hour = date.toLocaleTimeString(navigator.language, { hour: 'numeric' })

  if (!forecast) return null

  return (
    <Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        <Text>{hour}</Text>

        <View style={{ aspectRatio: 1, height: 45, marginVertical: -16 }}>
          <Image
            style={styles.weatherIcon}
            source={{ uri: `https://openweathermap.org/img/wn/${forecastInterval.weather[0].icon}@4x.png` }}
          />
        </View>

        <Text>L {forecastInterval.main.temp_min.toFixed(0)}˚</Text>
        <Text>H {forecastInterval.main.temp_max.toFixed(0)}˚</Text>


        <TempInterval
          minTemp={forecast?.minTemp}
          temp={forecastInterval?.main.temp}
          maxTemp={forecast?.maxTemp}
        />

        {/* <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text> */}

      </View>
    </Card>
  )
}

const TempInterval = ({ minTemp, temp, maxTemp }: { minTemp: number, temp: number, maxTemp: number }) => (
  <View style={{ width: 150, height: '100%', flexDirection: 'row', backgroundColor: '#444' }}>
    <View style={{ flex: temp - minTemp }} />
    <View style={{ width: 5, height: '100%', backgroundColor: 'red' }} />
    <View style={{ flex: maxTemp - temp }} />
  </View>
)

const styles = StyleSheet.create({
  weatherIcon: {
    aspectRatio: 1,
    width: undefined,
    height: undefined
  }
})