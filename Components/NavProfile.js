import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
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
} from "react-native-paper";
import {
  doc,
  query,
  getDoc,
  getDocs,
  collection,
  getFirestore,
  onSnapshot,
  where,
} from "firebase/firestore";
import moment from "moment";

import { getAuth } from "firebase/auth";
import { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import MoreCreds from "../Components/MoreCreds";
import Icon from "react-native-vector-icons/MaterialIcons";
import { currentUser } from "../Components/AuthNavigation";

const Profile = ({ navigation, route, item }) => {
  const [post, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const list = [];

      const docRef = collection(getFirestore(), "Posts");
      const q = query(
        docRef,
        where(
          "userID",
          "==",
          route.params ? route.params.userID : getAuth().currentUser.uid
        )
      );
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
      console.log(post);

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
    const userDoc = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists) {
      const userData = docSnap.data();
      setuserData(userData);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);
  const refRBSheet = useRef();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.Header}>Profile</Text>
      </View>
      <Divider style={{ backgroundColor: "black", marginTop: 7 }} />
      <View style={styles.profilePic}>
        <View style={styles.userInfo}>
          <TouchableOpacity>
            <Avatar.Image
              source={{
                uri: route.params ? route.params.userImage : userdata.userImage,
              }}
              size={120}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Title style={styles.name}>
            {route.params ? route.params.userName : userdata.userName}
          </Title>
          <Text style={styles.caption}>
            {route.params ? route.params.bio : userdata.bio}
          </Text>
        </View>
      </View>
      <Divider style={{ backgroundColor: "black", marginTop: 7 }} />
      <View style={styles.infoSection}>
        <View style={styles.row}>
          <Icon name="school" size={20} color="tomato" />
          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {route.params ? route.params.department : userdata.department}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="person" size={20} color="tomato" />
          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {route.params ? route.params.gender : userdata.gender}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="home" size={20} color="tomato" />

          <Text
            style={{ marginLeft: 20, fontWeight: "normal", color: "white" }}
          >
            {route.params ? route.params.city : userdata.city}
          </Text>
        </View>
      </View>
      <FlatList
        item={item}
        data={post}
        horizontal={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const handleLike = () => {
            const docref = doc(getFirestore(), "Posts", item.id);
            updateDoc(docref, {
              LikesCount: arrayUnion(userdata.userName),
            }).then(() => {
              setActive(false);
            });
          };
          const handleUnlike = () => {
            const docref = doc(getFirestore(), "Posts", item.id);
            updateDoc(docref, {
              LikesCount: arrayRemove(userdata.userName),
            }).then(() => {
              setActive(true);
            });
          };

          return (
            <View style={{ flex: 1, margin: 10 }}>
              <Image
                source={{ uri: item.ImageUrl }}
                style={{ width: "100%", height: 370 }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
    marginBottom: 20,
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
    color: "white",
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
    margin: 10,
    padding: 10,
    color: "white",
  },
  row: {
    flexDirection: "row",
    marginLeft: 3,
    marginTop: 3,
    color: "white",
  },
});
