import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { db } from "../Firebase/Config";
import {
  setDoc,
  doc,
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  getDocs,
  Timestamp,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [userdata, setuserData] = useState("");
  const getUserdata = async () => {
    const docRef = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setuserData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getUserdata();
  }, []);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
      compres: 0.5,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const SubmitPost = async () => {
    let imgUrl = await UploadImage();

    if (imgUrl == null) {
      imgUrl = null;
    }
    const userData = collection(db, "Posts");

    const docData = {
      userID: getAuth().currentUser.uid,
      ImageUrl: imgUrl,
      postText: post,
      userName: userdata.userName,
      userImage: userdata.userImage,
      createdat: Timestamp.fromDate(new Date()),
      LikesCount: [],
      userImage: userdata.userImage,
      city: userdata.city,
      gender: userdata.gender,
      department: userdata.department,
      bio: userdata.bio,
    };
    addDoc(userData, docData);
    alert("post uploaded scucessfully");
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

      return url;
    } catch (e) {
      alert(e);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ alignItems: "center" }}>
          <View style={{ justifyContent: "center" }}>
            <Text style={{ color: "#246EE9", fontSize: 30, marginTop: 40 }}>
              Make a Post
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri: image
                    ? image
                    : "https://dominionmartialarts.com/wp-content/uploads/2017/04/default-image.jpg",
                }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              mode={"flat"}
              label="Say something"
              onChangeText={(post) => setPost(post)}
              multiline={true}
              theme={{
                colors: { primary: "#246EE9", underlineColor: "blue" },
              }}
            />
          </View>
          <View style={styles.ButtonContainer}>
            <Button
              mode={"contained"}
              style={{ borderRadius: 50 }}
              onPress={SubmitPost}
              theme={{
                colors: {
                  primary: "#246EE9",
                  underlineColor: "blue",
                },
              }}
            >
              Post
            </Button>
            <View style={{ marginTop: 3 }}>
              {uploading ? (
                <View>
                  <Text style={{ color: "black" }}>
                    {transferred} % Completed!
                  </Text>
                  <ActivityIndicator
                    size="large"
                    color="red"
                    animating={true}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 360,
    height: 300,
    borderRadius: 50,
    padding: 10,
    margin: 10,
  },
  textInput: {
    width: 350,
    height: 100,
    backgroundColor: "lightgrey",
    margin: 10,
    color: "white",
    fontSize: 20,
    borderColor: "tomato",
  },
  ButtonContainer: {
    marginTop: 10,
    width: 100,
    height: 100,
  },
});
