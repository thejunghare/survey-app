import { StyleSheet, Text, View } from 'react-native';
import { UserProvider } from './src/appwrite/UserContext';
import { Router } from './src/routes/Router';

export default function App() {
  return (
    <UserProvider>
        <Router />
    </UserProvider >
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
