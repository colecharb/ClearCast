import React, { useContext } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text, View } from "./Themed";
import { WeatherContext } from "../contexts/Weather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function () {

  const theme = useColorScheme();
  const weather = useContext(WeatherContext);
  const safeAreaInsets = useSafeAreaInsets();
  const navigation = useNavigation();

  // TODO: do this intelligently: ignore null entries and make it less wordy
  const placeName = weather.place?.name ?? null;

  return (
    <LinearGradient
      colors={[Colors[theme].background + 'ff', Colors[theme].background + 'cc', Colors[theme].background + '00']}
      locations={[0, 1 / 2, 1]} //{[0, 1 / 4, 2 / 4, 3 / 4, 1]}
      style={{ paddingBottom: Layout.margin * 4, justifyContent: 'center', paddingTop: safeAreaInsets.top, marginBottom: -Layout.margin * 3, }}
      pointerEvents='box-none'
    >
      <View style={{ marginTop: Layout.margin / 2 }}>
        {weather.loading ? (
          <ActivityIndicator size={30} />
        ) : (
            <Text style={{ textAlign: 'center', fontSize: 30, lineHeight: 30, fontWeight: '900', paddingHorizontal: Layout.margin * 2 + 30 }}>
              {weather.place?.name}
          </Text>
        )}

        <Text style={{ textAlign: 'center', fontSize: 14, lineHeight: 25, fontWeight: 'normal', color: Colors[theme].medium }}>
          {weather.loading ? ' ' : weather.place?.formatted_address}
        </Text>
      </View>



      <Pressable
        style={{ position: 'absolute', right: 0, top: safeAreaInsets.top, marginRight: Layout.margin, marginTop: Layout.margin / 2 }}
        onPress={() => navigation.navigate('Settings')}
      // hitSlop={Layout.margin}
      >
        <FontAwesome size={30} color={Colors[theme].light} name='gears' />
      </Pressable>

    </LinearGradient>
  )
}