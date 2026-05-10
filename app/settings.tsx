import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Neck from '../components/neck';
import { useKey } from './keyContext';

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
