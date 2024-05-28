import { StyleSheet, Text, View } from 'react-native';
import { AppwriteProvider } from './src/appwrite/UserContext';
import { Router } from './src/routes/Router';
import { SurveyProvider } from './src/appwrite/SurveyContext'; // Add import

export default function App() {
  return (
    <AppwriteProvider>
      <SurveyProvider>
        <Router />
      </SurveyProvider>
    </AppwriteProvider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});