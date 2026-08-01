import React from "react";
import { Text, View } from "react-native";

interface PedalLabelProps {
  left: number;
  top: number;
  diameter: number;
  pedalName: string;
}

export const PedalLabel = ({ left, top, diameter, pedalName }: PedalLabelProps) => (
  <View
    style={{
      position: "absolute",
      left: left + 0.03 * diameter * 35, // 0.04 * screenWidth ≈ 0.04 * diameter * 35
      top: top + 0.02 * diameter * 35,
    }}
  >
    <Text
      style={{
        color: "rgb(99, 252, 112)",
        fontWeight: "bold",
        fontSize: diameter * 0.75,
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      }}
    >
      {pedalName}
    </Text>
  </View>
);
