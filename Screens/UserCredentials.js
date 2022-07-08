import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Text, Avatar } from "react-native-paper";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { db } from "../Firebase/Config";
import { getAuth } from "firebase/auth";
import { setDoc, doc, updateDoc, getDoc, addDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
const UserCredentials = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [image, setImage] = useState(null);

  const sendData = async () => {
    let imageUrl = await uploadImageToStorage();
    if (imageUrl === null) {
      imageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    const docRef = doc(db, "Users", getAuth().currentUser.uid);
    const data = {
      userName: userName,
      userImage: imageUrl,
      userId: getAuth().currentUser.uid,
      city: "",
      gender: "",
      department: "",
      bio: "",
    };
    setDoc(docRef, data);
    navigation.navigate("BottomTab");
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.2,
    });

    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImageToStorage = async () => {
    if (image === null) {
      return null;
    }
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const storage = getStorage();
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    filename = name + Date.now() + "." + extension;
    setUploading(true);
    setTransferred(0);
    const storeref = ref(storage, `photos/${filename}`);
    const task = uploadBytesResumable(storeref, blob);
    task.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
      );
    });
    try {
      await task;
      const url = await getDownloadURL(storeref);
      setUploading(false);
      setImage(null);
      alert("Profile Photo uploaded scucessfully");

      return url;
    } catch (e) {
      alert(e);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container2}>
          <View style={{ marginTop: 40 }}>
            <Text style={styles.Header}>
              Provide a User Name and Profile Picture
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={pickImage}>
                <Avatar.Image
                  source={{
                    uri: image
                      ? image
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  }}
                  size={120}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.InputField}>
              <TextInput
                keyboardType={"default"}
                mode={"contained"}
                label="User Name"
                onChangeText={(userName) => setUserName(userName)}
                style={{
                  borderRadius: 3,
                  borderColor: "black",
                  borderWidth: 1,
                }}
                theme={{
                  colors: {
                    primary: "tomato",
                    underlineColor: "blue",
                  },
                }}
              />
            </View>
          </View>

          <View style={styles.ButtonContainer}>
            <Button
              style={{ backgroundColor: "tomato", color: "black" }}
              mode={"contained"}
              onPress={sendData}
            >
              Proceed
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  container2: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  Header: {
    marginTop: 40,
    fontSize: 18,
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
  userInfo: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  ButtonContainer: {
    marginLeft: 230,
    marginTop: 6,
    width: "60%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserCredentials;
