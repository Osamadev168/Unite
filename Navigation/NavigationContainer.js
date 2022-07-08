import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// screens//
import Signupscreen from "../Screens/SignupScreen";
import UserCredentials from "../Screens/UserCredentials";
import BioUser from "../Screens/BioUser";
import BottomTabNavigator from "./BottomTabNavigator";
import NavProfile from "../Components/NavProfile";
import EditProfileScreen from "../Components/EditProfileScreen";
import Comments from "../Components/Comments";
export const SignedInStack = ({ navigation }) => {
  const Stack = createStackNavigator();

  const [userData, setUserData] = useState("");
  const CheckUser = async () => {
    const userDoc = doc(getFirestore(), "Users", getAuth().currentUser.uid);
    const user = await getDoc(userDoc);
    if (user.exists()) {
      const userData = user.data();
      setUserData(userData);
    }
  };
  useEffect(() => {
    CheckUser();
  });
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userData ? (
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          />
        ) : (
          <Stack.Screen name="UserCreds" component={UserCredentials} />
        )}
        <Stack.Screen name="NavProfile" component={NavProfile} />
        <Stack.Screen name="Comment" component={Comments} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export const UnsignedInStack = ({ navigation }) => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Signupscreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignUp" component={Signupscreen} />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const NavigationComponent = ({ navigation }) => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Signupscreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignUp" component={Signupscreen} />
        <Stack.Screen name="UserCreds" component={UserCredentials} />
        <Stack.Screen name="Bio" component={BioUser} />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationComponent;

const styles = StyleSheet.create({});
