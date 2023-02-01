import { SearchBar as _SearchBar_ } from "@rneui/themed"
import React from "react"
import useColorScheme from "../hooks/useColorScheme"
import Colors from "../constants/Colors"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import Layout from "../constants/Layout"
import { FontAwesome } from "@expo/vector-icons"

export default function SearchBar(
  {
    containerStyle,
    value,
    onChangeText,
    placeholder = 'Search',
    onSubmitEditing
  }: {
      containerStyle?: StyleProp<ViewStyle>,
    value: string,
    onChangeText: (s: string) => void,
    placeholder?: string,
      onSubmitEditing: (() => void) | undefined
  }) {

  const colorScheme = useColorScheme()
  const styles = makeStyles()

  return (
    <_SearchBar_
      selectionColor={Colors[colorScheme].tint}
      platform='ios'

      searchIcon={styles.searchIcon}
      containerStyle={[styles.searchBarContainer, containerStyle]}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.inputStyle}
      placeholderTextColor={Colors[colorScheme].medium}
      // showCancel={true}
      // cancelButtonTitle='asdf'
      cancelButtonProps={{ color: Colors[colorScheme].tint, buttonStyle: styles.cancelButton }}
      returnKeyType='go'

      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      // onClear={onSubmitEditing}
      onCancel={onSubmitEditing}
      placeholder={placeholder}
    />
  )

}


function makeStyles() {
  const theme = useColorScheme()
  return StyleSheet.create({
    searchBarContainer: {
      backgroundColor: 'transparent',
      height: 75
    },
    inputContainer: {
      backgroundColor: 'transparent'
    },
    inputStyle: {
      backgroundColor: 'transparent',
      color: Colors[theme].text,
      fontWeight: 'bold'
    },
    cancelButton: {
      margin: Layout.margin
    },
    searchIcon: {
      color: Colors[theme].medium
    }
  })
}