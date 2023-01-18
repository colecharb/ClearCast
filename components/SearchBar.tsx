import { SearchBar as _SearchBar_ } from "@rneui/themed"
import React from "react"
import useColorScheme from "../hooks/useColorScheme"
import Colors from "../constants/Colors"
import { useThemeColor } from "./Themed"
import { StyleSheet } from "react-native"
import Layout from "../constants/Layout"

export default function SearchBar(
  {
    value,
    onChangeText,
    placeholder = 'Search',
  }: {
    value: string,
    onChangeText: (s: string) => void,
    placeholder?: string,
  }) {

  const colorScheme = useColorScheme()
  const styles = makeStyles()

  return (
    <_SearchBar_
      selectionColor={Colors[colorScheme].tint}
      platform='ios'

      containerStyle={styles.searchBarContainer}
      inputContainerStyle={{ backgroundColor: 'transparent' }}
      // inputStyle={{ textAlign: "center" }}
      placeholderTextColor={Colors[colorScheme].text}
      // showCancel={true}
      // cancelButtonTitle='asdf'
      cancelButtonProps={{ color: Colors[colorScheme].tint, buttonStyle: styles.cancelButton }}

      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  )

}

const makeStyles = () => {
  const colorScheme = useColorScheme()

  return (
    StyleSheet.create({
      searchBarContainer: {
        backgroundColor: Colors[colorScheme].background,
      },
      cancelButton: {
        margin: Layout.margin
      }
    })
  )
}