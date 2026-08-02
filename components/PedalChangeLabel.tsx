import React from "react";
import { Text, TextProps } from "react-native";

interface PedalChangeLabelProps extends TextProps {
  stringIdx: number;
  numStrings: number;
  screenHeight: number;
  diameter: number;
  NUT_WIDTH: number;
  label: string;
}

export const PedalChangeLabel = ({
  stringIdx,
  numStrings,
  screenHeight,
  diameter,
  NUT_WIDTH,
  label,
  pointerEvents,
  ...props
}: PedalChangeLabelProps) => {
  const top = (numStrings - stringIdx) * ((1.08 * screenHeight) / (numStrings + 1)) - 0.065 * screenHeight;

  return (
    <Text
      key={`pchange-${stringIdx}`}
      style={{
        position: "absolute",
        left: 2,
        top: top - diameter * 0.4,
        width: NUT_WIDTH - 2,
        fontSize: NUT_WIDTH * 0.5,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      }}
      pointerEvents={pointerEvents}
      {...props}
    >
      {label}
    </Text>
  );
};
