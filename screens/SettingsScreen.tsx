import React, { useContext, useEffect, useState } from "react";
import { Button, FlatList, LayoutAnimation, ScrollView, StyleSheet } from "react-native";
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from "../components/ScreenContainer";
import SettingBase from "../components/SettingBase";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { WeatherContext } from "../contexts/Weather";
import useColorScheme from "../hooks/useColorScheme";
import { ALL_UNITS, RootStackScreenProps, Units } from "../types";
import DropDownPicker from 'react-native-dropdown-picker';
import Layout from "../constants/Layout";
import { FontAwesome } from "@expo/vector-icons";
import HorizontalLine from "../components/HorizontalLine";
import { HeaderBackButton } from '@react-navigation/elements'
import { color } from "@rneui/themed/dist/config";

export default function ({ navigation }: RootStackScreenProps<'Settings'>) {

  const weather = useContext(WeatherContext);

  const headerHeight = useHeaderHeight();
  const styles = makeStyles();

  const [units, setUnits] = useState(weather.units);
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | 'automatic'>('automatic')
  const theme = useColorScheme();

  navigation.setOptions({
    headerLeft: () => (
      <HeaderBackButton
        labelVisible
        tintColor={Colors[theme].tint}
        onPress={() => {
          weather.setUnits(units);
          navigation.goBack();
        }}
      />
    )
  })

  const SettingSelection = ({ item, value, onPress }: { item: string, value: string, onPress: () => void }) => {
    return (
      <SettingBase
        text={item}
        onPress={onPress}
      >
        {value === item ? (
          <FontAwesome name='check' color={Colors[theme].tint} />
        ) : (
          null
        )}
      </SettingBase>
    )
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: Layout.margin, paddingTop: headerHeight }}>

        <Text style={styles.settingTitle}>
          units
        </Text>
        <View style={styles.settingsView}>
          {ALL_UNITS.map((theUnits, index) => <>
            {index === 0 ? null : <HorizontalLine key={-index} />}
            <SettingSelection
              item={theUnits}
              value={units}
              onPress={() => setUnits(theUnits)}
              key={theUnits}
            />
          </>)}
        </View>

        <Text style={styles.settingTitle}>
          Theme <Text style={[styles.settingTitle, { textTransform: 'none', color: Colors[theme].light }]}>(not working yet)</Text>
        </Text>
        <View style={styles.settingsView}>
          {['light', 'dark', 'automatic'].map((selection, index) => <>
            {index === 0 ? null : <HorizontalLine key={-index} />}
            <SettingSelection
              item={selection ?? 'automatic'}
              value={manualTheme}
              onPress={() => setManualTheme(selection)}
              key={units}
            />
          </>)}
        </View>

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
      marginTop: Layout.margin,
    }
  })
}