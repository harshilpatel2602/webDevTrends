import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          header: () => null, // Hides the header for this screen
        }}
      />
      
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTitle: 'Notes/Memos', // Hides the header title
          headerBackVisible: true, // Keeps the back button visible
        }}
      />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
