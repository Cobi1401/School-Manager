//FILE CONFIG FIREBASE 
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import {getAuth,signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"
import {getFirestore,doc,getDoc,setDoc} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

const firebaseConfig = {
apiKey: "AIzaSyAgjuQ_mJSJb0QZCZpfOTNACVOXGpEOfqo",
authDomain: "mindx-bb092.firebaseapp.com",
databaseURL: "https://mindx-bb092-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "mindx-bb092",
storageBucket: "mindx-bb092.firebasestorage.app",
messagingSenderId: "305366342255",
appId: "1:305366342255:web:b8037ceb354110bd160b9a",
measurementId: "G-F00W3LCYJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
//console.log(app.name)
