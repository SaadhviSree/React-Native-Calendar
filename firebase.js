import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, child } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDKzO1pAQ7P0DsZWmMpreZ7UrAyi1VgYV4",
  authDomain: "mycalendar-tringapps.firebaseapp.com",
  databaseURL:"https://mycalendar-tringapps-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "mycalendar-tringapps",
  storageBucket: "mycalendar-tringapps.appspot.com",
  messagingSenderId: "654880458142",
  appId: "1:654880458142:web:7c667ae4c715487f98428f"
}

const app = initializeApp(firebaseConfig)

const database = getDatabase(app)

export { app, database, ref, get, child }