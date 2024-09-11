import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from 'react-native-vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { database, ref, get, child } from './firebase';

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
        const multiDayEvents = snapshotMulti.val()
        Object.keys(multiDayEvents).forEach((key) => {
          const event = multiDayEvents[key]
          if (event.event_from <= date && event.event_to >= date) filteredMultiDayEvents[key] = event
        })
      }

      if (snapshotSingle.exists()) {
        const singleDayEvents = snapshotSingle.val()
        Object.keys(singleDayEvents).forEach((key) => {
          const event = singleDayEvents[key]
          if (event.event_date === date) filteredSingleDayEvents[key] = event
        })
      }

      setData({ singleDayEvents: filteredSingleDayEvents, multiDayEvents: filteredMultiDayEvents })
    } catch (error) {
      console.error(error)
    }
  }

  if (!isFetched.current) {
    isFetched.current = true
    fetchData()
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const handleEditSingle = (event) => {
    navigation.navigate('Edit Event',{event, type:"Single"})
  }

  const handleEditMulti = (event) => {
    navigation.navigate('Edit Event',{event, type:"Single"})
  }

  const renderEventMulti = (event) => (
    <View key={event.id} style={styles.eventContainer} flexDirection={'row'} alignItems={'center'}>
      <View flex={1}>
        <Text style={styles.eventTitle}>{event.event_name}</Text>
        <Text style={styles.eventDescription}>{event.event_description}</Text>
        <Text style={styles.eventDates}>FROM: {event.event_from}</Text>
        <Text style={styles.eventDates}>TO: {event.event_to}</Text>
      </View>
      <TouchableOpacity flex={1} onPress={()=>handleEditMulti(event)}>
        <Feather name='edit' size={20} color='#eef5db' />
      </TouchableOpacity>
    </View>
  )

  const renderEventSingle = (event) => (
    <View key={event.id} style={styles.eventContainer} flexDirection={'row'} alignItems={'center'}>
      <View flex={1}>
        <Text style={styles.eventTitle}>{event.event_name}</Text>
        <Text style={styles.eventDescription}>{event.event_description}</Text>
        <Text style={styles.eventDates}>ON: {event.event_date}</Text>
        <Text style={styles.eventDates}>FROM: {event.event_from}</Text>
        <Text style={styles.eventDates}>TO: {event.event_to}</Text>
      </View>
      <TouchableOpacity flex={1} onPress={()=>handleEditSingle(event)}>
        <Feather name='edit' size={20} color='#eef5db' />
      </TouchableOpacity>
    </View>
  )

  return(
    <SafeAreaView backgroundColor={'#151923'} flexDirection={'column'} flexGrow={1}>
      <TouchableOpacity onPress={() => navigation.navigate('Add Event', { date })} style={styles.button}>
        <Text style={styles.text}>Add Event</Text>
      </TouchableOpacity> 

      <ScrollView height={660} style={styles.container} contentContainerStyle={styles.safecontainer}>
        {Object.keys(data.singleDayEvents).length > 0 && (
          <>
            {Object.keys(data.singleDayEvents).map((key) =>
              renderEventSingle({ id: key, ...data.singleDayEvents[key] })
            )}
          </>
        )}
        {Object.keys(data.multiDayEvents).length > 0 && (
          <>
            {Object.keys(data.multiDayEvents).map((key) =>
              renderEventMulti({ id: key, ...data.multiDayEvents[key] })
            )}
          </>
        )}
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
    top:-10,
    marginBottom:6,
  },
  container: {
    backgroundColor: '#151923',
    paddingHorizontal: 20,
  },
  safecontainer: {
    paddingBottom:20
  },
  dataContainer: {
    width: '100%',
  },
  eventContainer: {
    backgroundColor: '#253239',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
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