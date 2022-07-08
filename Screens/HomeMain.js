import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  TouchableNativeFeedbackComponent,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../Firebase/Config";
import { currentUser } from "../Components/AuthNavigation";
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  getFirestore,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import RBSheet from "react-native-raw-bottom-sheet";
import { ref, refFromUrl, getStorage, deleteObject } from "firebase/storage";
import moment from "moment";
import Post from "../Components/Post";
import { Button, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";
import { AuthNavigation } from "../Components/AuthNavigation";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const HomeMain = ({ item, navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const [post, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [userData, setUserData] = useState(false);
  const refRBSheet = useRef();

  const fetchUserData = () => {
    const docRef = doc(db, "Users", getAuth().currentUser.uid);
    const docSnap = getDoc(docRef);
    docSnap.then((doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        console.log("No such document!");
      }
    });
  };
  const deletePost = () => {
    const docref = doc(
      getFirestore(),
      "Users",
      getAuth().currentUser.uid,
      "Posts",
      post.id
    );
    deleteDoc(docref);
  };
  const fetchPosts = async () => {
    try {
      const docRef = collection(getFirestore(), "Posts");
      const q = query(docRef);
      const querySnapshot = await getDocs(q, {
        orderBy: "createdAt",
        descending: true,
      });
      onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          doc.data();
          posts.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(posts);
      });

      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchUserData();
    fetchPosts();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "rgb(87, 138, 182)" }}>
      <Post />

      <View style={{ marginBottom: 10, height: "100%" }} onDelete={deletePost}>
        <FlatList
          item={item}
          data={post}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const handleLike = () => {
              const docref = doc(getFirestore(), "Posts", item.id);
              updateDoc(docref, {
                LikesCount: arrayUnion(userData.userName),
              }).then(() => {
                setActive(false);
              });
            };
            const handleUnlike = () => {
              const docref = doc(getFirestore(), "Posts", item.id);
              updateDoc(docref, {
                LikesCount: arrayRemove(userData.userName),
              }).then(() => {
                setActive(true);
              });
            };
            const onDelete = async ({}) => {
              if (item.ImageUrl !== null) {
                const storageRef = ref(getStorage(), item.ImageUrl);
                deleteObject(storageRef).then(() => {
                  alert("post  deleted");
                  deleteDoc(doc(db, "Posts", item.id));
                });
              } else {
                deleteDoc(doc(db, "Posts", item.id));
                Alert.alert("Post Removed");
              }
            };

            return (
              <View
                item={item}
                style={{
                  backgroundColor: "rgb(240, 240, 240)",
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                    backgroundColor: "rgb(210, 210, 210)",
                  }}
                >
                  <Image
                    style={{ width: 30, height: 30, borderRadius: 40 }}
                    source={{
                      uri: item.userImage
                        ? item.userImage
                        : "https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("NavProfile", {
                        userID: item.userID,
                        userName: item.userName,
                        userImage: item.userImage,
                        bio: item.bio,
                        city: item.city,
                        gender: item.gender,
                        department: item.department,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        marginLeft: 5,
                      }}
                    >
                      {item.userName}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ marginLeft: 5, marginTop: 1 }}>
                    <Text style={{ fontWeight: "normal" }}>
                      {moment(item.createdat.toDate()).fromNow()}
                    </Text>
                  </View>
                  {getAuth().currentUser.uid === item.userID ? (
                    <View style={{ marginLeft: 50 }}>
                      <TouchableOpacity onPress={onDelete}>
                        <Icon name="close-thick" color={"red"} size={30} />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                <Divider width={1} color={"black"} orientation={"horizontal"} />
                <View
                  style={{
                    padding: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {item.postText}
                  </Text>
                </View>
                {item.ImageUrl !== null ? (
                  <Image
                    source={{ uri: item.ImageUrl }}
                    style={{
                      width: "100%",
                      height: 300,
                      resizeMode: "cover",
                    }}
                    item={item.id}
                    onDelete={deletePost}
                    onLike={handleLike}
                    onUnlike={handleUnlike}
                  />
                ) : null}
                <View style={{ justifyContent: "center", margin: 10 }}>
                  <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    customStyles={{
                      wrapper: {
                        backgroundColor: "transparent",
                      },
                      draggableIcon: {
                        backgroundColor: "#000",
                      },
                    }}
                  >
                    <Text>{item.LikesCount}</Text>
                  </RBSheet>
                  <TouchableOpacity>
                    <Text style={{ fontWeight: "400", color: "black" }}>
                      {item.LikesCount.length} Likes{"\n"}{" "}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flexDirection: "row" }}>
                    {item.LikesCount.includes(userData.userName) ? (
                      <TouchableOpacity onPress={handleUnlike}>
                        <Image
                          source={{
                            uri: "https://img.icons8.com/color/48/000000/dislike--v1.png",
                          }}
                          style={{ width: 30, height: 30, margin: 5 }}
                          index={index}
                          item={item.id}
                          onUnlike={handleUnlike}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={handleLike}>
                        <Image
                          source={{
                            uri: "https://img.icons8.com/color/48/000000/like--v1.png",
                          }}
                          style={{ width: 30, height: 30, margin: 5 }}
                          item={item.id}
                          onLike={handleLike}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Comment", {
                        postID: item.id,
                        userId: item.userID,
                      })
                    }
                  >
                    <Text style={{ fontWeight: "bold", margin: 5 }}>
                      Comment or View Comments
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ marginTop: 5, padding: 2, margin: 5 }}>
                  <Divider
                    width={1}
                    color={"black"}
                    orientation={"horizontal"}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default HomeMain;

const styles = StyleSheet.create({});
