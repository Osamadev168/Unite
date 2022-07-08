import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  SignedInStack,
  UnsignedInStack,
} from "../Navigation/NavigationContainer";
const AuthNavigation = () => {
  const [currentUser, settCurrentUser] = useState(null);

  const userHandler = (user) =>
    user ? settCurrentUser(user) : settCurrentUser(null);

  useEffect(() => {
    return getAuth().onAuthStateChanged((user) => userHandler(user));
  });
  return <>{currentUser ? <SignedInStack /> : <UnsignedInStack />}</>;
};

export default AuthNavigation;

const styles = StyleSheet.create({});
