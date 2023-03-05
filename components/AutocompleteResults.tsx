import React from "react";
import { useContext } from "react";
import { FlatList, Pressable, StyleProp, ViewStyle } from "react-native";
import { Text, View } from "./Themed";
import { WeatherContext } from "../contexts/Weather";
import { PlaceAutocompletePrediction, PlacesAutocompleteResponse } from "../types";
import Layout from "../constants/Layout";

import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

export default function ({ autocompleteResponse, onSelectPlace, style, contentContainerStyle }: { autocompleteResponse: PlacesAutocompleteResponse | undefined, onSelectPlace: () => void, style?: StyleProp<ViewStyle>, contentContainerStyle: StyleProp<ViewStyle> }) {

  const weather = useContext(WeatherContext);
  const theme = useColorScheme();

  if (!autocompleteResponse) return null;

  const renderItem = ({ item, index }: { item: PlaceAutocompletePrediction, index: number }) => (
    <Pressable
      style={{ padding: Layout.margin, marginHorizontal: 1.65 * Layout.margin }}
      onPress={() => {
        weather.getCoordinatesAsync(item.place_id);
        onSelectPlace();
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: `${9 - 2 * index}00` }}>
        {item.structured_formatting.main_text}
        {/* {item.structured_formatting.main_text}, {item.structured_formatting.secondary_text} */}
      </Text>
      <Text style={{ fontSize: 14, color: Colors[theme].medium }}>
        {item.structured_formatting.secondary_text}
      </Text>
      {/* <Text style={{ color: 'red' }}>
        {item.types.join(', ')}
      </Text> */}
    </Pressable>
  )

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        inverted
        // style={style}
        contentContainerStyle={contentContainerStyle}
        // scrollEnabled={false}
        keyboardShouldPersistTaps='handled' // allows tapping of results while keeb is open
        // style={{ borderColor: 'red', borderWidth: 2 }}
        data={autocompleteResponse.predictions}
        renderItem={renderItem}
      />
      {/* <LinearGradient
        pointerEvents="none"
        style={{ zIndex: 10, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        colors={[Colors[theme].background + '77', Colors[theme].background + '00']}
      /> */}
    </View>
  )
}