import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBw6L2ybgIDlXOYALoKpbs3uI7mEJCQn9A",
  authDomain: "unite-92388.firebaseapp.com",
  databaseURL: "https://unite-92388-default-rtdb.firebaseio.com",
  projectId: "unite-92388",
  storageBucket: "unite-92388.appspot.com",
  messagingSenderId: "404056097347",
  appId: "1:404056097347:web:aaf7b97ffb897506af8af6",
  measurementId: "G-JEN34PCMZ7",
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
