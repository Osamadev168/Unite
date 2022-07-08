import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Avatar, Button, Image, TextInput } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

const MoreCreds = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Information Technology", value: "Information Technology" },
    { label: "Management Sciences", value: "Management Science" },
    { label: "English", value: "English" },
  ]);
  DropDownPicker.setTheme("LIGHT");
  return (
    <View style={styles.container}>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.Header}>Update your Profile</Text>
      </View>
      <View style={{ padding: 3 }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          margin: 30,
        }}
      >
        <View style={styles.InputField}>
          <TextInput
            keyboardType={"default"}
            mode={"flat"}
            label="Username"
            style={{ borderRadius: 3, borderColor: "black", borderWidth: 1 }}
          />
        </View>

        <View style={styles.InputField}>
          <TextInput
            keyboardType={"default"}
            mode={"flat"}
            label="Gender"
            style={{ borderRadius: 3, borderColor: "black", borderWidth: 1 }}
          />
        </View>

        <View style={styles.InputField}>
          <TextInput
            keyboardType={"default"}
            mode={"flat"}
            label="Address"
            style={{ borderRadius: 3, borderColor: "black", borderWidth: 1 }}
          />
        </View>
      </View>

      {/* <View style={{ padding: 3 }}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </View> */}
      <View style={styles.ButtonContainer}>
        <Button backgroundColor="rgb(60, 179, 113)" mode={"contained"}>
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default MoreCreds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A3B67",
    alignItems: "center",
    padding: 20,
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
    marginLeft: 300,
    marginTop: 10,
    width: "50%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
