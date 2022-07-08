import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCredential,
  PhoneAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from "../Firebase/Config";
import {
  getDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  getDocs,
} from "firebase/firestore";
// PROVIDE VALID FIREBASE >=9.x.x CONFIG HERE
// https://firebase.google.com/docs/web/setup
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBw6L2ybgIDlXOYALoKpbs3uI7mEJCQn9A",
  authDomain: "unite-92388.firebaseapp.com",
  databaseURL: "https://unite-92388-default-rtdb.firebaseio.com",
  projectId: "unite-92388",
  storageBucket: "unite-92388.appspot.com",
  messagingSenderId: "404056097347",
  appId: "1:404056097347:web:aaf7b97ffb897506af8af6",
  measurementId: "G-JEN34PCMZ7",
};

try {
  if (FIREBASE_CONFIG.apiKey) {
    initializeApp(FIREBASE_CONFIG);
  }
} catch (err) {
  // ignore app already initialized error on snack
}

// Firebase references
const auth = getAuth();
import { TextInput, Button } from "react-native-paper";
export default function SignUpscreen({ navigation }) {
  const recaptchaVerifier = React.useRef(null);
  const verificationCodeTextInput = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [verificationId, setVerificationId] = React.useState("");
  const [verifyError, setVerifyError] = React.useState();
  const [verifyInProgress, setVerifyInProgress] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);
  const [phoneNumbers, setPhoneNumbers] = React.useState([]);
  const [phoneNumbers1, setPhoneNumbers2] = React.useState(true);

  const FetchPhoneNumbers = async () => {
    const docRef = doc(getFirestore(), "PhoneNumbers", "PhoneNumbersDoc");
    const docer = await getDoc(docRef);
    if (docer.exists()) {
      const docData = docer.data();
      setPhoneNumbers(docData);
    }
  };
  useEffect(() => {
    FetchPhoneNumbers();
  }, []);
  const SendOTP = async () => {
    const phoneProvider = new PhoneAuthProvider(auth);
    // if (phoneNumbers.numbers.includes(phoneNumber)) {
    setPhoneNumbers2(true);
    try {
      setVerifyError(undefined);
      setVerifyInProgress(true);
      setVerificationId("");
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerifyInProgress(false);
      setVerificationId(verificationId);
      verificationCodeTextInput.current?.focus();
    } catch (err) {
      setVerifyError(err);
      setVerifyInProgress(false);
    }
    // } else {
    //   setPhoneNumbers2(false);
    // }
  };
  const ConfirmOTP = async () => {
    try {
      setConfirmError(undefined);
      setConfirmInProgress(true);
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const authResult = await signInWithCredential(auth, credential);
      setConfirmInProgress(false);
      setVerificationId("");
      setVerificationCode("");
      verificationCodeTextInput.current?.clear();
      const userDoc = doc(getFirestore(), "Users", getAuth().currentUser.uid);
      const user = await getDoc(userDoc);
      if (user.exists()) {
        navigation.navigate("BottomTabNavigator");
      } else {
        navigation.navigate("UerCreds");
      }
    } catch (err) {
      setConfirmError(err);
      setConfirmInProgress(false);
      alert("bsdk " + err);
    }
  };
  return (
    <View style={styles.container}>
      <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={FIREBASE_CONFIG}
      />
      <View style={{ marginTop: 40 }}>
        <Text style={styles.Header}>Welcome to Unite</Text>
        <Text style={styles.Header}>Make your Account</Text>
      </View>
      <View style={styles.InputField}>
        <TextInput
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          theme={{
            colors: {
              primary: "tomato",
              underlineColor: "blue",
            },
          }}
          keyboardType={"phone-pad"}
          mode={"flat"}
          label="Phone Number"
        />
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          title={"Send"}
          backgroundColor="rgb(60, 179, 113)"
          onPress={SendOTP}
          mode={"contained"}
          style={{ backgroundColor: "tomato" }}
        >
          Send
        </Button>
      </View>
      <View style={styles.InputField}>
        <TextInput
          onChangeText={(verificationCode) =>
            setVerificationCode(verificationCode)
          }
          keyboardType={"phone-pad"}
          label="OTP"
          mode={"flat"}
          ref={verificationCodeTextInput}
          theme={{
            colors: {
              primary: "tomato",
              underlineColor: "blue",
            },
          }}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          backgroundColor="rgb(60, 179, 113)"
          onPress={ConfirmOTP}
          mode={"contained"}
          style={{ backgroundColor: "tomato" }}
        >
          Confirm
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  Header: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  InputField: {
    width: "100%",
    margin: 10,
    justifyContent: "center",
  },
  ButtonContainer: {
    marginLeft: 280,
    marginTop: 10,
    width: "30%",
  },
});
