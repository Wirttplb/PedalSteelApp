import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Fretboard from '../components/fretboard';

export default function SettingsScreen() {
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState('E');

  return (
    <View style={styles.container}>
        <Fretboard/>
        <View style={styles.overlay} pointerEvents="none" />
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            { <Entypo name="back" size={24} color="white" /> }
        </Pressable>

        {/* Dropdowns settings */}
            <View style={styles.controls}>
            <View style={styles.dropdownRow}>
                <Text style={styles.label}>Key:</Text>
                <View style={styles.dropdownWrapper}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => setSelectedKey(itemValue)}
                        items={[
                            { label: 'C', value: 'C' },
                            { label: 'C#', value: 'C#' },
                            { label: 'D', value: 'D' },
                            { label: 'D#', value: 'D#' },
                            { label: 'E', value: 'E' },
                            { label: 'F', value: 'F' },
                            { label: 'F#', value: 'F#' },
                            { label: 'G', value: 'G' },
                            { label: 'G#', value: 'G#' },
                            { label: 'A', value: 'A' },
                            { label: 'A#', value: 'A#' },
                            { label: 'B', value: 'B' },
                        ]}
                        value={selectedKey}
                        style={{
                            inputIOS: {
                                fontSize: 46,
                                color: 'white',
                                padding: 20,
                            },
                            inputAndroid: {
                                fontSize: 46,
                                color: 'white',
                                padding: 20,
                            },
                        }}
                    />
                </View>
            </View>
            <View style={styles.dropdownRow}>
                <Text style={styles.label}>Mode:</Text>
                <View style={styles.dropdownWrapper}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => setSelectedKey(itemValue)}
                        items={[
                            { label: 'Major', value: 'Major' },
                            { label: 'Minor', value: 'Minor' },
                        ]}
                        value={selectedKey}
                        style={{
                            inputIOS: {
                                fontSize: 46,
                                color: 'white',
                                padding: 20,
                            },
                            inputAndroid: {
                                fontSize: 46,
                                color: 'white',
                                padding: 20,
                            },
                        }}
                    />
                </View>
            </View>
        </View>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#211f1d',
  },
  backButton: {
    position: 'absolute',
    padding: 20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent grey
  },
    controls: {
    flexDirection: 'column',
    },
    dropdownRow: {
    top: 0.2*screenHeight,
    left: 0.2*screenHeight,
    padding: 20,
    flexDirection: 'row',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
  },
   label: {
    padding: 20,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 46,
  },
});
