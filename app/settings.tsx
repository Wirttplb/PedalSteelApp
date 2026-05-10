import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Neck from '../components/neck';
import { useKey } from './keyContext';
import { Pedal } from '../fretboardEngine/pedal';

export default function SettingsScreen() {
    const router = useRouter();
    const { selectedKey, setSelectedKey,
        selectedMode, setSelectedMode,
        chordMode, setChordMode,
        chordType, setChordType,
        tuning, setTuning,
        pedals, setPedals } = useKey();

    const handlePedalChange = (pedalName: string, stringIdx: number, semitones: number) => {
        const newPedals = pedals.map(p => {
          if (p.name === pedalName) {
            const newP = new Pedal();
            newP.name = p.name;
            const changes = [...p.changes];
            const existingIdx = changes.findIndex(c => c[0] === stringIdx);
            
            if (semitones === 0) {
                if (existingIdx !== -1) changes.splice(existingIdx, 1);
            } else {
                if (existingIdx !== -1) {
                    changes[existingIdx] = [stringIdx, semitones];
                } else {
                    changes.push([stringIdx, semitones]);
                }
            }
            newP.changes = changes;
            return newP;
          }
          return p;
        });
        setPedals(newPedals);
    };

  return (
    <View style={styles.container}>
        <Neck selectedKey={selectedKey} selectedMode={selectedMode} chordMode={chordMode} chordType={chordType} tuning={tuning} pedals={pedals}/>
        <View style={styles.overlay} pointerEvents="none" />
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            { <Entypo name="back" size={24} color="white" /> }
        </Pressable>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.controls} pointerEvents="box-none">
                <View style={styles.dropdownRow}>
                    <View style={[styles.dropdownWrapper, {opacity: tuning === 'E9' ? 1 : 0.5}]}>
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
                            style={pickerStyles}
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
                            style={pickerStyles}
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
                            style={pickerStyles}
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
                                { label: 'Diminished Seventh', value: 'Diminished Seventh' },
                                { label: 'Whole-tone', value: 'Whole-tone' },
                            ]}
                            value={selectedMode}
                            style={pickerStyles}
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
                            style={pickerStyles}
                        />
                    </View>
                </View>

                {tuning === 'E9' && (
                    <View style={styles.pedalConfigSection}>
                        <Text style={styles.sectionTitle}>Copedant Configuration</Text>
                        {pedals.map(pedal => (
                            <View key={pedal.name} style={styles.pedalRow}>
                                <Text style={styles.pedalLabel}>Pedal {pedal.name}:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const change = pedal.changes.find(c => c[0] === i);
                                        const value = change ? change[1] : 0;
                                        return (
                                            <View key={i} style={styles.stringChangeWrapper}>
                                                <Text style={styles.stringLabel}>Str {i+1}</Text>
                                                <RNPickerSelect
                                                    placeholder={{ label: '0', value: 0 }}
                                                    onValueChange={(val) => handlePedalChange(pedal.name, i, val)}
                                                    items={[
                                                        { label: '+2', value: 2 },
                                                        { label: '+1', value: 1 },
                                                        { label: '0', value: 0 },
                                                        { label: '-1', value: -1 },
                                                        { label: '-2', value: -2 },
                                                    ]}
                                                    value={value}
                                                    style={smallPickerStyles}
                                                />
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;

const pickerStyles = {
    inputIOS: { fontSize: 24, color: 'white', padding: 10 },
    inputAndroid: { fontSize: 24, color: 'white', padding: 10 },
};

const smallPickerStyles = {
    inputIOS: { fontSize: 16, color: '#fa990f', padding: 5, minWidth: 40 },
    inputAndroid: { fontSize: 16, color: '#fa990f', padding: 5, minWidth: 40 },
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#211f1d',
  },
  scrollView: {
    flex: 1,
    marginTop: 60,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  controls: {
    paddingHorizontal: 10,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: '#333',
    marginHorizontal: 10,
    minWidth: 120,
  },
  pedalConfigSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pedalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 5,
  },
  pedalLabel: {
    color: 'white',
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stringChangeWrapper: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  stringLabel: {
    color: '#aaa',
    fontSize: 10,
  }
});
