import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { Children } from "react";
import { LayoutAnimation, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { Text, View } from "./Themed";

export default function ({ text, children }: { text: string, children: any }) {

  const styles = makeStyles();

  return (
    <View style={styles.settingContainer}>
      <Text style={styles.settingText}>{text}</Text>
      {children}
    </View>
  )
}


const makeStyles = () => {

  const theme = useColorScheme();

  return StyleSheet.create({
    settingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Layout.margin
    },
    settingText: {
      fontSize: 18,
      fontWeight: 'normal',
      color: Colors[theme].text,
    }
  })
}