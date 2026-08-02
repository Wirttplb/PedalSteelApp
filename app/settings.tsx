import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import ChordSelector from "../components/ChordSelector";
import CopedantConfig from "../components/CopedantConfig";
import KeySelector from "../components/KeySelector";
import Neck from "../components/Neck";
import PedalControls from "../components/PedalControls";
import ScaleSelector from "../components/ScaleSelector";
import TuningSelector from "../components/TuningSelector";
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
    activePedals,
    disabledPedals,
    intervalsColorCode,
    setIntervalsColorCode,
    chordsGeneratedDynamically,
    setChordsGeneratedDynamically,
    showPedalChangeLabels,
    setShowPedalChangeLabels,
    showPedalNameLabels,
    setShowPedalNameLabels,
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
        activePedals={activePedals}
        disabledPedals={disabledPedals}
        intervalsColorCode={intervalsColorCode}
        chordsGeneratedDynamically={chordsGeneratedDynamically}
        showPedalChangeLabels={showPedalChangeLabels}
        showPedalNameLabels={showPedalNameLabels}
      />

      {/* Top-right selectors like in main view */}
      {(tuning === "E9" || tuning === "Open E" || tuning === "Standard") && (
        <View style={styles.selectorContainer}>
          <KeySelector />
          {chordMode === "Chord" ? <ChordSelector /> : <ScaleSelector />}
        </View>
      )}

      {/* Pedal controls for E9 tuning */}
      {tuning === "E9" && <PedalControls />}

      <View style={styles.overlay} pointerEvents="none" />
      <Pressable onPress={handleBack} style={styles.backButton}>
        {<Entypo name="back" size={24} color="white" />}
      </Pressable>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.controls} pointerEvents="box-none">
          <Text style={styles.sectionTitle}>Mode Selection</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Scale</Text>
            <Switch
              value={chordMode === "Chord"}
              onValueChange={(value) => setChordMode(value ? "Chord" : "Scale")}
              trackColor={{
                false: bidirectionalSwitchColors.track,
                true: bidirectionalSwitchColors.track,
              }}
              thumbColor={
                chordMode === "Chord" ? bidirectionalSwitchColors.thumbOn : bidirectionalSwitchColors.thumbOff
              }
              style={styles.switch}
            />
            <Text style={styles.toggleLabel}>Chord</Text>
          </View>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Tuning</Text>
              <TuningSelector />
            </View>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.dropdownLabel}>Key</Text>
              <KeySelector />
            </View>
          </View>
          <View style={styles.dropdownRow}>
            <View style={[styles.dropdownWrapper, { opacity: chordMode === "Scale" ? 1 : 0.5 }]}>
              <Text style={styles.dropdownLabel}>Scale</Text>
              <ScaleSelector />
            </View>
            <View style={[styles.dropdownWrapper, { opacity: chordMode === "Chord" ? 1 : 0.5 }]}>
              <Text style={styles.dropdownLabel}>Chord</Text>
              <ChordSelector />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Generate chords dynamically</Text>
            <Switch
              value={!chordsGeneratedDynamically}
              onValueChange={(value) => setChordsGeneratedDynamically(!value)}
              trackColor={{
                false: bidirectionalSwitchColors.track,
                true: bidirectionalSwitchColors.track,
              }}
              thumbColor={
                !chordsGeneratedDynamically ? bidirectionalSwitchColors.thumbOn : bidirectionalSwitchColors.thumbOff
              }
              style={[styles.switch, chordMode === "Scale" && { opacity: 0.5 }]}
            />
            <Text style={styles.toggleLabel}>Use dictionary</Text>
          </View>

          {tuning === "E9" && (
            <>
              <Text style={styles.sectionTitle}>Copedant Configuration</Text>
              <CopedantConfig />
            </>
          )}

          <Text style={styles.sectionTitle}>UI Customization</Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Intervals color code</Text>
            <Switch value={intervalsColorCode} onValueChange={setIntervalsColorCode} style={styles.switch} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Show pedal change labels (+n/-n)</Text>
            <Switch value={showPedalChangeLabels} onValueChange={setShowPedalChangeLabels} style={styles.switch} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Show pedal name labels</Text>
            <Switch value={showPedalNameLabels} onValueChange={setShowPedalNameLabels} style={styles.switch} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const pickerStyles = {
  inputIOS: { fontSize: 24, color: "white", padding: 8 },
  inputAndroid: { fontSize: 24, color: "white", padding: 8 },
};

const bidirectionalSwitchColors = {
  track: "#a3d3cf",
  thumbOn: "#009688",
  thumbOff: "#009688",
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
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  selectorContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    gap: 8,
    opacity: 0.7,
  },
});
