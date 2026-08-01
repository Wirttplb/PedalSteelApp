import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useKey } from "../app/keyContext";

export default function PedalControls() {
  const { pedals, activePedals, setActivePedals } = useKey();

  const togglePedal = (index: number) => {
    if (activePedals.includes(index)) {
      setActivePedals(activePedals.filter((p) => p !== index));
    } else {
      setActivePedals([...activePedals, index]);
    }
  };

  return (
    <View style={styles.pedalControls}>
      {pedals.map((pedal, index) => (
        <Pressable
          key={index}
          style={[styles.pedalButton, activePedals.includes(index) && styles.pedalButtonActive]}
          onPress={() => togglePedal(index)}
        >
          <Text style={[styles.pedalButtonText, activePedals.includes(index) && styles.pedalButtonTextActive]}>
            {pedal.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pedalControls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
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
  pedalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pedalButtonTextActive: {
    color: "black",
  },
});
