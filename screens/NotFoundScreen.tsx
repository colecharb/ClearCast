import React from 'react';
import { Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

import { Text } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootStackScreenProps, RootTabScreenProps } from '../types';

export default function NotFoundScreen({ navigation }: RootTabScreenProps<'SettingsTab'> | RootStackScreenProps<'NotFound'>) {

  const theme = useColorScheme()

  return (
    <ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>

      <Text style={{ color: '#fff' }}>This screen doesn't exist.</Text>
      <Pressable onPress={() => navigation.replace('Root')}>
        <Text style={{ color: Colors[theme].tint }}>Go to home screen!</Text>
      </Pressable>
    </ScreenContainer>
  );
}
