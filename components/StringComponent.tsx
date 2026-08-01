import React from "react";
import { StyleSheet, View } from "react-native";

interface StringProps {
  index: number;
  numStrings: number;
  screenHeight: number;
}

export const StringComponent = ({ index, numStrings, screenHeight }: StringProps) => {
  const top = (index + 1) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.04 * screenHeight;
  let height = screenHeight / 150;
  if (index < 0.3 * numStrings) {
    height *= 3 / 5;
  } else if (index < 0.5 * numStrings) {
    height *= 4 / 5;
  }
  return (
    <View key={`string-${index}`} style={{ position: "absolute", width: "100%", top }}>
      <View style={[styles.string, { height }]} />
      <View style={[styles.stringShadow, { height: 0.3 * height, marginTop: height }]} />
    </View>
  );
};

const styles = StyleSheet.create({
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
