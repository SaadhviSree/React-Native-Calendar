import React, { useState, useRef } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { database, ref, get, child } from './firebase'

export default function EventListScreen({route,navigation}) {
  const { date } = route.params
  const [data, setData] = useState({ singleDayEvents: {}, multiDayEvents: {} })
  const isFetched = useRef(false)
  

  const fetchData = async () => {
    try {
      const dbRef = ref(database)
      const snapshotMulti = await get(child(dbRef, `/multiDayEvents`))
      const snapshotSingle = await get(child(dbRef, `/singleDayEvents`))
      const filteredMultiDayEvents = {}
      const filteredSingleDayEvents = {}
      if (snapshotMulti.exists()) {
        const multiDayEvents = snapshotMulti.val();
        Object.keys(multiDayEvents).forEach((key) => {
          const event = multiDayEvents[key];
          if (event.event_from <= date && event.event_to >= date) {
            filteredMultiDayEvents[key] = event;
          }
        });
      }

      if (snapshotSingle.exists()) {
        const singleDayEvents = snapshotSingle.val();
        Object.keys(singleDayEvents).forEach((key) => {
          const event = singleDayEvents[key];
          if (event.event_date === date) {
            filteredSingleDayEvents[key] = event;
          }
        });
      }

      setData({ singleDayEvents: filteredSingleDayEvents, multiDayEvents: filteredMultiDayEvents });
    } catch (error) {
      console.error(error)
    }
  }

  if (!isFetched.current) {
    isFetched.current = true
    fetchData()
  }

  const renderEventMulti = (event) => (
    <View key={event.id} style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{event.event_name}</Text>
      <Text style={styles.eventDescription}>{event.event_description}</Text>
      <Text style={styles.eventDates}>From: {event.event_from}</Text>
      <Text style={styles.eventDates}>To: {event.event_to}</Text>
    </View>
  )

  const renderEventSingle = (event) => (
    <View key={event.id} style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{event.event_name}</Text>
      <Text style={styles.eventDescription}>{event.event_description}</Text>
      <Text style={styles.eventDates}>On: {event.event_date}</Text>
      <Text style={styles.eventDates}>From: {event.event_from}</Text>
      <Text style={styles.eventDates}>To: {event.event_to}</Text>
    </View>
  )
  /*{dataS && (
          <View style={styles.dataContainer}>
            {Object.keys(dataS).map((key) => renderEventSingle({ id: key, ...dataS[key] }))}
          </View>
        )}
      {dataM && (
          <View style={styles.dataContainer}>
            {Object.keys(dataM).map((key) => renderEventMulti({ id: key, ...dataM[key] }))}
          </View>
        )}*/
  return(
    <SafeAreaView style={styles.safecontainer}>
      <ScrollView style={styles.container}>
      {Object.keys(data.singleDayEvents).length > 0 && (
          <View style={styles.dataContainer}>
            {Object.keys(data.singleDayEvents).map((key) =>
              renderEventSingle({ id: key, ...data.singleDayEvents[key] })
            )}
          </View>
        )}
        {Object.keys(data.multiDayEvents).length > 0 && (
          <View style={styles.dataContainer}>
            {Object.keys(data.multiDayEvents).map((key) =>
              renderEventMulti({ id: key, ...data.multiDayEvents[key] })
            )}
          </View>
        )}
      
        <TouchableOpacity onPress={() => navigation.navigate('Add Event', { date })} style={styles.button}>
          <Text style={styles.text}>Add Event</Text>
        </TouchableOpacity> 
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button:{
    backgroundColor:'#7a9e9f',
    height: 40,
    width: 200,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent:'center',
    alignSelf: 'center',
    marginTop:0,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#151923',
    paddingHorizontal: 20,
  },
  safecontainer: {
    flexGrow:1,
    flexDirection:'column',
    backgroundColor: '#151923',
  },
  dataContainer: {
    marginBottom: 20,
    width: '100%',
  },
  eventContainer: {
    backgroundColor: '#253239',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventTitle: {
    color: '#eef5db',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  eventDescription: {
    color: '#eef5db',
    marginBottom: 8,
  },
  eventDates: {
    color: '#eef5db',
  },
})