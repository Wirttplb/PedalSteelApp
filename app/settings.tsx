import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CopedantConfig from "../components/copedantConfig";
import Neck from "../components/neck";
import { useKey } from "./keyContext";

export default function SettingsScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };
  const {
    selectedKey,
    setSelectedKey,
    selectedMode,
    setSelectedMode,
    chordMode,
    setChordMode,
    chordType,
    setChordType,
    tuning,
    setTuning,
    pedals,
    setPedals,
    intervalsColorCode,
    setIntervalsColorCode,
    chordsGeneratedDynamically,
    setChordsGeneratedDynamically,
  } = useKey();

  return (
    <View style={styles.container}>
      <Neck
        selectedKey={selectedKey}
        selectedMode={selectedMode}
        chordMode={chordMode}
        chordType={chordType}
        tuning={tuning}
        pedals={pedals}
        intervalsColorCode={intervalsColorCode}
        chordsGeneratedDynamically={chordsGeneratedDynamically}
      />
      <View style={styles.overlay} pointerEvents="none" />
      <Pressable onPress={handleBack} style={styles.backButton}>
        {<Entypo name="back" size={24} color="white" />}
      </Pressable>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.controls} pointerEvents="box-none">
          <Text style={styles.sectionTitle}>Mode Selection</Text>
          <View style={styles.dropdownRow}>
            <View style={[styles.dropdownWrapper, { opacity: tuning === "E9" ? 1 : 0.5 }]}>
              <RNPickerSelect
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(itemValue) => {
                  setChordMode(itemValue);
                }}
                disabled={tuning !== "E9"}
                items={[
                  { label: "Scale", value: "Scale" },
                  { label: "Chord", value: "Chord" },
                ]}
                value={chordMode}
                style={pickerStyles}
              />
            </View>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(itemValue) => {
                  setTuning(itemValue);
                  setChordMode("Scale");
                }}
                items={[
                  { label: "E9", value: "E9" },
                  { label: "Open E", value: "Open E" },
                  { label: "Standard", value: "Standard" },
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
                useNativeAndroidPickerStyle={false}
                onValueChange={(itemValue) => {
                  setSelectedKey(itemValue);
                }}
                items={[
                  { label: "C", value: "C" },
                  { label: "C#", value: "C#" },
                  { label: "D", value: "D" },
                  { label: "D#", value: "D#" },
                  { label: "E", value: "E" },
                  { label: "F", value: "F" },
                  { label: "F#", value: "F#" },
                  { label: "G", value: "G" },
                  { label: "G#", value: "G#" },
                  { label: "A", value: "A" },
                  { label: "A#", value: "A#" },
                  { label: "B", value: "B" },
                ]}
                value={selectedKey}
                style={pickerStyles}
              />
            </View>
          </View>

          <View style={styles.dropdownRow}>
            <View style={[styles.dropdownWrapper, { opacity: chordMode === "Scale" ? 1 : 0.5 }]}>
              <RNPickerSelect
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(itemValue) => setSelectedMode(itemValue)}
                items={[
                  { label: "Major", value: "Major" },
                  { label: "Minor", value: "Minor" },
                  { label: "Major Pentatonic", value: "Major Pentatonic" },
                  { label: "Minor Pentatonic", value: "Minor Pentatonic" },
                  { label: "Dorian", value: "Dorian" },
                  { label: "Phrygian", value: "Phrygian" },
                  { label: "Lydian", value: "Lydian" },
                  { label: "Mixolydian", value: "Mixolydian" },
                  { label: "Aeolian", value: "Aeolian" },
                  { label: "Locrian", value: "Locrian" },
                  { label: "Diminished Seventh", value: "Diminished Seventh" },
                  { label: "Augmented", value: "Augmented" },
                  { label: "Whole-tone", value: "Whole-tone" },
                  { label: "Chromatic", value: "Chromatic" },
                ]}
                value={selectedMode}
                style={pickerStyles}
              />
            </View>
            <View style={[styles.dropdownWrapper, { opacity: chordMode === "Chord" ? 1 : 0.5 }]}>
              <RNPickerSelect
                placeholder={{}}
                useNativeAndroidPickerStyle={false}
                onValueChange={(itemValue) => {
                  setChordType(itemValue);
                }}
                items={[
                  { label: "M", value: "M" },
                  { label: "m", value: "m" },
                  { label: "M7", value: "M7" },
                  { label: "m7", value: "m7" },
                  { label: "7", value: "7" },
                  { label: "aug", value: "aug" },
                  { label: "dim", value: "dim" },
                  { label: "sus2", value: "sus2" },
                  { label: "sus4", value: "sus4" },
                  { label: "M6", value: "M6" },
                  { label: "mm6", value: "mm6" },
                  { label: "mM6", value: "mM6" },
                  { label: "M7/6", value: "M7/6" },
                  { label: "M6add9", value: "M6add9" },
                  { label: "add9", value: "add9" },
                  { label: "madd9", value: "madd9" },
                  { label: "M9", value: "M9" },
                  { label: "m9", value: "m9" },
                  { label: "mM9", value: "mM9" },
                  { label: "9", value: "9" },
                  { label: "7b9", value: "7b9" },
                  { label: "7#9", value: "7#9" },
                  { label: "11", value: "11" },
                  { label: "13", value: "13" },
                  { label: "Mb5", value: "Mb5" },
                  { label: "m7b5", value: "m7b5" },
                  { label: "mb5bb7", value: "mb5bb7" },
                  { label: "b5b13", value: "b5b13" },
                ]}
                value={chordType}
                style={pickerStyles}
              />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Chords dynamically generated</Text>
            <Switch
              value={chordsGeneratedDynamically}
              onValueChange={setChordsGeneratedDynamically}
              trackColor={{ false: "#555", true: "#fa990f" }}
              thumbColor={chordsGeneratedDynamically ? "white" : "#aaa"}
            />
          </View>

          <Text style={styles.sectionTitle}>Copedant Configuration</Text>
          <CopedantConfig />

          <Text style={styles.sectionTitle}>UI Customization</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Intervals color code</Text>
            <Switch
              value={intervalsColorCode}
              onValueChange={setIntervalsColorCode}
              trackColor={{ false: "#555", true: "#fa990f" }}
              thumbColor={intervalsColorCode ? "white" : "#aaa"}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;

const pickerStyles = {
  inputIOS: { fontSize: 24, color: "white", padding: 10 },
  inputAndroid: { fontSize: 24, color: "white", padding: 10 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#211f1d",
  },
  scrollView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  controls: {
    paddingHorizontal: 10,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0)",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  toggleLabel: {
    color: "white",
    fontSize: 16,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    backgroundColor: "#333",
    marginHorizontal: 10,
    minWidth: 120,
  },
});
