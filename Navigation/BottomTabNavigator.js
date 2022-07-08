import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeMain from "../Screens/HomeMain";
import Profile from "../Screens/Profile";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NewPost from "../Screens/NewPost";
export const BottomTabNavigator = ({ navigation }) => {
  const Tabs = createBottomTabNavigator();
  const Stack = createStackNavigator();
  return (
    <Tabs.Navigator
      initialRouteName={HomeMain}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, name }) => {
          let iconName;
          let rn = route.name;
          if (rn == "Home") {
            color = focused ? "#246EE9" : "gray";
            iconName = focused ? "home" : "home-outline";
          } else if (rn == "Profile") {
            color = focused ? "#246EE9" : "gray";
            iconName = focused ? "account" : "account-outline";
          } else if (rn == "Post") {
            color = focused ? "#246EE9" : "gray";
            iconName = focused ? "image-plus" : "image-outline";
          }
          return (
            <MaterialCommunityIcons name={iconName} color={color} size={30} />
          );
        },

        headerShown: false,
        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: "black",
        },
        tabBarStyle: {
          marginBottom: 0,
          backgroundColor: "white",
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeMain} />
      <Tabs.Screen name="Post" component={NewPost} />
      <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
  );
};
export default BottomTabNavigator;
