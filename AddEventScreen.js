import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Alert } from "react-native";
import { Switch } from "react-native-switch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';

import { database } from './firebase';
import { ref, push } from "firebase/database";
import { DateRangeValidation, DateValidation, TimeRangeValidation, TimeValidation } from "./Validations";

export default function AddEventScreen({route, navigation}){
  const { date } = route.params
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [isEnabled, setIsEnabled] = useState(true)
  const [fromTime, setFromTime] = useState('00.00')
  const [onDate, setOnDate] = useState(date)
  const [toTime, setToTime] = useState('23.59')
  const [fromDate, setFromDate] = useState(date)
  const [toDate, setToDate] = useState('')
  const [category, setCategory] = useState('')
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  const handleSaveSingle = () => {
    const singleDayEventsRef = ref(database, '/singleDayEvents')
    const isOnValid = DateValidation(onDate)
    const isTimeValid = TimeValidation(fromTime) && TimeValidation(toTime) && TimeRangeValidation(fromTime, toTime)
    console.log(title, onDate, description, fromTime, toTime, category)
    if (title!='' && isOnValid && isTimeValid && category!=''){
      push(singleDayEventsRef,{
        event_name: title,
        event_date: onDate,
        event_description: description,
        event_from: fromTime,
        event_to: toTime,
        category: category
      })
      Alert.alert("Event Saved!")
    }
    else Alert.alert("Error","Check values!")
    navigation.goBack()
  }

  const handleSaveMulti = () => {
    const multiDayEventsRef = ref(database, '/multiDayEvents')
    const isDateValid = DateValidation(fromDate) && DateValidation(toDate) && DateRangeValidation(fromDate, toDate)
    console.log(title, description, fromDate, toDate)
    if (title!='' && isDateValid && category!=''){
      push(multiDayEventsRef,{
        event_name: title,
        event_description: description,
        event_from: fromDate,
        event_to: toDate,
        category: category
      })
      Alert.alert("Event Saved!")
    }
    else Alert.alert("Error","Check values!")
    navigation.goBack()
  }

  const handleDateChange = (data, setDate, Date) => {
    if (data.length === 4 || data.length === 7) {
      if (data.length > Date.length) data += '-'
    }
    if (data.length >= 10) {
      console.log(data.slice(0,10))
      setDate(data.slice(0,10))
    }
    setDate(data)
  }

  const onChangeFromDate = (data) => handleDateChange(data, setFromDate, fromDate)
  const onChangeToDate = (data) => handleDateChange(data, setToDate, toDate)
  const onChangeOnDate = (data) => handleDateChange(data, setOnDate, onDate)

  const handleTimeChange = (time, setTime, Time) => {
    if (time.length === 2) {
      if (time.length > Time.length) time += '.'
    }
    if (time.length >= 5) {
      console.log(time.slice(0,10))
      setTime(time.slice(0,10))
    }
    setTime(time)
  }

  const onChangeFromTime = (time) => handleTimeChange(time, setFromTime, fromTime)
  const onChangeToTime = (time) => handleTimeChange(time,setToTime, toTime)

  return(
    <SafeAreaView style={styles.container}> 
    
      <View width={'90%'} style={{
        alignSelf: 'center'
        }}>

        <TextInput
          style={styles.inputTitle}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text.toUpperCase())}
          placeholderTextColor={'#4f6367'}
        />

        <TextInput
          style={styles.inputDesc}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={'#4f6367'}
          marginTop={25}
          multiline={true}
          height={120}
          textAlignVertical="top"
        />

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop: 20,
          marginRight: 10,
        }}>

          <Text 
            style={{
              color: isEnabled ? '#838976' : '#eef5db', 
            }} 
            bottom={1} 
            right={15}>
              Multi-Day-Event
          </Text>

          <Switch
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={'#7a9e9f'}
            onValueChange={toggleSwitch}
            value={isEnabled}
            disabled={false}
            activeText={''}
            inActiveText={''}
            circleSize={20}
            barHeight={20}
            circleBorderWidth={1}
            backgroundActive={'#76757780'}
            backgroundInactive={'#76757780'}
            circleBorderActiveColor={"#767577"}
            circleBorderInactiveColor={"#767577"}
            circleActiveColor={'#7a9e9f'}
            circleInActiveColor={'#7a9e9f'}
            style={styles.switch}
          />

          <Text 
            style={{
              color: isEnabled ? '#eef5db' : '#838976', 
            }} 
            bottom={1} 
            left={15}>
              One-Day-Event
          </Text>
        </View>
      </View>

      {isEnabled ? (
        <>
        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent:'space-evenly',
        }}> 
        <Text 
          style={{
            color:'#eef5db', 
            right:53,
          }} >On:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:30,
         }} >From:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:22,
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginBottom:25,
          marginTop:5,
          justifyContent:'space-evenly',
        }}> 
          <TextInput
            style={(date==='')?styles.inputDate:styles.inputDateDisabled}
            defaultValue={(date==='')?null:date}
            maxLength={10}
            placeholder={"YYYY-MM-DD"}
            placeholderTextColor={'#4f6367'}
            onChangeText={onChangeOnDate}
            value={onDate}
            width={'35%'}
            editable={(date==='')?true:false}
            keyboardType={"numeric"}
          />
          <TextInput
            style={styles.inputTime}
            defaultValue={fromTime}
            onChangeText={onChangeFromTime}
            value={fromTime}
            placeholder={"HH.MM"}
            placeholderTextColor={'#4f6367'}
            width={'20%'}
            keyboardType={"numeric"}
            maxLength={5}
          />
          <TextInput
            style={styles.inputTime}
            defaultValue={toTime}
            onChangeText={onChangeToTime}
            value={toTime}
            placeholder={"HH.MM"}
            placeholderTextColor={'#4f6367'}
            width={'20%'}
            keyboardType={"numeric"}
            maxLength={5}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Value" value="" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
          </Picker>
        </View>
        </>
      ):(
        <>
        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent:'space-evenly',
        }}> 
        <Text 
          style={{
            color:'#eef5db', 
            right:85,
         }} >From:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:50,
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop:5,
          justifyContent:'space-evenly',
        }}> 
          <TextInput
            style={(date==='')?styles.inputTime:styles.inputDateDisabled}
            defaultValue={(date==='')?null:date}
            placeholder={"YYYY-MM-DD"}
            onChangeText={onChangeFromDate}
            value={fromDate}
            maxLength={10}
            placeholderTextColor={'#4f6367'}
            width={'40%'}
            keyboardType={"numeric"}
            editable={(date==='')?true:false}
            marginBottom={25}
          />
          <TextInput
            style={styles.inputTime}
            defaultValue={(date==='')?null:date}
            placeholder={"YYYY-MM-DD"}
            onChangeText={onChangeToDate}
            value={toDate}
            maxLength={10}
            placeholderTextColor={'#4f6367'}
            width={'40%'}
            keyboardType={"numeric"}
            marginBottom={25}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Value" value="" />
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
          </Picker>
        </View>
        </>)}

      <TouchableOpacity onPress={isEnabled ? handleSaveSingle : handleSaveMulti} style={styles.button}>
        <Text style={styles.text1}>Save Event</Text>
      </TouchableOpacity>
    
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151923",
    color:"#fff",
  },
  inputTitle: {
    height: 40,
    width: '100%',
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    borderRadius:2,
    color:'#eef5db',
    fontWeight:'bold',
  },
  inputDesc: {
    height: 40,
    width: '100%',
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    borderRadius:2,
    color:'#eef5db',
  },
  inputDate:{
    height: 40,
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    borderRadius:2,
    color:'#eef5db',
  },
  inputTime:{
    height: 40,
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    borderRadius:2,
    color:'#eef5db',
  },
  inputDateDisabled:{
    height: 40,
    borderColor: '#767577',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#36404266',
    borderRadius:2,
    color:'#838976',
  },
  button:{
    backgroundColor:'#7a9e9f',
    height: 40,
    width: 200,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent:'center',
    alignSelf: 'center',
    marginTop:25,
  },
  text1: {
    color:'#151923'
  },
  switch: {
    right:10,
    left:10
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
})