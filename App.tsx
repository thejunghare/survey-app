import { StyleSheet, Text, View } from "react-native";
import { AppwriteProvider } from "./src/appwrite/UserContext";
import RootNavigator from "./src/routes/Router";
import { SurveyProvider } from "./src/appwrite/SurveyContext";

export default function App() {
  return (
    <AppwriteProvider>
      <SurveyProvider>
        <RootNavigator />
      </SurveyProvider>
    </AppwriteProvider>
  );
}
