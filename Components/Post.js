import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";

const Post = ({ post }) => {
  const [active, setActive] = useState(null);

  return (
    <View>
      <HeaderHomeScreen />
    </View>
  );
};
const HeaderHomeScreen = () => (
  <SafeAreaView style={styles.mainContainer}>
    <View style={{ justifyContent: "center" }}>
      <Text style={styles.HeaderMain}>Unite </Text>
    </View>
    <TouchableOpacity>
      <Text style={styles.HeaderText}>Home </Text>
    </TouchableOpacity>
  </SafeAreaView>
);

export default Post;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#246EE9",
    height: 120,
  },
  HeaderText: {
    fontSize: 20,
    fontWeight: "normal",
    fontFamily: "sans-serif",
    color: "white",
    margin: 8,
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  HeaderMain: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: "normal",
    color: "white",
    marginTop: 30,
  },
});
