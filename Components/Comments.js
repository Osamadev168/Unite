import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { db } from "../Firebase/Config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { TextInput, Button } from "react-native-paper";
import { getAuth } from "firebase/auth";

const Comments = ({ navigate, route }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [post, setpostId] = useState("");
  const [userdata, setuserData] = useState("");
  const handleComment = async () => {
    const docRef = collection(db, "Posts", route.params.postID, "Comments");
    addDoc(docRef, {
      Owner: userdata.userName,
      Comment: text,
    });
  };
  const fetchUserData = async () => {
    const docRef = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setuserData(docSnap.data());
    }
  };
  const fetchComments = async () => {
    const DocRef = collection(db, "Posts", route.params.postID, "Comments");
    const q = query(DocRef);
    onSnapshot(q, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        doc.data();
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setComments(comments);
    });
  };
  useEffect(() => {
    fetchComments();
    fetchUserData();
  }, [route.params.postID]);
  return (
    <View style={{ justifyContent: "center" }}>
      <FlatList
        style={{ marginTop: 100 }}
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.container}>
              <Text style={{ fontWeight: "bold", color: "tomato" }}>
                {item.Owner} Says
              </Text>
              <Text> {item.Comment}</Text>
            </View>
          );
        }}
      />
      <Text>{comments.Owner}</Text>
      <View style={styles.InputField}>
        <TextInput
          keyboardType={"default"}
          mode={"flat"}
          label="Comment"
          onChangeText={(text) => setText(text)}
        />
      </View>
      <View style={styles.ButtonContainer}>
        <Button
          backgroundColor="rgb(60, 179, 113)"
          mode={"contained"}
          onPress={handleComment}
          theme={{
            colors: {
              primary: "tomato",
              underlineColor: "blue",
            },
          }}
        >
          Comment
        </Button>
      </View>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
  },
  InputField: {
    width: "100%",
    justifyContent: "center",
  },
  ButtonContainer: {
    marginLeft: 260,
    marginTop: 30,
    width: "30%",
  },
});
