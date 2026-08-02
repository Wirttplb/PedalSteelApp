import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { CHORD_FORMULAS, ChordGenerator } from "../fretboardEngine/chord_generator";
import { Voicing } from "../fretboardEngine/chords";
import * as fretboardEngine from "../fretboardEngine/fretboard";
import { convertStrIntervalToInt } from "../fretboardEngine/notes_utils";
import { Pedal, getPedalsFromString } from "../fretboardEngine/pedal";
import InlayDot from "./Dot";
import Fret from "./Fret";
import { NoteDisk } from "./NoteDisk";
import { PedalChangeLabel } from "./PedalChangeLabel";
import { PedalLabel } from "./PedalLabel";
import { StringComponent } from "./StringComponent";

const NUM_FRETS = 24; // 24 frets (2 octaves)
const screenWidth = Dimensions.get("window").width;
const NUT_WIDTH = 0.043 * screenWidth;

const INTERVAL_COLORS: Record<string, string> = {
  "1": "#e45300ff",
  "♭2": "#60a5fa",
  "2": "#60a5fa",
  "♭3": "#fb923c",
  "3": "#fb923c",
  "4": "#40b66b",
  "♭5": "#ff5151",
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
  disabledPedals?: number[];
  intervalsColorCode?: boolean;
  chordsGeneratedDynamically?: boolean;
  showPedalChangeLabels?: boolean;
  showPedalNameLabels?: boolean;
};

const Neck = ({
  selectedKey,
  selectedMode,
  chordMode,
  chordType,
  tuning,
  pedals,
  activePedals = [],
  disabledPedals = [],
  intervalsColorCode = false,
  chordsGeneratedDynamically = false,
  showPedalChangeLabels = true,
  showPedalNameLabels = true,
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
  const fretSpacing = screenWidth / 12; // 12 frets per screen width
  const fretOffset = 0.9 * NUT_WIDTH + fretSpacing; // distance to 1st fret (not nut)
  const frets = Array.from({ length: NUM_FRETS }, (_, index) => (
    <Fret key={index} left={index * fretSpacing + 1 * fretOffset} />
  ));

  // Inlay dots
  const screenHeight = Dimensions.get("window").height;
  const inlayFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
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
  const strings = Array.from({ length: numStrings }, (_, index) => (
    <StringComponent key={index} index={index} numStrings={numStrings} screenHeight={screenHeight} />
  ));

  // Pre-compute dynamic voicings when key/chordType/pedals change (only in Chord mode)
  const dynamicVoicings = useMemo<Voicing[]>(() => {
    if (!chordsGeneratedDynamically || chordMode !== "Chord") return [];
    const formula = CHORD_FORMULAS[chordType];
    if (!formula) return [];
    const fb = fretboardEngine.Fretboard.initAsPedalSteelE9();
    fb.pedals = pedals;
    const allVoicings = new ChordGenerator(fb).generateVoicings(formula, selectedKey);

    // Filter out voicings that use disabled pedals
    const filteredVoicings = allVoicings.filter((voicing) => {
      // voicing.pedals contains user-defined names
      // Check if any of the pedals in this voicing are disabled
      return !voicing.pedals.some((pedalName) => {
        const pedalIndex = pedals.findIndex((p) => p.name === pedalName);
        return pedalIndex !== -1 && disabledPedals.includes(pedalIndex);
      });
    });

    // Filter to only show one voicing per fret - select the one with most notes
    const voicingsByFret = new Map<number, Voicing[]>();
    for (const voicing of filteredVoicings) {
      // Find the fret this voicing is at (first non-null note)
      const fret = voicing.notes.find((n) => n !== null);
      if (fret !== undefined && fret !== null) {
        if (!voicingsByFret.has(fret)) {
          voicingsByFret.set(fret, []);
        }
        voicingsByFret.get(fret)!.push(voicing);
      }
    }
    // For each fret, select the voicing with the most non-null notes (most complete)
    const bestVoicings: Voicing[] = [];
    for (const [fret, voicings] of voicingsByFret.entries()) {
      const best = voicings.reduce((prev, curr) => {
        const prevNotes = prev.notes.filter((n) => n !== null).length;
        const currNotes = curr.notes.filter((n) => n !== null).length;
        return currNotes > prevNotes ? curr : prev;
      });
      bestVoicings.push(best);
    }
    // Return voicings sorted by fret
    const sortedVoicings = bestVoicings.sort((a, b) => {
      const fretA = a.notes.find((n) => n !== null) ?? 0;
      const fretB = b.notes.find((n) => n !== null) ?? 0;
      return fretA - fretB;
    });

    // Add transposed octave voicings for display (fret 12 = fret 0 + 12)
    const voicingsWithOctave = [...sortedVoicings];
    for (const voicing of sortedVoicings) {
      const fret = voicing.notes.find((n) => n !== null);
      if (fret === 0) {
        // This is a voicing at fret 0 (open position), add its octave at fret 12
        voicingsWithOctave.push(voicing.transposeOctaveUp());
      }
    }

    return voicingsWithOctave;
  }, [chordsGeneratedDynamically, chordMode, chordType, selectedKey, pedals, disabledPedals]);

  // Notes, render disks for each note to display
  const startFret = 0;
  const endFret = 24;
  let fretboardNotes: (string | null)[][] = [];
  let pedalsData: Pedal[] = [];

  const noteDisks = [];
  const pedalLabels = [];
  const diameter = (2 * screenWidth) / 70;

  let maxIdx = 1;
  if (chordMode === "Chord" && tuning === "E9") {
    maxIdx = chordsGeneratedDynamically ? dynamicVoicings.length : 9;
  }

  for (let voicingIdx = 0; voicingIdx < maxIdx; voicingIdx++) {
    // For chords we display all voicings at the same time (1 per fret max)
    if (chordMode === "Scale") {
      fretboardNotes = fretboard.generateScaleAsIntervals(selectedKey, selectedMode, startFret, endFret, activePedals);
    } else if (chordMode === "Chord") {
      // For Open E and Standard tunings, display chord formula as a scale
      if (tuning === "Open E" || tuning === "Standard") {
        const formula = CHORD_FORMULAS[chordType];
        if (formula) {
          const formulaAsInt = formula.map((interval) => convertStrIntervalToInt(interval));
          // Use scale generation with chord intervals
          fretboardNotes = fretboard.generateScaleAsIntervals(selectedKey, formulaAsInt, startFret, 24, activePedals);
        } else {
          fretboardNotes = [];
        }
        pedalsData = [];
      } else if (chordsGeneratedDynamically) {
        if (voicingIdx >= dynamicVoicings.length) continue;
        const voicing = dynamicVoicings[voicingIdx];
        const fretboardDataAsInts = fretboard.generateVoicing(voicing, selectedKey, endFret);
        // Use the actual Pedal objects from the voicing
        pedalsData = voicing.pedalObjects;
        fretboardNotes = fretboardEngine.Fretboard.convertFretboardScaleToIntervals(
          selectedKey,
          fretboardDataAsInts,
          pedalsData,
        );
      } else {
        let { fretboardData, pedals: pd } = fretboard.voicingToFretboardData(selectedKey, chordType, voicingIdx);
        fretboardNotes = fretboardData;
        pedalsData = pd;
      }
    } else {
      throw new Error("Invalid chord mode!");
    }

    for (let stringIdx = 0; stringIdx < fretboardNotes.length; stringIdx++) {
      const pedalForString: Pedal[] = getPedalsFromString(stringIdx, pedalsData);

      // Calculate total semitone change for this string from all pedals in this voicing
      let stringTotalChange = 0;
      for (const pedal of pedalForString) {
        for (const [sIdx, semitones] of pedal.changes) {
          if (sIdx === stringIdx) {
            stringTotalChange += semitones;
          }
        }
      }

      for (let fretIdx = 0; fretIdx < fretboardNotes[stringIdx].length; fretIdx++) {
        let interval = fretboardNotes[stringIdx][fretIdx];
        if (interval) {
          const left = fretIdx * fretSpacing + 1 * NUT_WIDTH - diameter / 2 - 0.005 * screenWidth;
          const top = (numStrings - stringIdx) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.075 * screenHeight;

          interval = interval.replace(/b/g, "♭"); // replace 'b' with '♭'

          noteDisks.push(
            <NoteDisk
              key={`note-${voicingIdx}-${stringIdx}-${fretIdx}`}
              left={left}
              top={top}
              diameter={diameter}
              interval={interval}
              colorCode={intervalsColorCode}
              stringTotalChange={stringTotalChange}
              chordMode={chordMode}
              getIntervalColor={getIntervalColor}
              showPedalChangeLabels={showPedalChangeLabels}
            />,
          );

          if (pedalForString.length >= 1 && showPedalNameLabels) {
            pedalLabels.push(
              <PedalLabel
                key={`pedal-${voicingIdx}-${stringIdx}-${fretIdx}`}
                left={left}
                top={top}
                diameter={diameter}
                pedalName={pedalForString[0].name}
              />,
            );
          }
        }
      }
    }
  }

  // Pedal change labels shown left of the nut when pedals are active (for E9 tuning)
  const pedalChangeLabels: React.ReactNode[] = [];
  if (tuning === "E9" && activePedals.length > 0 && showPedalChangeLabels) {
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
      const label = total > 0 ? `+${total}` : `${total}`;
      pedalChangeLabels.push(
        <PedalChangeLabel
          key={`pchange-${stringIdx}`}
          stringIdx={stringIdx}
          numStrings={numStrings}
          screenHeight={screenHeight}
          diameter={diameter}
          NUT_WIDTH={NUT_WIDTH}
          label={label}
        />,
      );
    }
  }

  // Add everything
  return (
    <View style={styles.container} pointerEvents="box-none">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{
          width: NUM_FRETS * fretSpacing + NUT_WIDTH + fretOffset,
          height: "100%",
        }}
      >
        <View style={styles.neck} pointerEvents="box-none" />
        <View style={styles.nut} pointerEvents="box-none" />
        <View style={styles.nutLine} pointerEvents="box-none" />
        {frets}
        {dots}
        {strings}
        {noteDisks}
        {pedalLabels}
        {pedalChangeLabels}
      </ScrollView>
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
