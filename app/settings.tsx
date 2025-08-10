import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Neck from '../components/neck';
import { useKey } from './keyContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { selectedKey, setSelectedKey,
        selectedMode, setSelectedMode,
        chordMode, setChordMode,
        chordType, setChordType,
        tuning, setTuning } = useKey();

  return (
    <View style={styles.container}>
        <Neck selectedKey={selectedKey} selectedMode={selectedMode} chordMode={chordMode} chordType={chordType} tuning={tuning}/>
        <View style={styles.overlay} pointerEvents="none" />
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            { <Entypo name="back" size={24} color="white" /> }
        </Pressable>

        {/* Dropdowns settings */}
        <View style={styles.controls} pointerEvents="box-none">
            <View style={styles.dropdownRow}>
                <View style={styles.dropdownWrapper}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => {setChordMode(itemValue);}}
                        disabled={tuning !== 'E9'}
                        items={[
                            { label: 'Scale', value: 'Scale' },
                            { label: 'Chord', value: 'Chord' },
                        ]}
                        value={chordMode}
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
                <View style={styles.dropdownWrapper}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => {
                            setTuning(itemValue);
                            setChordMode('Scale');
                        }}
                        items={[
                            { label: 'E9', value: 'E9' },
                            { label: 'Open E', value: 'Open E' },
                            { label: 'Standard', value: 'Standard' },
                        ]}
                        value={tuning}
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
                <View style={styles.dropdownWrapper}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => {setSelectedKey(itemValue);}}
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
                <View style={[styles.dropdownWrapper, {opacity: chordMode === 'Scale' ? 1 : 0.5}]}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => setSelectedMode(itemValue)}
                        items={[
                            { label: 'Major', value: 'Major' },
                            { label: 'Minor', value: 'Minor' },
                            { label: 'Major Pentatonic', value: 'Major Pentatonic' },
                            { label: 'Minor Pentatonic', value: 'Minor Pentatonic' },
                            { label: 'Dorian', value: 'Dorian' },
                            { label: 'Phrygian', value: 'Phrygian' },
                            { label: 'Lydian', value: 'Lydian' },
                            { label: 'Mixolydian', value: 'Mixolydian' },
                            { label: 'Aeolian', value: 'Aeolian' },
                            { label: 'Locrian', value: 'Locrian' },
                        ]}
                        value={selectedMode}
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
                <View style={[styles.dropdownWrapper, {opacity: chordMode === 'Chord' ? 1 : 0.5}]}>
                    <RNPickerSelect
                        placeholder={{}}
                        useNativeAndroidPickerStyle ={false}
                        onValueChange={(itemValue) => {setChordType(itemValue);}}
                        items={[
                            { label: 'M', value: 'M' },
                            { label: 'm', value: 'm' },
                            { label: 'M7', value: 'M7' },
                            { label: 'm7', value: 'm7' },
                            { label: '7', value: '7' },
                            { label: 'aug', value: 'aug' },
                            { label: 'dim', value: 'dim' },
                            { label: 'sus2', value: 'sus2' },
                            { label: 'sus4', value: 'sus4' },
                            { label: 'M6', value: 'M6' },
                            { label: 'mm6', value: 'mm6' },
                            { label: 'mM6', value: 'mM6' },
                            { label: 'M7/6', value: 'M7/6' },
                            { label: 'M6add9', value: 'M6add9' },
                            { label: 'add9', value: 'add9' },
                            { label: 'madd9', value: 'madd9' },
                            { label: 'M9', value: 'M9' },
                            { label: 'm9', value: 'm9' },
                            { label: 'mM9', value: 'mM9' },
                            { label: '9', value: '9' },
                            { label: '7b9', value: '7b9' },
                            { label: '7#9', value: '7#9' },
                            { label: '11', value: '11' },
                            { label: '13', value: '13' },
                            { label: 'Mb5', value: 'Mb5' },
                            { label: 'm7b5', value: 'm7b5' },
                            { label: 'mb5bb7', value: 'mb5bb7' },
                            { label: 'b5b13', value: 'b5b13' },
                        ]}
                        value={chordType}
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
    left: 0.1*screenHeight,
    padding: 10,
    flexDirection: 'row',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    marginLeft: 20
  },
   label: {
    padding: 0,
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 46,
  },
  picker:
{
    // inputIOS: {
    //     fontSize: 46,
    //     color: 'white',
    //     padding: 20,
    // },
    // inputAndroid: {
    //     fontSize: 46,
    //     color: 'white',
    //     padding: 20,
    // }
  }
});
