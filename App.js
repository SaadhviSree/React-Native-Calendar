import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import CalendarScreen from './CalendarScreen'
import AddEventScreen from './AddEventScreen'
import EventListScreen from './EventListScreen'
import YearViewScreen from './YearViewScreen'
import ExpandableCalendarScreen from './ExpandableCalendarScreen'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator 
        initialRouteName='Calendar'
        screenOptions={{
          headerTintColor:'#eef5db',
          headerStyle:{
            backgroundColor:'#7a9e9f'
          }
        }}>
        <Stack.Screen name = "Calendar" component={CalendarScreen} options={{headerShown:false}}/>
        <Stack.Screen name = "Event List" component={EventListScreen}/>
        <Stack.Screen name = "Add Event" component={AddEventScreen}/>
        <Stack.Screen name = "Year View" component={YearViewScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151923",
    color:"#fff",
    alignItems: 'center',
    justifyContent: 'center',
  },
})
