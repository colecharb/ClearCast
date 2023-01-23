import React from "react";
import makeStyles from "../constants/Styles";
import { View, ViewProps } from "./Themed";


export default function (props: ViewProps) {
  const styles = makeStyles()
  const { style } = props;
  return (
    <View
      {...props}
      style={[styles.card, styles.container, style]}
    />
  )
}