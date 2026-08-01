import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import Neck from '../components/neck';
import { useKey } from './keyContext';

export default function Index() {
    const { selectedKey, selectedMode, chordMode, chordType, tuning, pedals, activePedals, setActivePedals } = useKey();

    const togglePedal = (pedal: string) => {
        if (activePedals.includes(pedal)) {
            setActivePedals(activePedals.filter(p => p !== pedal));
        } else {
            setActivePedals([...activePedals, pedal]);
        }
    };

  return (
    <View style={styles.container}>
        <Neck selectedKey={selectedKey} selectedMode={selectedMode} chordMode={chordMode} chordType={chordType} tuning={tuning} pedals={pedals} activePedals={activePedals}/>
        
        {chordMode === 'Scale' && tuning === 'E9' && (
            <View style={styles.pedalControls}>
                {pedals.map(pedal => (
                    <Pressable 
                        key={pedal.name} 
                        style={[styles.pedalButton, activePedals.includes(pedal.name) && styles.pedalButtonActive]}
                        onPress={() => togglePedal(pedal.name)}
                    >
                        <Text style={[styles.pedalButtonText, activePedals.includes(pedal.name) && styles.pedalButtonTextActive]}>
                            {pedal.name}
                        </Text>
                    </Pressable>
                ))}
            </View>
        )}

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
    pedalControls: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    pedalButton: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        minWidth: 50,
        alignItems: 'center',
    },
    pedalButtonActive: {
        backgroundColor: '#fa990f',
        borderColor: 'white',
    },
    pedalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pedalButtonTextActive: {
        color: 'black',
    }
});
