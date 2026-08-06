// Firebase Configuration
// Replace these values with your Firebase project credentials
// Go to: Firebase Console > Project Settings > General > Your apps > Firebase SDK snippet

const firebaseConfig = {
  apiKey: "AIzaSyBMj89suTAc8VJ2txC0PPRZ3GM1gpKFNZM",
  authDomain: "movequest-9a4de.firebaseapp.com",
  projectId: "movequest-9a4de",
  storageBucket: "movequest-9a4de.firebasestorage.app",
  messagingSenderId: "600782167052",
  appId: "1:600782167052:web:92599329212de19300e229",
  measurementId: "G-8Z8LF60YQ0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Auth
const auth = firebase.auth();
const db = firebase.firestore();
