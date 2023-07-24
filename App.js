import { StyleSheet } from 'react-native';
import Navigation from './StackNavigator';
import { PlayerContext } from './PlayerContext';

export default function App() {
  return (
    <PlayerContext>
      <Navigation styles={styles.container} />
    </PlayerContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
