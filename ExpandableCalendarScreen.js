import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CalendarList, CalendarProvider } from 'react-native-calendars';

const ExpandableCalendar = ({
  initialPosition = 'closed',
  onCalendarToggled,
  disablePan,
  hideKnob,
  leftArrowImageSource,
  rightArrowImageSource,
  allowShadow,
  disableWeekScroll,
  openThreshold,
  closeThreshold,
  closeOnDayPress,
}) => {
  const [isOpen, setIsOpen] = useState(initialPosition === 'open');

  const handleToggleCalendar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onCalendarToggled) {
      onCalendarToggled(newState);
    }
  };

  return (
    <CalendarProvider>
      <View style={[styles.calendarContainer, allowShadow && styles.shadow]}>
        <TouchableOpacity
          onPress={handleToggleCalendar}
          style={[styles.header, isOpen && styles.headerOpen]}
        >
          {!hideKnob && <View style={styles.knob} />}
          <Text style={styles.headerText}>{isOpen ? 'Close Calendar' : 'Open Calendar'}</Text>
          {isOpen ? (
            <Image source={leftArrowImageSource} style={styles.arrowImage} />
          ) : (
            <Image source={rightArrowImageSource} style={styles.arrowImage} />
          )}
        </TouchableOpacity>
        {isOpen && (
          <CalendarList
            disableWeekScroll={disableWeekScroll}
            onDayPress={(day) => closeOnDayPress && setIsOpen(false)}
            // Other CalendarList props can be passed here
          />
        )}
      </View>
    </CalendarProvider>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerOpen: {
    borderBottomWidth: 0,
  },
  knob: {
    width: 10,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  arrowImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default ExpandableCalendar;
