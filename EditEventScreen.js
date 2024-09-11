import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Alert } from "react-native";
import { Switch } from "react-native-switch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { database } from './firebase' ;
import { ref, set } from "firebase/database";
import { DateRangeValidation, DateValidation, TimeValidation, TimeRangeValidation } from "./Validations";

export default function EditEventScreen({route, navigation}){
  const { id } = route.params.event
  const { type } = route.params
  const date = ''
  const toggleVal = (type==="Single") ? true : false

  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

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

  const handleTimeChange = (time, setTime, Time) => {
    if (time.length === 2) {
      if (time.length > Time.length) time += ':'
    }
    if (time.length >= 5) {
      console.log(time.slice(0,10))
      setTime(time.slice(0,10))
    }
    setTime(time)
  }

  if (toggleVal===true){
    const single = id
    const [title,setTitle] = useState(route.params.event.event_name)
    const [description,setDescription] = useState(route.params.event.event_description)
    const [isEnabled, setIsEnabled] = useState(toggleVal)

    const [fromTime, setFromTime] = useState(route.params.event.event_from)
    const [toTime, setToTime] = useState(route.params.event.event_to)
    const [onDate, setOnDate] = useState(route.params.event.event_date)

    const updateEventSingle = async (eventId, updatedEventData) => {
      try {
        const eventRef = ref(database, `/singleDayEvents/${eventId}`)
        await set(eventRef, updatedEventData)
        Alert.alert("Changes Saved!!")
        navigation.goBack()
      } catch (error) {
        console.error("Error updating event: ", error)
        Alert.alert("Error", "Could not update event. Please try again.")
      }
    }

    const handleEditSingle = (eventId) => {
      const isOnValid = DateValidation(onDate)
      const isTimeValid = TimeValidation(fromTime) && TimeValidation(toTime) && TimeRangeValidation(fromTime, toTime)
      console.log(isOnValid, isTimeValid, title, onDate, description, fromTime, toTime)
      if (title!='' && isOnValid && isTimeValid){
        const updatedEventData = {
          event_name: title,
          event_date: onDate,
          event_description: description,
          event_from: fromTime,
          event_to: toTime
        }
        updateEventSingle(eventId, updatedEventData)
      }
      else Alert.alert("Error","Check values!")
      navigation.goBack()
    }

    const onChangeOnDate = (data) => handleDateChange(data, setOnDate, onDate)
    const onChangeFromTime = (time) => handleTimeChange(time, setFromTime, fromTime)
    const onChangeToTime = (time) => handleTimeChange(time,setToTime, toTime)
    console.log(id)
    
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
            marginRight: 10
          }}>
  
            <Text 
              style={{color: '#838976'}} 
              bottom={1} 
              right={15}>
                Multi-Day-Event
            </Text>
  
            <Switch
              trackColor={{false: '#767577', true: '#767577'}}
              thumbColor={'#7a9e9f'}
              onValueChange={toggleSwitch}
              value={isEnabled}
              disabled={true}
              activeText={''}
              inActiveText={''}
              circleSize={20}
              barHeight={20}
              circleBorderWidth={1}
              backgroundActive={'#76757780'}
              backgroundInactive={'#76757780'}
              circleBorderActiveColor={"#767577"}
              circleBorderInactiveColor={"#767577"}
              circleActiveColor={'#838976'}
              circleInActiveColor={'#838976'}
              style={styles.switch}
            />
  
            <Text 
              style={{ color: '#eef5db'}} 
              bottom={1} 
              left={15}>
                One-Day-Event
            </Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent:'space-evenly'
        }}> 
        <Text 
          style={{
            color:'#eef5db', 
            right:54
          }} >On:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            left: 8
          }} >From:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:1
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginBottom:25,
          marginTop:5,
          justifyContent:'space-evenly'
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
  
        <TouchableOpacity onPress={()=>handleEditSingle(single)} style={styles.button}>
          <Text style={styles.text1}>Save Changes</Text>
        </TouchableOpacity>
      
      </SafeAreaView>
    )
  }
  else{
    const multi = id
    const [title,setTitle] = useState(route.params.event.event_name)
    const [description,setDescription] = useState(route.params.event.event_description)
    const [isEnabled, setIsEnabled] = useState(toggleVal)

    const [fromDate, setFromDate] = useState(route.params.event.event_from)
    const [toDate, setToDate] = useState(route.params.event.event_to)

    const updateEventMulti = async (eventId, updatedEventData) => {
      try {
        const eventRef = ref(database, `/multiDayEvents/${eventId}`)
        await set(eventRef, updatedEventData)
        Alert.alert("Changes Saved!!")
        navigation.goBack()
      } catch (error) {
        console.error("Error updating event: ", error)
        Alert.alert("Error", "Could not update event. Please try again.")
      }
    }

    const handleEditMulti = (eventId) => {
      const isDateValid = DateValidation(fromDate) && DateValidation(toDate) && DateRangeValidation(fromDate, toDate)
      console.log(isDateValid, title, description, fromDate, toDate)
      if (title!='' && isDateValid){
        const updatedEventData={
          event_name: title,
          event_description: description,
          event_from: fromDate,
          event_to: toDate
        }
        updateEventMulti(eventId,updatedEventData)
      }
      else Alert.alert("Error","Check values!")
      navigation.goBack()
    }

    const onChangeFromDate = (data) => handleDateChange(data, setFromDate, fromDate)
    const onChangeToDate = (data) => handleDateChange(data, setToDate, toDate)

    
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
            marginRight: 10
          }}>

            <Text 
              style={{ color: '#eef5db' }} 
              bottom={1} 
              right={15}>
                Multi-Day-Event
            </Text>

            <Switch
              trackColor={{false: '#767577', true: '#767577'}}
              thumbColor={'#7a9e9f'}
              onValueChange={toggleSwitch}
              value={isEnabled}
              disabled={true}
              activeText={''}
              inActiveText={''}
              circleSize={20}
              barHeight={20}
              circleBorderWidth={1}
              backgroundActive={'#76757780'}
              backgroundInactive={'#76757780'}
              circleBorderActiveColor={"#767577"}
              circleBorderInactiveColor={"#767577"}
              circleActiveColor={'#838976'}
              circleInActiveColor={'#838976'}
              style={styles.switch}
            />

            <Text 
              style={{color: '#838976'}} 
              bottom={1} 
              left={15}>
                One-Day-Event
            </Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent:'space-evenly'
        }}> 
        <Text 
          style={{
            color:'#eef5db',
            right:85
        }} >From:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:50
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop:5,
          marginBottom:25,
          justifyContent:'space-evenly'
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
          />
        </View>

        <TouchableOpacity onPress={()=>handleEditMulti(multi)} style={styles.button}>
          <Text style={styles.text1}>Save Changes</Text>
        </TouchableOpacity>
      
      </SafeAreaView>
    )
  }
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
    //backgroundColor: 'rgba(79, 99, 103, 0.5)',
    borderRadius:2,
    color:'#eef5db',
    fontWeight:'bold'
  },
  inputDesc: {
    height: 40,
    width: '100%',
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    //backgroundColor: 'rgba(79, 99, 103, 0.5)',
    borderRadius:2,
    color:'#eef5db'
  },
  inputDate:{
    height: 40,
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    //backgroundColor: 'rgba(79, 99, 103, 0.5)',
    borderRadius:2,
    color:'#eef5db',
  },
  inputTime:{
    height: 40,
    borderColor: '#7a9e9f',
    borderWidth: 1,
    padding:10,
    backgroundColor:'#4f636766',
    //backgroundColor: 'rgba(79, 99, 103, 0.5)',
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
  },
  text1: {
    color:'#151923'
  },
  switch: {
    right:10,
    left:10
  },
})