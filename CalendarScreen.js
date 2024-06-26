import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Calendar } from "react-native-calendars"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { AntDesign, Entypo } from 'react-native-vector-icons'
import { LocaleConfig } from 'react-native-calendars'

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

LocaleConfig.defaultLocale = 'en'


/*<TouchableOpacity style={{right:60}}>
          <AntDesign name="plus" size={25} color="#eef5db" />
        </TouchableOpacity>*/

export default function CalendarScreen ({navigation}) {
  const [selectedDate,setSelectedDate] = useState('')
  
  const onDayPress = (day) => {
    setSelectedDate (day.dateString)
    navigation.navigate('Event List', { date: day.dateString })
  }

  const onPlusPress = (day) => {
    navigation.navigate('Add Event',{ date: day.dateString })
  }

  const onCalPress = () => {
    navigation.navigate('Year View')
  }

  return(
    <SafeAreaView style={styles.container} backgroundColor="#151923">
      <View style={{
        flexDirection:'row',
        justifyContent: 'flex-end',
        marginRight:25,
        paddingTop:15,
        paddingVertical:10,
        alignItems:'center',
      }}>
        <TouchableOpacity style={{right:30}} onPress={onCalPress}>
          <AntDesign name="calendar" size={25} color="#eef5db" />
        </TouchableOpacity>
        <TouchableOpacity style={{top:1}}>
          <Entypo name="dots-three-vertical" size={18} color="#eef5db" />
        </TouchableOpacity>
      </View>
      <Calendar
        enableSwipeMonths={true}
        style={styles.calendar}
        theme={{
          backgroundColor: '#151923',
          calendarBackground: '#151923', 
          textSectionTitleColor: '#eef5db',
          dayTextColor: '#eef5db', 
          todayTextColor: '#eef5db', 
          selectedDayTextColor: '#eef5db',
          monthTextColor: '#eef5db',
          arrowColor: '#eef5db', 
          textDisabledColor: '#455B5B',
          textMonthFontSize: 25,
        }}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {selected: true, selectedColor: '#7a9e9f', marked: true}
        }}
      />
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    color:"#fff"
  },
  calendar:{
    backgroundColor: '#151923',
    color:'#eef5db',
  },
})