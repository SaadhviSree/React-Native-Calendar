import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, VirtualizedList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, FontAwesome6 } from 'react-native-vector-icons';
import { LocaleConfig } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

import { database, ref, get, child } from './firebase';

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

LocaleConfig.defaultLocale = 'en'

const getTodayDateString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const m = today.getMonth() + 1
  const d = today.getDate()
  const month = m.toString().padStart(2, '0')
  const day = d.toString().padStart(2, '0') 

  return `${year}-${month}-${day}`
}

export default function CalendarScreen ({route,navigation}) {
  const today = getTodayDateString()

  const [selectedDate,setSelectedDate] = useState(today)
  const [dotsData, setDotsData] = useState({ startDates : [], endDates : [],  onDates : [], betweenDates : [] })
  const [data, setData] = useState({ singleDayEvents: {}, multiDayEvents: {} })
  const [filterCategory, setFilterCategory] = useState('All');

  const date = (selectedDate === '') ? today : selectedDate
  const showMonth = route.params?.showMonth || today
  
  const onDayPress = (day) => {
    setSelectedDate (day.dateString)
  }

  const onDayLongPress = (day) => {
    setSelectedDate (day.dateString)
    navigation.navigate('Event List', { date: day.dateString })
  }

  const onPlusPress = () => {
    navigation.navigate('Add Event',{ date:''})
  }

  const onCalPress = () => {
    navigation.navigate('Year View')
  }

  function getDateStringsBetween(startDate, endDate) {
    let dateStrings = []
    let currentDate = new Date(startDate)
    
    currentDate.setDate(currentDate.getDate() + 1)
    
    while (currentDate < new Date(endDate)) {
      dateStrings.push(currentDate.toISOString().split('T')[0]) 
      currentDate.setDate(currentDate.getDate() + 1) 
    }
    
    return dateStrings
  }

  const fetchData = async () => {
    try {
      const dbRef = ref(database);
      const snapshotMulti = await get(child(dbRef, `/multiDayEvents`));
      const snapshotSingle = await get(child(dbRef, `/singleDayEvents`));
      const start = [];
      const end = [];
      const on = [];
      const bw = [];
      const filteredMultiDayEvents = {};
      const filteredSingleDayEvents = {};
      const categories = {};
      
      const processDateRange = (startDate, endDate, category) => {
        const dateStrings = getDateStringsBetween(startDate, endDate);
        dateStrings.forEach((date) => {
          bw.push({ date, category });
        });
      };
  
      if (snapshotMulti.exists()) {
        const multiDayEvents = snapshotMulti.val();
        Object.keys(multiDayEvents).forEach((key) => {
          const event = multiDayEvents[key];
          start.push(event.event_from);
          end.push(event.event_to);
          processDateRange(event.event_from, event.event_to, event.category);
          if (event.event_from <= date && event.event_to >= date) {
            filteredMultiDayEvents[key] = event;
            categories[key] = event.category; 
          }
        });
      }
  
      if (snapshotSingle.exists()) {
        const singleDayEvents = snapshotSingle.val();
        Object.keys(singleDayEvents).forEach((key) => {
          const event = singleDayEvents[key];
          on.push({ date: event.event_date, category: event.category });
          if (event.event_date === date) {
            filteredSingleDayEvents[key] = event;
            categories[key] = event.category;  
          }
        });
      }
  
      setDotsData({ startDates: start, endDates: end, onDates: on, betweenDates: bw });
      setData({ singleDayEvents: filteredSingleDayEvents, multiDayEvents: filteredMultiDayEvents, categories });
    } catch (error) {
      console.error(error);
    }
  };
   
  useEffect(()=>{
    fetchData()
  },[selectedDate])

  const createMarkedDates = () => {
    const markedDates = {}

    const addDot = (date, key, color) => {
        if (!markedDates[date]) markedDates[date] = { dots: [], marked: true }
        markedDates[date].dots.push({ key, color })
    }

    dotsData.startDates.forEach((date) => {
        addDot(date, 'start-date', 'green')
    })

    dotsData.endDates.forEach((date) => {
        addDot(date, 'end-date', 'red')
    })

    dotsData.betweenDates.forEach(({ date, category }) => {
        const dotColor = category === 'Work' ? 'cyan' : 'magenta'
        addDot(date, 'during', dotColor)
    })
    
    //const [count,setCount] = useState(0)
    dotsData.onDates.forEach(({ date, category, key }) => {
        const dotColor = category === 'Work' ? 'cyan' : 'magenta'
        addDot(date, 'on-day-${count}', dotColor)
        //setCount(count+1)

    })

    return markedDates
}

  const marked = createMarkedDates()

  const renderEventSingle = (event) => (
    <View key={event.id} style={styles.eventContainer}>
      <View flexDirection='row' alignItems={'center'}>
        <Text style={styles.eventTitle}>{event.event_name}</Text>
        <Text style={styles.eventDates}>(From: {event.event_from} - To: {event.event_to})</Text>
      </View>
      <Text style={styles.eventCategory}>{event.category}</Text>
      <Text style={styles.eventDescription}>{event.event_description}</Text>
    </View>
  )

  const renderEventMulti = (event) => (
    <View key={event.id} style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{event.event_name}</Text>
      <Text style={styles.eventCategory}>{event.category}</Text>
      <Text style={styles.eventDescription}>{event.event_description}</Text>
      <Text style={styles.eventDates}>Started: {event.event_from}</Text>
      <Text style={styles.eventDates}>Ends on: {event.event_to}</Text>
    </View>
  )
  
  const filterEvents = (events) => {
    if (filterCategory === 'All') return events;
    return Object.keys(events).reduce((acc, key) => {
      if (events[key].category === filterCategory) acc[key] = events[key];
      return acc;
    }, {});
  };

  return(
    <SafeAreaView style={styles.container} backgroundColor='#151923'>
      <View style={{
        flexDirection:'row',
        justifyContent: 'flex-end',
        marginRight:25,
        paddingTop:15,
        paddingVertical:10,
        alignItems:'center',
      }}>
        <TouchableOpacity style={{right:60}} onPress={onPlusPress}>
          <AntDesign name='plus' size={25} color='#eef5db' />
        </TouchableOpacity>
        <TouchableOpacity style={{right:30}} onPress={onCalPress}>
          <AntDesign name='calendar' size={25} color='#eef5db' />
        </TouchableOpacity>
        <TouchableOpacity style={{top:1}}>
          <Entypo name='dots-three-vertical' size={18} color='#eef5db' />
        </TouchableOpacity>
      </View>
      <Calendar
        initialDate={showMonth}
        enableSwipeMonths={true}
        style={styles.calendar}
        showSixWeeks={true}
        markingType={'multi-dot'}
        theme={{
          backgroundColor: '#151923',
          calendarBackground: '#151923', 
          textSectionTitleColor: '#eef5db',
          dayTextColor: '#eef5db', 
          todayTextColor: '#fe5f55',
          selectedDayTextColor: '#eef5db',
          monthTextColor: '#eef5db',
          textDisabledColor: '#455B5B',
          textMonthFontSize: 25,
        }}
        renderArrow={(direction) => (
          <FontAwesome6
            name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
            size={20}
            color={'#7a9e9f'}
          />
        )}
        onDayPress={onDayPress}
        onDayLongPress={onDayLongPress}
        disableAllTouchEventsForDisabledDays={true}
        markedDates={{
          ...marked,
          [selectedDate]: {selected: true, selectedColor: '#7a9e9f'},
        }}
      ></Calendar>
      <View style={styles.separator} />
      <View style={styles.pickerContainer} marginBottom={10}>
        <Picker
          onValueChange={(filterCategory) => setFilterCategory(filterCategory)}
          style={styles.picker}
          selectedValue={filterCategory}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Personal" value="Personal" />
        </Picker>
      </View>
      <ScrollView paddingHorizontal={20} marginBottom={10}>
        {Object.keys(filterEvents(data.singleDayEvents)).length === 0 &&
         Object.keys(filterEvents(data.multiDayEvents)).length === 0 ? (
          <>
            <View style={styles.eventContainer}>
              <Text style={styles.noEventsText}>No events</Text>
            </View>
          </>
        ) : (
          <>
            {Object.keys(filterEvents(data.singleDayEvents)).length > 0 && (
              <>
                {Object.keys(filterEvents(data.singleDayEvents)).map((key) =>
                  renderEventSingle({ id: key, ...filterEvents(data.singleDayEvents)[key] })
                )}
              </>
            )}
            {Object.keys(filterEvents(data.multiDayEvents)).length > 0 && (
              <>
                {Object.keys(filterEvents(data.multiDayEvents)).map((key) =>
                  renderEventMulti({ id: key, ...filterEvents(data.multiDayEvents)[key] })
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    color:'#fff',
  },
  calendar:{
    backgroundColor: '#151923',
    color:'#eef5db',
  },
  safecontainer: {
    paddingBottom:20,
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
    fontSize: 16,
    marginBottom: 2,
    marginRight:4,
  },
  eventDescription: {
    color: '#eef5db',
    marginBottom: 2,
  },
  eventCategory: {
    color: '#eef5db',
    fontSize:10,
    marginBottom: 2,
  },
  eventDates: {
    color: '#eef5db',
  },
  noEventsText: {
    color: '#eef5db',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 18,
  },
  pickerContainer: {
    alignSelf:'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#7a9e9f',
    borderRadius: 2,
    backgroundColor: '#4f636766',
    width:200
  },
  picker: {
    marginTop:-5,
    height: 48,
    color: '#eef5db',
  },
  separator: {
    height: 2,
    backgroundColor: '#7a9e9f',
    marginTop: 10,
    marginBottom:20,
    borderRadius: 10,
    width: '70%', 
    alignSelf: 'center',
  },
})