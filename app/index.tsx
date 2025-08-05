import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, View } from "react-native";
import Fretboard from '../components/fretboard';

export default function Index() {
  return (
    <View style={styles.container}>
        <Fretboard/>
        <View style={styles.settingsContainer}>
            <Link href="/settings" style={styles.settingsButton}>
                { <Entypo name="dots-three-vertical" size={24} color="white" /> }
            </Link>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#25292e',
     },
      settingsContainer: {
        position: 'absolute', //floats on top
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
     },
     fretboard: {

     },
    settingsButton: {
        padding: 20,
    },
});