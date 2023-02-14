/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ClearCastScreen from '../screens/ClearCastScreen';
import ClearCastHeader from '../components/ClearCastHeader';

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

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClearCast"
        component={ClearCastScreen}
        options={() => {
          return {
            animation: 'fade',
            headerTransparent: true,
            headerTitleStyle: styles.navigationHeaderTitle,
            header: ClearCastHeader,
            // headerShown: false,
          }
        }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
// const BottomTab = createBottomTabNavigator<RootTabParamList>();

// function BottomTabNavigator() {
//   const theme = useColorScheme();
//   const styles = makeStyles();

//   return (
//     <BottomTab.Navigator
//       initialRouteName="ClearCast"
//       screenOptions={{
//         headerTitleStyle: styles.navigationHeaderTitle,
//         headerStyle: styles.navigationHeader,
//         // headerBackTitleStyle: styles.navigationBackTitleStyle,
//         // headerTintColor: Colors[colorScheme].tint,
//         headerShadowVisible: false,
//         // headerShown: false,
//         headerTransparent: true,

//         tabBarActiveTintColor: Colors[theme].tint,
//         tabBarInactiveTintColor: Colors[theme].medium,
//         tabBarStyle: styles.navigationTabBar,
//         tabBarShowLabel: false
//       }}>

//       <BottomTab.Screen
//         name="ClearCast"
//         component={ClearCastScreen}
//         options={{
//           title: 'ClearCast',
//           tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
//         }}
//       />
//       <BottomTab.Screen
//         name="SettingsTab"
//         component={NotFoundScreen}
//         options={({ navigation }: RootTabScreenProps<'SettingsTab'>) => ({
//           // headerShown: false,
//           title: 'Hourly',
//           tabBarIcon: ({ color }) => <TabBarIcon name='clock-o' color={color} />,
//           // headerRight: () => (
//           //   <Pressable
//           //     onPress={() => navigation.navigate('Modal')}
//           //     style={({ pressed }) => ({
//           //       opacity: pressed ? 0.5 : 1,
//           //     })}>
//           //     <FontAwesome
//           //       name="info-circle"
//           //       size={25}
//           //       color={Colors[colorScheme].text}
//           //       style={{ marginRight: 15 }}
//           //     />
//           //   </Pressable>
//           // ),
//         })}
//       />
//     </BottomTab.Navigator>
//   );
// }

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
      // navigationTabBar: {
      //   backgroundColor: Colors[theme].background + '00',
      //   borderTopWidth: 0,
      //   // marginTop: -100,
      //   // height: 100,
      //   position: 'absolute'
      // }
    })
  )
}