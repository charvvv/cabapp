import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import welcomeScreen from './screens/welcomeScreen';
import homeScreen from './screens/homeScreen';
import signUpScreen from './screens/signUpScreen';
import loginScreen from './screens/loginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcomeScreen">
        <Stack.Screen name="welcomeScreen" component={welcomeScreen} />
        <Stack.Screen name="homeScreen" component={homeScreen} />
        <Stack.Screen name="signUpScreen" component={signUpScreen} />
        <Stack.Screen name="loginScreen" component={loginScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});