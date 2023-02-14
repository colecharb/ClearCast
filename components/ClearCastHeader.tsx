import React, { useContext } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text, View } from "./Themed";
import { WeatherContext } from "../contexts/Weather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native";

export default function () {

  const theme = useColorScheme();
  const weather = useContext(WeatherContext);
  const safeAreaInsets = useSafeAreaInsets();

  const placeName = (
    weather.place ? (
      `${weather.place.city}, ${weather.place.region}`
    ) : (
        null
    )
  )

  return (
    <LinearGradient
      colors={[Colors[theme].background + 'ff', Colors[theme].background + 'cc', Colors[theme].background + '00']}
      locations={[0, 1 / 2, 1]} //{[0, 1 / 4, 2 / 4, 3 / 4, 1]}
      style={{ padding: Layout.margin, justifyContent: 'center', paddingTop: safeAreaInsets.top }}
      pointerEvents='box-none'
    >
      <Text style={{ fontWeight: '200', textAlign: 'center', fontSize: 24, color: Colors[theme].text, marginBottom: Layout.margin / 2 }}>
        {'ClearCast'}
      </Text>
      {!weather.loading ? (
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '900' }}>
          {placeName}
        </Text>
      ) : (
        <ActivityIndicator />
      )}

    </LinearGradient>
  )
}