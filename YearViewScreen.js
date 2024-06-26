/*import React from 'react'
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

export default function YearView() {
  const renderMonth = (month) => {
    const monthString = month.toString().padStart(2, '0')
    const date = `2024-${monthString}-01`

    return (
      <View key={month} style={styles.monthContainer}>
        <Calendar
          current={date}
          hideExtraDays
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
          }}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(renderMonth)}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151923',
  },
  monthContainer: {
    width,
    marginBottom: 10,
  },
})*/
import React from 'react'
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

export default function YearView() {
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
      <View key={month} style={styles.monthContainer}>
        <ScrollView>
          <Calendar
            style={styles.calendar}
            current={`2024-${month.toString().padStart(2, '0')}-01`}
            renderArrow={() => {}}
            hideExtraDays={true}
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
              textDayFontSize: 14,
              textMonthFontSize: 15,
              textDayHeaderFontSize: 13,
            }}
          />
        </ScrollView>
      </View>
    ))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
    paddingHorizontal: 10,
  },
  monthContainer: {
    width: width / 2 - 15, // Adjust width for two months per row with spacing
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 10,
  },
})
