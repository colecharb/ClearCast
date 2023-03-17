/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ClearCastScreen from '../screens/ClearCastScreen';
import ClearCastHeader from '../components/ClearCastHeader';
import SettingsScreen from '../screens/SettingsScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const theme = useColorScheme()
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const styles = makeStyles();
  const theme = useColorScheme();

  return (
    <Stack.Navigator
      initialRouteName='ClearCast'
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: 'regular',
        headerTitleStyle: styles.navigationHeaderTitle,
        headerTintColor: Colors[theme].tint,
      }}
    >
      <Stack.Screen
        name="ClearCast"
        component={ClearCastScreen}
        options={() => {
          return {
            animation: 'fade',
            header: ClearCastHeader,
            // headerShown: false,
          }
        }}
      />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
}

// /**
//  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//  */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
// }


const makeStyles = () => {
  const theme = useColorScheme()

  return (
    StyleSheet.create({
      navigationHeader: {
        backgroundColor: Colors[theme].background,
      },
      navigationHeaderTitle: {
        color: Colors[theme].text,
      },
    })
  )
}