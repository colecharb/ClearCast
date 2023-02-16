import { SearchBar as _SearchBar_ } from "@rneui/themed"
import { SearchBarProps } from "@rneui/themed"
import React from "react"
import useColorScheme from "../hooks/useColorScheme"
import Colors from "../constants/Colors"
import { StyleSheet } from "react-native"
import Layout from "../constants/Layout"

export default function SearchBar({ ...props }: SearchBarProps) {

  const colorScheme = useColorScheme()
  const styles = makeStyles()

  return (
    <_SearchBar_
      selectionColor={Colors[colorScheme].tint}
      platform='ios'
      searchIcon={styles.searchIcon}
      containerStyle={[styles.searchBarContainer]}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.inputStyle}
      placeholderTextColor={Colors[colorScheme].medium}
      // showCancel={true}
      // cancelButtonTitle='Cancel'
      cancelButtonProps={{ color: Colors[colorScheme].tint, buttonStyle: styles.cancelButton }}
      returnKeyType='go'
      clearIcon={styles.clearIcon}
      // value={value}
      // onChangeText={onChangeText}
      // onSubmitEditing={onSubmitEditing}
      // // onClear={onSubmitEditing}
      // onCancel={onCancel}
      // onEndEditing={onEn}
      // placeholder={placeholder}
      {...props}

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
      backgroundColor: 'transparent',
    },
    inputStyle: {
      backgroundColor: 'transparent',
      color: Colors[theme].text,
      fontWeight: 'bold',
    },
    cancelButton: {
      margin: Layout.margin
    },
    searchIcon: {
      color: Colors[theme].text
    },
    clearIcon: {
      color: Colors[theme].medium
    }
  })
}