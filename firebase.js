import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, child } from 'firebase/database'

const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "AUTH DOMAIN LINK",
  databaseURL:"DATABASE URL",
  projectId: "PROJECT ID",
  storageBucket: "STORAGE BUCKET LINK",
  messagingSenderId: "MESSAGING SENDER ID",
  appId: "APP ID"
}

const app = initializeApp(firebaseConfig)

const database = getDatabase(app)

export { app, database, ref, get, child }
