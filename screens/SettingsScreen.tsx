import React, { useContext, useState } from "react";
import { Button, ScrollView, StyleSheet } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from "../components/ScreenContainer";
import { SettingSelection } from "../components/Settings";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { WeatherContext } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { ALL_UNITS, RootStackScreenProps, Units } from "../types";
import Layout from "../constants/Layout";
import HorizontalLine from "../components/HorizontalLine";
import { HeaderBackButton } from '@react-navigation/elements'
import { SettingsContext } from "../contexts/Settings";

export default function ({ navigation }: RootStackScreenProps<'Settings'>) {

  const settings = useContext(SettingsContext);

  const headerHeight = useHeaderHeight();
  const styles = makeStyles();


  const changeUnits = (units: Units) => {
    settings.setUnits(units)
  }

  // navigation.setOptions({
  //   headerLeft: () => (
  //     <HeaderBackButton
  //       // labelVisible
  //       tintColor={Colors[theme].tint}
  //       onPress={() => {
  //         weather.setUnits(units);
  //         navigation.goBack();
  //       }}
  //     />
  //   )
  // })

  const SettingSeparator = () => (
    <HorizontalLine style={{ marginLeft: Layout.margin * 2 }} />
  )

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: Layout.margin, paddingTop: headerHeight }}>

        <Text style={styles.settingTitle} key='title'>
          units
        </Text>
        <View style={styles.settingsView}>
          {ALL_UNITS.map((theUnits, index) => (
            <View key={index}>
              {index === 0 ? null : <SettingSeparator />}
              <SettingSelection
                item={theUnits}
                selected={theUnits === settings.units}
                onPress={() => changeUnits(theUnits)}
              // key={theUnits}
              />
            </View>
          ))}
        </View>

        {/* <Text style={styles.settingTitle}>
          Theme <Text style={[styles.settingTitle, { textTransform: 'none', color: Colors[theme].light }]}>(not working yet)</Text>
        </Text>
        <View style={styles.settingsView}>
          {['light', 'dark', 'automatic'].map((selection, index) => <>
            {index === 0 ? null : <SettingSeparator key={-index} />}
            <SettingSelection
              item={selection ?? 'automatic'}
              selected={selection === manualTheme}
              onPress={() => setManualTheme(selection)}
              key={units}
            />
          </>)}
        </View> */}

      </ScrollView>
    </ScreenContainer>
  )
}


const makeStyles = () => {

  const theme = useColorScheme();

  return StyleSheet.create({
    settingsView: {
      backgroundColor: Colors[theme].subtle,
      // margin: Layout.margin,
      borderRadius: Layout.margin,
    },
    settingTitle: {
      textTransform: 'uppercase',
      color: Colors[theme].medium,
      padding: Layout.margin,
      marginLeft: Layout.margin,
      marginTop: Layout.margin,
    }
  })
}