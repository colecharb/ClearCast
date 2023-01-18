import { StyleSheet, useColorScheme } from "react-native";
import Layout from "./Layout";

const makeStyles = () => {
  const colorScheme = useColorScheme()

  return (
    StyleSheet.create({
      container: {
        padding: Layout.margin,
      },
    })
  )
}

export default makeStyles();
