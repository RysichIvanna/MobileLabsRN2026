import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from './src/components/CustomDrawerContent';
import ContactsScreen from './src/screens/ContactsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MainScreen from './src/screens/MainScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MenuButton({ navigation }) {
  return (
    <Pressable onPress={() => navigation.getParent()?.openDrawer()} style={{ paddingRight: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#2563eb' }}>Menu</Text>
    </Pressable>
  );
}

function NewsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={({ navigation }) => ({
          title: 'Main Screen',
          headerRight: () => <MenuButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Details',
        }}
      />
    </Stack.Navigator>
  );
}

function ContactsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={({ navigation }) => ({
          title: 'Contacts',
          headerRight: () => <MenuButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            swipeEnabled: false,
          }}
        >
          <Drawer.Screen
            name="NewsStack"
            component={NewsStackNavigator}
            options={{
              title: 'News',
            }}
          />
          <Drawer.Screen
            name="ContactsStack"
            component={ContactsStackNavigator}
            options={{
              title: 'Contacts',
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
