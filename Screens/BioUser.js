import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { db } from "../Firebase/Config";
import { updateDoc, doc } from "firebase/firestore";
const BioUser = ({ navigation }) => {
  const [bio, setBio] = useState(null);
  const SendBio = async () => {
    const docRef = doc(db, "Users", "mTBG2nWjyteCRVlUNh21zRzY6P32");
    updateDoc(docRef, { bio: bio });
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.Header}>Write a Bio</Text>
      </View>
      <View style={styles.InputField}>
        <TextInput
          keyboardType={"default"}
          mode={"flat"}
          label="Bio"
          onChangeText={(bio) => setBio(bio)}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          backgroundColor="rgb(60, 179, 113)"
          mode={"contained"}
          onPress={() => navigation.navigate("BottomTabNavigator")}
        >
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default BioUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    padding: 20,
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
    margin: 10,
    padding: 4,
  },
  ButtonContainer: {
    marginLeft: 300,
    marginTop: 40,
    width: "30%",
  },
});
