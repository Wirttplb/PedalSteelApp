import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useKey } from "../appContext/keyContext";
import ChordSelector from "../components/ChordSelector";
import KeySelector from "../components/KeySelector";
import Neck from "../components/Neck";
import PedalControls from "../components/PedalControls";
import ScaleSelector from "../components/ScaleSelector";

export default function Index() {
  const {
    selectedKey,
    selectedMode,
    chordMode,
    chordType,
    tuning,
    pedals,
    activePedals,
    disabledPedals,
    intervalsColorCode,
    chordsGeneratedDynamically,
    showPedalChangeLabels,
    showPedalNameLabels,
    allowTwoLeversPlusPedals,
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
        allowTwoLeversPlusPedals={allowTwoLeversPlusPedals}
      />

      <View style={styles.selectorContainer}>
        <KeySelector />
        {chordMode === "Chord" ? <ChordSelector /> : <ScaleSelector />}
      </View>

      {chordMode === "Scale" && tuning === "E9" && <PedalControls />}
      {chordMode === "Chord" && tuning === "E9" && <PedalControls />}

      <View style={styles.settingsContainer}>
        <Link href="/settings" style={styles.settingsButton}>
          {<Entypo name="dots-three-horizontal" size={24} color="white" />}
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#211f1d",
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
  settingsContainer: {
    position: "absolute", //floats on top
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  settingsButton: {
    padding: 20,
  },
});
