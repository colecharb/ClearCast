import React from "react";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import GradientOverlay from "./GradientOverlay";
import { View, ViewProps } from "./Themed";

export default function (props: ViewProps) {
  const colorScheme = useColorScheme()
  const { style } = props;
  return (
    <>
      <GradientOverlay />
    <View
      {...props}
      style={[{ flex: 1, backgroundColor: Colors[colorScheme].background }, style]}
    />
    </>

  )
}