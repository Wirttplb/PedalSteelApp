import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from "react-native";
import Neck from '../components/neck';
import { useKey } from './keyContext';

export default function Index() {
    const { selectedKey, selectedMode } = useKey();

  return (
    <View style={styles.container}>
        <Neck selectedKey={selectedKey} selectedMode={selectedMode} />
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
        backgroundColor: '#211f1d',
     },
      settingsContainer: {
        position: 'absolute', //floats on top
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
     },
    settingsButton: {
        padding: 20,
    },
});