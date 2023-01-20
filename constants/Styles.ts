import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "./Colors";
import Layout from "./Layout";

export default function makeStyles() {
  const theme = useColorScheme()

  return (
    StyleSheet.create({
      container: {
        padding: Layout.margin,
      },
      card: {
        borderWidth: 1,
        borderRadius: Layout.margin,
        borderColor: Colors[theme].text
      }
    })
  )
}

