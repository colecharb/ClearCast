import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import ScreenContainer from '../components/ScreenContainer';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function ({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <ScreenContainer>
      <Text>
        asdfjkl;
      </Text>
    </ScreenContainer>
  );
}
