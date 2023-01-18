import React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements'
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import Layout from '../constants/Layout';

export default function ({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [searchQuery, setSearchQuery] = useState<string>('')

  return (

    <ScreenContainer >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={useHeaderHeight()}
        style={{ flex: 1 }}
      >

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>
            Daily forecasts (past, present, and future) will be displayed here.
          </Text>
        </View>



        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Current Location"
        />

      </KeyboardAvoidingView >

    </ScreenContainer >




  );
}
