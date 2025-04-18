import { initializeApp } from "firebase/app"
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyA3t-X0jGdRQvTmyyx4kzEVpUfrxV5z5Co",
    authDomain: "vinahome-ce6b5.firebaseapp.com",
    databaseURL: "https://vinahome-ce6b5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vinahome-ce6b5",
    storageBucket: "vinahome-ce6b5.firebasestorage.app",
    messagingSenderId: "654103809888",
    appId: "1:654103809888:web:d1cb0dfa2a63ce098c9805",
    measurementId: "G-30MEN47XDE"
};
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database }