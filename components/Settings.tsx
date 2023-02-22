import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { Children } from "react";
import { LayoutAnimation, Pressable, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { Text, View } from "./Themed";

export function SettingBase({ text, onPress, children }: { text: string, onPress?: () => void, children: any }) {

  const styles = makeStyles();

  return (
    <Pressable style={styles.settingContainer} onPress={onPress}>
      <Text style={styles.settingText}>{text}</Text>
      {children}
    </Pressable>
  )
}

export const SettingSelection = ({ item, selected, onPress }: { item: string, selected: boolean, onPress: () => void }) => {

  const styles = makeStyles();
  const theme = useColorScheme();

  return (
    <SettingBase
      text={item}
      onPress={onPress}
    >
      {selected ? (
        <Text style={[styles.settingText, { color: Colors[theme].tint, fontWeight: 'bold' }]}>
          ✓
        </Text>
      ) : (
        null
      )}
    </SettingBase>
  )
}

const makeStyles = () => {

  const theme = useColorScheme();

  return StyleSheet.create({
    settingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Layout.margin,
      paddingHorizontal: Layout.margin * 2,
    },
    settingText: {
      fontSize: 18,
      fontWeight: 'normal',
      color: Colors[theme].text,
      textTransform: 'capitalize',
    }
  })
}