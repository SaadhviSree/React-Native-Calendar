import React, { useState } from "react"
import { StyleSheet, View, Text, TextInput, Alert } from "react-native"
import { Switch } from "react-native-switch"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import firebase from "./firebase"
import { database } from './firebase' 
import { ref, push } from "firebase/database"

//const multiDayEventsRef = firebase.database().ref('/multiDayEvents')

export default function AddEventScreen({route, navigation}){
  const { date } = route.params
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [isEnabled, setIsEnabled] = useState(true)
  const [fromTime, setFromTime] = useState('00:00')
  const [onDate, setOnDate] = useState(date)
  const [toTime, setToTime] = useState('23:59')
  const [fromDate, setFromDate] = useState(date)
  const [toDate, setToDate] = useState('')
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  const handleSaveSingle = () => {
    const singleDayEventsRef = ref(database, '/singleDayEvents')
    Alert.alert("Event Saved!")
    console.log(title, onDate, description, fromTime, toTime)
    push(singleDayEventsRef,{
      event_name: title,
      event_date: onDate,
      event_description: description,
      event_from: fromTime,
      event_to: toTime
    })
    navigation.goBack()
  }

  const handleSaveMulti = () => {
    const multiDayEventsRef = ref(database, '/multiDayEvents')
    Alert.alert("Event Saved!")
    console.log(title, description, fromDate, toDate)
    push(multiDayEventsRef,{
      event_name: title,
      event_description: description,
      event_from: fromDate,
      event_to: toDate
    })
    navigation.goBack()
  }

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
          justifyContent:'space-evenly'
        }}> 
        <Text 
          style={{
            color:'#eef5db', 
            right:53
          }} >On:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:30
         }} >From:</Text>
        <Text 
          style={{
            color:'#eef5db', 
            right:22
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop:5,
          justifyContent:'space-evenly'
        }}> 
          <TextInput
            style={styles.inputDateDisabled}
            defaultValue={date}
            value={date}
            placeholderTextColor={'#4f6367'}
            width={'25%'}
            editable={false}
          />
          <TextInput
            style={styles.inputTime}
            defaultValue={fromTime}
            onChangeText={setFromTime}
            value={fromTime}
            placeholderTextColor={'#4f6367'}
            width={'25%'}
          />
          <TextInput
            style={styles.inputTime}
            defaultValue={toTime}
            onChangeText={setToTime}
            value={toTime}
            placeholderTextColor={'#4f6367'}
            width={'25%'}
          />
        </View>
        </>
      ):(
        <>
        <View style={{
          flexDirection: 'row',
          marginTop: 15,
          justifyContent:'space-evenly'
        }}> 
        <Text 
          style={{
            color:'#838976', 
            right:85
         }} >From:</Text>
        <Text 
          style={{
            color:'#838976', 
            right:50
          }} >To:</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
          marginTop:5,
          justifyContent:'space-evenly'
        }}> 
          <TextInput
            style={styles.inputTime}
            defaultValue={fromDate}
            onChangeText={setFromDate}
            value={fromDate}
            placeholderTextColor={'#4f6367'}
            width={'40%'}
          />
          <TextInput
            style={styles.inputTime}
            onChangeText={setToDate}
            placeholder={"YYYY-MM-DD"}
            placeholderTextColor={'#4f6367'}
            width={'40%'}
          />
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
    marginTop:25,
  },
  text1: {
    color:'#151923'
  },
  switch: {
    right:10,
    left:10
  },
})