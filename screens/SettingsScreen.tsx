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
  const theme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const styles = makeStyles();

  const [units, setUnits] = useState(weather.units);

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

  const UnitsSelection = ({ item }: { item: Units }) => {
    return (
      <SettingBase
        text={item}
        onPress={() => setUnits(item)}
      >
        {units === item ? (
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
          {ALL_UNITS.map((units, index) => <>
            {index === 0 ? null : <HorizontalLine />}
            <UnitsSelection item={units} key={units} />
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