import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { db } from "../Firebase/Config";
import React, { useEffect, useState } from "react";
import { Text, Divider, Avatar, Title, Button } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialIcons";
import {
  doc,
  query,
  getDoc,
  collection,
  getFirestore,
  getDocs,
  onSnapshot,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";

const Profile = ({ navigation, route, item }) => {
  const [post, setPosts] = useState([]);

  const logOut = () => {
    getAuth().signOut();
  };
  const fetchPosts = async () => {
    try {
      const list = [];

      const docRef = collection(getFirestore(), "Posts");
      const q = query(docRef, where("userID", "==", getAuth().currentUser.uid));
      const querySnapshot = await getDocs(q, {
        orderBy: "createdAt",
        descending: true,
      });
      onSnapshot(q, (querySnapshot) => {
        const cities = [];
        querySnapshot.forEach((doc) => {
          doc.data();
          cities.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(cities);
      });

      // onSnapshot(collectionGroup(db, "Posts"), (doc) => {
      //   const { id, ImageUrl, LikesCount, UserName, UserImage } = doc.data();
      //   list.push({
      //     id,
      //     ImageUrl,
      //     LikesCount,
      //     UserName,
      //     UserImage,
      //   });
      // });
      // querySnapshot.forEach((doc) => {});

      // setPosts(list);

      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const [userdata, setuserData] = useState("");
  const fetchUserData = async () => {
    const useDocRef = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = await getDoc(useDocRef);
    if (docSnap.exists()) {
      setuserData(docSnap.data());
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.Header}>Profile</Text>
      </View>
      <Divider style={{ backgroundColor: "black", marginTop: 7 }} />
      <View style={styles.profilePic}>
        <View style={styles.userInfo}>
          <Avatar.Image
            source={{
              uri: userdata
                ? userdata.userImage
                : " https://pic.onlinewebfonts.com/svg/img_264570.png",
            }}
            size={120}
          />
          <TouchableOpacity onPress={logOut}>
            <View style={{ margin: 10 }}>
              <Icon name="logout" size={30} color="red" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Title style={styles.name}>
            {userdata.userName ? userdata.userName : "UserName"}
          </Title>
          <Text style={styles.caption}>
            {userdata.bio ? userdata.bio : "Bio"}
          </Text>
        </View>
      </View>
      <Button
        color="rgb(60, 179, 113)"
        mode={"outlined"}
        onPress={() => navigation.navigate("EditProfile")}
      >
        Edit
      </Button>

      <Divider style={{ backgroundColor: "black", marginTop: 7 }} />
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Icon name="school" size={20} color="tomato" />
          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {userdata.department ? userdata.department : "Department"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="person" size={20} color="tomato" />
          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {userdata.gender ? userdata.gender : "Gender"}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="home" size={20} color="tomato" />
          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {userdata.city ? userdata.city : "City"}
          </Text>
        </View>
      </View>
      <FlatList
        item={item}
        data={post}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const onDelete = async ({}) => {
            const storageRef = ref(getStorage(), item.ImageUrl);
            deleteObject(storageRef).then(() => {
              alert("post  deleted");
              deleteDoc(doc(db, "Posts", item.id));
            });
          };
          return (
            <View style={styles.post}>
              <Image
                source={{ uri: item.ImageUrl }}
                style={{ width: "100%", height: 300 }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    color: "white",
  },
  Header: {
    marginTop: 50,
    marginLeft: 30,
    fontSize: 20,
    color: "white",
  },
  Text: {
    marginLeft: 30,
    fontSize: 15,
    marginTop: 10,
    color: "white",
  },
  profilePic: {
    marginTop: 20,
    // marginLeft: 150,
  },
  userInfo: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    color: "white",
  },
  info: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  name: {
    fontWeight: "normal",
    fontSize: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    color: "white",
  },
  caption: {
    fontWeight: "normal",
    color: "white",
  },
  infoSection: {
    margin: 3,
    padding: 10,
    color: "white",
  },
  row: {
    flexDirection: "row",
    marginLeft: 3,
  },
  post: {
    margin: 10,
    padding: 10,
    color: "white",
    height: 300,
  },
});
