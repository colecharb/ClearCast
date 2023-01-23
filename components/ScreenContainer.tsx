import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { View, ViewProps } from "./Themed";
import { useHeaderHeight } from '@react-navigation/elements'

export default function (props: ViewProps) {
  const theme = useColorScheme()
  const headerHeight = useHeaderHeight()
  const { style } = props;
  return (
    <>

      <View
        {...props}
        style={[{ flex: 1, backgroundColor: Colors[theme].background }, style]}
      />
      <LinearGradient
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: headerHeight }}
        colors={[Colors[theme].background, Colors[theme].background + '77', Colors[theme].background + '00']}
        locations={[0, 3 / 4, 1]}
      />
    </>
  )
}