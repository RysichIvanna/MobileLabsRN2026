import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ContactsScreen from './src/screens/ContactsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MainScreen from './src/screens/MainScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              title: 'Main Screen',
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              title: 'Details',
            }}
          />
          <Stack.Screen
            name="Contacts"
            component={ContactsScreen}
            options={{
              title: 'Contacts',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
