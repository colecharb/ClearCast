import React from "react";
import { useContext } from "react";
import { Alert, FlatList, FlatListProps, Pressable } from "react-native";
import { Text, View } from "./Themed";
import { WeatherContext } from "../contexts/Weather";
import { PlaceAutocompletePrediction, PlacesAutocompleteResponse } from "../types";
import Layout from "../constants/Layout";

import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function ({ autocompleteResponse, onSelectPlace }: { autocompleteResponse: PlacesAutocompleteResponse | undefined, onSelectPlace: () => void }) {

  const weather = useContext(WeatherContext);
  const theme = useColorScheme();

  if (!autocompleteResponse) return null;

  const renderItem = ({ item }: { item: PlaceAutocompletePrediction }) => (
    <Pressable
      style={{ padding: Layout.margin, alignItems: 'center' }}
      onPress={() => {
        weather.getCoordinatesAsync(item.place_id);
        onSelectPlace();
      }}
    >
      <Text style={{ fontSize: 20 }}>
        {item.structured_formatting.main_text}
        {/* {item.structured_formatting.main_text}, {item.structured_formatting.secondary_text} */}
      </Text>
      <Text style={{ fontSize: 16, color: Colors[theme].medium }}>
        {item.structured_formatting.secondary_text}
      </Text>
      {/* <Text style={{ color: 'red' }}>
        {item.types.join(', ')}
      </Text> */}
    </Pressable>
  )

  return (
    <View style={{}}>
      <FlatList
        inverted
        style={{}}
        // scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
        // pointerEvents='box-none'
        // style={{ borderColor: 'red', borderWidth: 2 }}
        data={autocompleteResponse.predictions}
        renderItem={renderItem}
      />
      <LinearGradient
        pointerEvents="none"
        style={{ zIndex: 10, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        colors={[Colors[theme].background + '77', Colors[theme].background + '00']}
      />
    </View>
  )
}