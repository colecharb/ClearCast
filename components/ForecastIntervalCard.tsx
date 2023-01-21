import React, { useEffect, useRef } from "react";
import { Image, StyleSheet } from "react-native";
import { fetchIcon, WeatherContext } from "../contexts/Weather";
import { ForecastInterval_3hr } from "../types";
import Card from "./Card";
import { Text, View } from "./Themed";


export default function ({ forecastInterval, index }: { forecastInterval: ForecastInterval_3hr, index: number }) {

  const iconObjectURL = useRef<string>()

  useEffect(() => {
    fetchIcon(forecastInterval.weather[0].icon)
  }, [forecastInterval.weather[0].icon])

  return (
    <Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        <View style={{ flex: 1 }}>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ aspectRatio: 1, height: 45 }}>
              <Image
                style={styles.weatherIcon}
                source={{ uri: `https://openweathermap.org/img/wn/${forecastInterval.weather[0].icon}@4x.png` }}
              />
            </View>

            <Text>{forecastInterval.main.temp.toFixed(0)}˚</Text>


            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1 }}>
              {/* <Text>{forecastInterval.weather[0].main}</Text> */}


            </View>
          </View>

          <Text>{forecastInterval.weather[0].description}</Text>

        </View>



        <View>
          <Text style={{ textAlign: 'right' }}>
            H {forecastInterval.main.temp_max.toFixed(0)}
            {'\n'}
            L {forecastInterval.main.temp_min.toFixed(0)}
          </Text>
        </View>

      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  weatherIcon: {
    aspectRatio: 1,
    width: undefined,
    height: undefined
  }
})