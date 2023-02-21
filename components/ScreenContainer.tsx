import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { View, ViewProps } from "./Themed";
import { useHeaderHeight } from '@react-navigation/elements'
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function (props: ViewProps) {
  const theme = useColorScheme();
  // const headerHeight = useHeaderHeight();
  // const safeAreaInsets = useSafeAreaInsets();
  const { style } = props;
  return (
    <>
      <View
        {...props}
        style={[{ flex: 1, backgroundColor: Colors[theme].background }, style]}
      />
      {/* <LinearGradient
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: safeAreaInsets.top * 1.25 }}
        colors={[Colors[theme].background, Colors[theme].background + 'aa', Colors[theme].background + '00']}
        locations={[0, 3 / 4, 1]}
      /> */}
    </>
  )
}