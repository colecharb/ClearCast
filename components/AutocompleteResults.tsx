import React from "react";
import { useContext } from "react";
import { FlatList, Pressable, StyleProp, ViewStyle } from "react-native";
import { Text, View } from "./Themed";
import { WeatherContext } from "../contexts/Weather";
import { PlaceAutocompletePrediction, PlacesAutocompleteResponse } from "../types";
import Layout from "../constants/Layout";

import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import rescale from "../utils/rescale";

export default function ({ autocompleteResponse, sessionToken, onSelectPlace, style, contentContainerStyle }: { autocompleteResponse: PlacesAutocompleteResponse | undefined, sessionToken: string, onSelectPlace: () => void, style?: StyleProp<ViewStyle>, contentContainerStyle: StyleProp<ViewStyle> }) {

  const weather = useContext(WeatherContext);
  const theme = useColorScheme();

  if (!autocompleteResponse) return null;

  const renderItem = ({ item, index }: { item: PlaceAutocompletePrediction, index: number }) => {

    const opacity = rescale({
      oldMin: 4,
      oldMax: 0,
      newMin: 0.3,
      newMax: 1,
      value: index
    })

    return (
      <Pressable
        style={{ padding: Layout.margin, marginHorizontal: 1.65 * Layout.margin }}
        onPress={() => {
          const params = { placeID: item.place_id, sessionToken: sessionToken };
          weather.getCoordinatesAsync(params);
          onSelectPlace();
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: `${9 - index}00`, opacity: opacity, }}>
          {item.structured_formatting.main_text}
          {/* {item.structured_formatting.main_text}, {item.structured_formatting.secondary_text} */}
        </Text>
        <Text style={{ fontSize: 14, color: Colors[theme].medium, opacity: opacity }}>
          {item.structured_formatting.secondary_text}
        </Text>
        {/* <Text style={{ color: 'red' }}>
          {item.types.join(', ')}
        </Text> */}
      </Pressable >
    )
  }

  return (
    // <View style={{ flex: 1 }}>
      <FlatList
      inverted={true}
      style={style}
        contentContainerStyle={contentContainerStyle}
        // scrollEnabled={false}
        keyboardShouldPersistTaps='handled' // allows tapping of results while keeb is open
        // style={{ borderColor: 'red', borderWidth: 2 }}
        data={autocompleteResponse.predictions}
        renderItem={renderItem}
      />
    // </View>
  )
}