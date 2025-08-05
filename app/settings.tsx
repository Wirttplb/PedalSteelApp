import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            { <Entypo name="back" size={24} color="white" /> }
        </Pressable>
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
  text: {
    backgroundColor: '#25292e',
    color: '#fff',
  },
  backButton: {
    padding: 20
  },
});
