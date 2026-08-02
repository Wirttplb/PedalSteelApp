import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useKey } from "../app/keyContext";

export default function PedalControls() {
  const { pedals, activePedals, setActivePedals, disabledPedals, setDisabledPedals, chordMode } = useKey();

  const togglePedal = (index: number) => {
    if (chordMode === "Scale") {
      // Scale mode: toggle active pedals
      if (activePedals.includes(index)) {
        setActivePedals(activePedals.filter((p) => p !== index));
      } else {
        setActivePedals([...activePedals, index]);
      }
    } else {
      // Chord mode: toggle disabled pedals
      if (disabledPedals.includes(index)) {
        setDisabledPedals(disabledPedals.filter((p) => p !== index));
      } else {
        setDisabledPedals([...disabledPedals, index]);
      }
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pedalControlsContent}
      style={styles.pedalControls}
    >
      {pedals.map((pedal, index) => {
        const isActive = chordMode === "Scale" && activePedals.includes(index);
        const isDisabled = chordMode === "Chord" && disabledPedals.includes(index);
        return (
          <Pressable
            key={index}
            style={[styles.pedalButton, isActive && styles.pedalButtonActive, isDisabled && styles.pedalButtonDisabled]}
            onPress={() => togglePedal(index)}
          >
            <Text
              style={[
                styles.pedalButtonText,
                isActive && styles.pedalButtonTextActive,
                isDisabled && styles.pedalButtonTextDisabled,
              ]}
            >
              {pedal.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pedalControls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  pedalControlsContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    paddingBottom: 10, // Add some bottom padding for better touch target
  },
  pedalButton: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    minWidth: 50,
    alignItems: "center",
    opacity: 0.7,
  },
  pedalButtonActive: {
    backgroundColor: "#fa990f",
    borderColor: "white",
    opacity: 0.7,
  },
  pedalButtonDisabled: {
    opacity: 0.3,
    backgroundColor: "#adacac",
    borderColor: "#000000",
  },
  pedalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pedalButtonTextActive: {
    color: "black",
  },
  pedalButtonTextDisabled: {
    color: "white",
  },
});
