import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { Children } from "react";
import { LayoutAnimation, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { Text, View } from "./Themed";

export default function ({ text, onPress, children }: { text: string, onPress?: () => void, children: any }) {

  const styles = makeStyles();

  return (
    <Pressable style={styles.settingContainer} onPress={onPress}>
      <Text style={styles.settingText}>{text}</Text>
      {children}
    </Pressable>
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
      flex: 1, 
      fontSize: 18,
      fontWeight: 'normal',
      color: Colors[theme].text,
      textTransform: 'capitalize',
    }
  })
}