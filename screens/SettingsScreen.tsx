import React, { useContext, useState } from "react";
import { Button } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import { WeatherContext } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { RootStackScreenProps } from "../types";

type TemperatureUnits = 'metric' | 'imperial';

export default function ({ navigation }: RootStackScreenProps<'Settings'>) {

  const weather = useContext(WeatherContext);
  const theme = useColorScheme();

  return (
    <ScreenContainer>
      <Button
        title={weather.temperatureUnits}
        onPress={() => weather.toggleTemperatureUnits()}
        color={Colors[theme].tint}
      />
    </ScreenContainer>
  )
}