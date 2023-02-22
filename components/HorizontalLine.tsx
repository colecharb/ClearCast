import React from "react";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { View, ViewProps } from "./Themed";

export default function ({ style, ...props }: ViewProps) {
  const theme = useColorScheme();
  return (
    <View style={[
      {
        height: Layout.borderWidth,
        borderRadius: Layout.borderWidth,
        backgroundColor: Colors[theme].subtle,
      },
      style
    ]}
      {...props}
    />
  );
}