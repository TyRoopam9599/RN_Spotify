import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './StackNavigator';

export default function App() {
  return (
    <Navigation styles={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
