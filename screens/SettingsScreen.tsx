import React, { useContext, useState } from "react";
import { Button, ScrollView } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from "../components/ScreenContainer";
import SettingBase from "../components/SettingBase";
import { Text } from "../components/Themed";
import Colors from "../constants/Colors";
import makeStyles from "../constants/Styles";
import { WeatherContext } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { RootStackScreenProps } from "../types";

type TemperatureUnits = 'metric' | 'imperial';

export default function ({ navigation }: RootStackScreenProps<'Settings'>) {

  const weather = useContext(WeatherContext);
  const theme = useColorScheme();
  const headerHeight = useHeaderHeight();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
        <SettingBase text="Temperature Units">
          <Button
            title={weather.temperatureUnits}
            onPress={() => weather.toggleTemperatureUnits()}
            color={Colors[theme].tint}
          />
        </SettingBase>
      </ScrollView>
    </ScreenContainer>
  )
}