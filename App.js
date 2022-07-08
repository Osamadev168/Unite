import AuthNavigation from "./Components/AuthNavigation";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
export default function App() {
  return <AuthNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
