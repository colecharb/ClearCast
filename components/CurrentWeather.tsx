import React from "react";
import { useContext } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import makeStyles from "../constants/Styles";
import { WeatherContext } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import emojiFromIcon from "../utils/emojiFromIcon";
import { Text, View } from "./Themed";

export default function () {
  const weather = useContext(WeatherContext);
  const currrentWeather = weather.currentWeather;
  const theme = useColorScheme();

  const styles = makeLocalStyles();
  const globalStyles = makeStyles();

  if (!currrentWeather) return (
    <ActivityIndicator />
  )

  return (
    <View style={[{ marginBottom: Layout.margin * 3 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[{ fontSize: 100 }]}>
          {emojiFromIcon(currrentWeather.weather[0].icon)}
        </Text>
        {/* <View style={{ width: Layout.margin }} /> */}
        <Text style={[{ fontSize: 80 }]}>
          {currrentWeather.main.feels_like.toFixed(0)}˚
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={[styles.detailsText, { color: Colors[theme].text }]}>
          {currrentWeather?.weather[0].description}
        </Text>
        <View style={{ width: Layout.margin }} />
        <Text style={[styles.detailsText, { textAlign: "left" }]}>
          actual temp {currrentWeather.main.temp.toFixed(0)}˚
        </Text>
      </View>

    </View>
  );
}

const makeLocalStyles = () => {
  const theme = useColorScheme();
  return StyleSheet.create({
    detailsText: {
      fontSize: 16,
      color: Colors[theme].medium,
      textTransform: 'capitalize'
    }
  });
}