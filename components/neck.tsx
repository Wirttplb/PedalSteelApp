import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import * as fretboardEngine from "../fretboardEngine/fretboard";
import { Pedal, getPedalsFromString } from "../fretboardEngine/pedal";
import InlayDot from "./dot";
import Fret from "./fret";

const NUM_FRETS = 12; // + 1
const screenWidth = Dimensions.get("window").width;
const NUT_WIDTH = 0.043 * screenWidth;

const INTERVAL_COLORS: Record<string, string> = {
  "1": "#e45300ff",
  "♭2": "#60a5fa",
  "2": "#60a5fa",
  "♭3": "#fb923c",
  "3": "#fb923c",
  "4": "#40b66b",
  "♭5": "#924848",
  "5": "#ff5151",
  "♭6": "#f472b6",
  "6": "#f472b6",
  "♭7": "#ad32ff",
  "7": "#ad32ff",
};

function getIntervalColor(interval: string, colorCode: boolean): string {
  if (!colorCode) return interval === "1" ? "#e45300ff" : "#fa990f";
  return INTERVAL_COLORS[interval] ?? "#fa990f";
}

type NeckProps = {
  selectedKey: string;
  selectedMode: string;
  chordMode: string;
  chordType: string;
  tuning: string;
  pedals: Pedal[];
  activePedals?: number[];
  intervalsColorCode?: boolean;
};

const Neck = ({
  selectedKey,
  selectedMode,
  chordMode,
  chordType,
  tuning,
  pedals,
  activePedals = [],
  intervalsColorCode = false,
}: NeckProps) => {
  // Initialize fretboard
  let fretboard: fretboardEngine.Fretboard;
  let numStrings = 10;

  if (tuning === "E9") {
    fretboard = fretboardEngine.Fretboard.initAsPedalSteelE9();
    fretboard.pedals = pedals;
    numStrings = 10;
  } else if (tuning === "Open E") {
    fretboard = fretboardEngine.Fretboard.initAsGuitarOpenE();
    numStrings = 6;
  } else if (tuning === "Standard") {
    fretboard = fretboardEngine.Fretboard.initAsGuitarStandard();
    numStrings = 6;
  } else {
    throw new Error("Invalid tuning!");
  }

  // Calculate fret positions based on screen width
  const fretSpacing = screenWidth / (NUM_FRETS + 1);
  const fretOffset = 0.9 * NUT_WIDTH + fretSpacing; // distance to 1st fret (not nut)
  const frets = Array.from({ length: NUM_FRETS }, (_, index) => (
    <Fret key={index} left={index * fretSpacing + 1 * fretOffset} />
  ));

  // Inlay dots
  const screenHeight = Dimensions.get("window").height;
  const inlayFrets = [3, 5, 7, 9, 12];
  const dotTop = 0.5 * screenHeight;

  const dots = inlayFrets.map((fret, index) => {
    // Position between frets
    const left = (fret - 0.1) * fretSpacing;
    const diameter = (2 * screenWidth) / 70;

    // For double dots on 12th, 24th fret
    const isDouble = fret % 12 === 0;

    if (isDouble) {
      return (
        <React.Fragment key={fret}>
          <InlayDot left={left} top={screenHeight / 3 - diameter / 2} diameter={diameter} />
          <InlayDot left={left} top={(2 * screenHeight) / 3 - diameter / 2} diameter={diameter} />
        </React.Fragment>
      );
    } else {
      return <InlayDot key={fret} left={left} top={dotTop - diameter / 2} diameter={diameter} />;
    }
  });

  // Strings (horizontal lines)
  const strings = Array.from({ length: numStrings }, (_, index) => {
    const top = (index + 1) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.04 * screenHeight;
    let height = screenHeight / 150;
    if (index < 0.3 * numStrings) {
      height *= 3 / 5;
    } else if (index < 0.5 * numStrings) {
      height *= 4 / 5;
    }
    return (
      <View
        key={`string-${index}`}
        style={{
          position: "absolute",
          width: "100%",
          top,
        }}
      >
        <View style={[styles.string, { height: height }]} />
        <View style={[styles.stringShadow, { height: 0.3 * height, marginTop: height }]} />
      </View>
    );
  });

  // Notes, render disks for each note to display
  const startFret = 0;
  const endFret = 12;
  let fretboardNotes: (string | null)[][] = [];
  let pedalsData: Pedal[] = [];

  const noteDisks = [];
  const pedalLabels = [];
  const diameter = (2 * screenWidth) / 70;

  let maxIdx = 1;
  if (chordMode === "Chord") {
    maxIdx = 9;
  }

  for (let voicingIdx = 0; voicingIdx < maxIdx; voicingIdx++) {
    // For chords we display all voicings at the same time (1 per fret max)
    if (chordMode === "Scale") {
      fretboardNotes = fretboard.generateScaleAsIntervals(selectedKey, selectedMode, startFret, endFret, activePedals);
    } else if (chordMode === "Chord") {
      let { fretboardData, pedals } = fretboard.voicingToFretboardData(selectedKey, chordType, voicingIdx);
      fretboardNotes = fretboardData;
      pedalsData = pedals;
    } else {
      throw new Error("Invalid chord mode!");
    }

    for (let stringIdx = 0; stringIdx < fretboardNotes.length; stringIdx++) {
      const pedalForString: Pedal[] = getPedalsFromString(stringIdx, pedalsData);

      for (let fretIdx = 0; fretIdx < fretboardNotes[stringIdx].length; fretIdx++) {
        let interval = fretboardNotes[stringIdx][fretIdx];
        if (interval) {
          const left = fretIdx * fretSpacing + 1 * NUT_WIDTH - diameter / 2 - 0.005 * screenWidth;
          const top = (numStrings - stringIdx) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.075 * screenHeight;

          interval = interval.replace(/b/g, "♭"); // replace 'b' with '♭'

          noteDisks.push(
            <View
              key={`note-parent-${stringIdx}-${fretIdx}`}
              style={{
                position: "absolute",
                left: left,
                top: top,
                width: diameter * 1.5, // parent is bigger
                height: diameter * 1.5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent", // parent is transparent
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: diameter,
                  height: diameter,
                  borderRadius: diameter / 2,
                  backgroundColor: getIntervalColor(interval, intervalsColorCode),
                  // Shadow for iOS / desktop browser
                  shadowColor: "black",
                  shadowOffset: { width: 2, height: 6 },
                  shadowOpacity: 0.7,
                  shadowRadius: diameter / 2,
                  // Shadow for Android
                  elevation: 5,
                }}
              ></View>
              <Text
                style={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: diameter / 1,
                  top: -0.05 * diameter,
                }}
              >
                {interval}
              </Text>
            </View>,
          );

          if (pedalForString.length >= 1) {
            pedalLabels.push(
              <View
                key={`pedal-${stringIdx}-${fretIdx}`}
                style={{
                  position: "absolute",
                  left: left + 0.04 * screenWidth,
                  top: top,
                }}
              >
                <Text
                  style={{
                    color: "#52ff60ff",
                    fontWeight: "bold",
                    fontSize: diameter / 1,
                  }}
                >
                  {pedalForString[0].name}
                </Text>
              </View>,
            );
          }
        }
      }
    }
  }

  // Pedal change labels shown left of the nut when pedals are active
  const pedalChangeLabels: React.ReactNode[] = [];
  if (chordMode === "Scale" && activePedals.length > 0) {
    const stringChanges: Record<number, number> = {};
    for (const pedalIdx of activePedals) {
      const pedal = pedals[pedalIdx];
      if (!pedal) continue;
      for (const [stringIdx, semitones] of pedal.changes) {
        stringChanges[stringIdx] = (stringChanges[stringIdx] ?? 0) + semitones;
      }
    }
    for (const [key, total] of Object.entries(stringChanges)) {
      if (total === 0) continue;
      const stringIdx = parseInt(key);
      const top = (numStrings - stringIdx) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.065 * screenHeight;
      const label = total > 0 ? `+${total}` : `${total}`;
      pedalChangeLabels.push(
        <Text
          key={`pchange-${stringIdx}`}
          style={{
            position: "absolute",
            left: 2,
            top: top - diameter * 0.4,
            width: NUT_WIDTH - 2,
            color: "white",
            fontSize: NUT_WIDTH * 0.5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {label}
        </Text>,
      );
    }
  }

  // Add everything
  return (
    <View style={styles.container}>
      <View style={styles.neck} />
      <View style={styles.nut} />
      <View style={styles.nutLine} />
      {frets}
      {dots}
      {strings}
      {noteDisks}
      {pedalLabels}
      {pedalChangeLabels}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#211f1d",
    justifyContent: "center",
    alignItems: "center",
  },
  neck: {
    width: "100%",
    height: "100%",
    backgroundColor: "#a57a39",
    justifyContent: "center",
    alignItems: "center",
  },
  nut: {
    position: "absolute",
    width: NUT_WIDTH,
    height: "100%",
    left: 0,
    backgroundColor: "#211f1d",
  },
  nutLine: {
    position: "absolute",
    width: "0.4%",
    height: "100%",
    left: NUT_WIDTH,
    backgroundColor: "#686868",
  },
  string: {
    position: "absolute",
    left: 0,
    width: "100%",
    backgroundColor: "#e2dabfff",
  },
  stringShadow: {
    position: "absolute",
    left: 0,
    width: "100%",
    backgroundColor: "#958963",
  },
});

export default Neck;
