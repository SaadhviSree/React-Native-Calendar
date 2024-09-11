import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const { width } = Dimensions.get('window')

export default function YearView({ navigation }) {
  const today = new Date()
  const currYear = today.getFullYear()
  const [year, setYear] = useState(currYear)

  const handleLeft = () => {
    setYear(year - 1)
  }

  const handleRight = () => {
    setYear(year + 1)
  }

  const renderMonths = () => {
    const months = [
      { month: 1, label: 'January' },
      { month: 2, label: 'February' },
      { month: 3, label: 'March' },
      { month: 4, label: 'April' },
      { month: 5, label: 'May' },
      { month: 6, label: 'June' },
      { month: 7, label: 'July' },
      { month: 8, label: 'August' },
      { month: 9, label: 'September' },
      { month: 10, label: 'October' },
      { month: 11, label: 'November' },
      { month: 12, label: 'December' },
    ]

    return months.map(({ month }) => (
      <View key={`${year}-${month}`} style={styles.monthContainer}>
        <ScrollView>
          <Calendar
            key={`${year}-${month}`} 
            style={styles.calendar}
            current={`${year}-${month.toString().padStart(2, '0')}-01`}
            renderArrow={()=>{}}
            hideExtraDays={false}
            showSixWeeks={true}
            onDayPress={(day) => {
              navigation.navigate('Calendar', { showMonth: day.dateString })
            }}
            theme={{
              backgroundColor: '#253239',
              calendarBackground: '#253239',
              textSectionTitleColor: '#eef5db',
              dayTextColor: '#eef5db',
              todayTextColor: '#eef5db',
              selectedDayTextColor: '#eef5db',
              monthTextColor: '#eef5db',
              arrowColor: '#eef5db',
              textDisabledColor: '#455B5B',
              textDayFontSize: 14,
              textMonthFontSize: 15,
              textDayHeaderFontSize: 13,
              textDisabledColor: "#151923"
            }}
            disableAllTouchEventsForDisabledDays={true}
            monthFormat='MMMM'
          />
        </ScrollView>
      </View>
    ))
  }

  return (
    <SafeAreaView style={styles.container} flexDirection={'column'} alignItems={'center'}>
      <View style={styles.title}>
        <TouchableOpacity onPress={handleLeft}>
          <FontAwesome6 style={styles.arrow} name={'chevron-left'} size={25} color={'#7a9e9f'} />
        </TouchableOpacity>
        <Text
          style={{
            top: -15,
            color: "#eef5db",
            fontWeight: 'bold',
            fontSize: 30,
            letterSpacing: 5,
          }}
        >{year}</Text>
        <TouchableOpacity onPress={handleRight}>
          <FontAwesome6 style={styles.arrow} name={'chevron-right'} size={25} color={'#7a9e9f'} />
        </TouchableOpacity>
      </View>
      <ScrollView height={100} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.monthsContainer}>
          {renderMonths()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151923',
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthContainer: {
    width: width / 2 - 5,
    height: 370,
    padding: 5,
  },
  calendar: {
    marginBottom: 10,
    borderRadius: 5
  },
  title: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  arrow: {
    top: -7,
  }
})