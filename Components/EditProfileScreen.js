import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { db } from "../Firebase/Config";
import React, { useEffect, useState } from "react";
import {
  Text,
  Divider,
  Avatar,
  Title,
  Caption,
  Button,
  TextInput,
} from "react-native-paper";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { doc, query, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRef } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";

const EditProfileScreen = () => {
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [image, setImage] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Information Technology", value: "Information Technology" },
    { label: "Management Sciences", value: "Management Science" },
    { label: "English", value: "English" },
  ]);
  const [userData, setUserData] = useState(null);
  const fetchUserData = async () => {
    const useDocRef = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = await getDoc(useDocRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.1,
    });

    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const SubmitData = async () => {
    let imgUrl = await UploadImage();

    if (imgUrl == null && userData.userImage) {
      imgUrl = userData.userImage;
    }

    const userDoc = doc(db, "Users", getAuth().currentUser.uid);

    const docData = {
      userName: userData.userName,
      userImage: imgUrl,
      city: userData.city,
      gender: userData.gender,
      department: userData.department,
      bio: userData.bio,
    };
    updateDoc(userDoc, docData);
  };
  const UploadImage = async () => {
    if (image == null) {
      return null;
    }

    const storage = getStorage();
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    const extension = filename.split(".").pop();
    const name = filename.split(".").slice(0, -1).join(".");
    filename = name + Date.now() + "." + extension;
    const img = await fetch(image);
    const bytes = await img.blob();
    setUploading(true);
    setTransferred(0);
    const storeref = ref(storage, `photos/${filename}`);
    const task = uploadBytesResumable(storeref, bytes);
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
      alert("Data uploaded scucessfully");

      return url;
    } catch (e) {
      alert(e);
      return null;
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View>
            <Text style={styles.Header}>Update your Profile</Text>
          </View>
          <Divider style={{ backgroundColor: "black", marginTop: 7 }} />
          <View style={styles.profilePic}>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={pickImage}>
                <Avatar.Image
                  source={{
                    uri: image
                      ? image
                      : userData
                      ? userData.userImage ||
                        " https://pic.onlinewebfonts.com/svg/img_264570.png"
                      : "https://pic.onlinewebfonts.com/svg/img_264570.png",
                  }}
                  size={100}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.InputField}>
              <TextInput
                keyboardType={"default"}
                mode={"flat"}
                label={"UserName"}
                value={userData ? userData.userName : ""}
                onChangeText={(txt) =>
                  setUserData({ ...userData, userName: txt })
                }
              />
            </View>
            <View style={styles.InputField}>
              <TextInput
                keyboardType={"default"}
                value={userData ? userData.bio : ""}
                mode={"flat"}
                label={"Bio"}
                onChangeText={(txt) => setUserData({ ...userData, bio: txt })}
              />
            </View>
            <View style={styles.InputField}>
              <TextInput
                keyboardType={"default"}
                mode={"flat"}
                label={"City"}
                value={userData ? userData.city : ""}
                onChangeText={(txt) => setUserData({ ...userData, city: txt })}
              />
            </View>
            <View style={styles.InputField}>
              <TextInput
                keyboardType={"default"}
                value={userData ? userData.gender : ""}
                mode={"flat"}
                label={"Gender"}
                onChangeText={(txt) =>
                  setUserData({ ...userData, gender: txt })
                }
              />
            </View>
            <View style={{ padding: 3 }}>
              <DropDownPicker
                open={open}
                value={userData ? userData.department : ""}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{ height: 40 }}
                onSelectItem={(item) =>
                  setUserData({ ...userData, department: item.value })
                }
              />
            </View>
          </View>
          <View style={{ marginTop: 30, margin: 5 }}>
            <Button
              color="rgb(60, 179, 113)"
              mode={"outlined"}
              onPress={SubmitData}
            >
              Update
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "black",
  },
  content: {
    justifyContent: "center",
  },
  Header: {
    fontSize: 20,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    margin: 20,
  },
  Text: {
    marginLeft: 30,
    fontSize: 15,
    marginTop: 10,
  },
  profilePic: {},
  userInfo: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  info: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  InputField: {
    width: "100%",
    justifyContent: "center",
    padding: 4,
  },
  ButtonContainer: {
    marginLeft: 300,
    marginTop: 40,
    width: "30%",
  },
  name: {
    fontWeight: "normal",
    fontSize: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  caption: {
    fontWeight: "normal",
  },
});
