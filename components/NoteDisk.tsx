import React from "react";
import { Text, View } from "react-native";

interface NoteDiskProps {
  left: number;
  top: number;
  diameter: number;
  interval: string;
  colorCode: boolean;
  stringTotalChange: number;
  chordMode: string;
  getIntervalColor: (interval: string, colorCode: boolean) => string;
  showPedalChangeLabels?: boolean;
}

export const NoteDisk = ({
  left,
  top,
  diameter,
  interval,
  colorCode,
  stringTotalChange,
  chordMode,
  getIntervalColor,
  showPedalChangeLabels = true,
}: NoteDiskProps) => {
  const displayInterval = interval.replace(/b/g, "♭");
  const showChange = chordMode === "Chord" && stringTotalChange !== 0 && showPedalChangeLabels;
  const changeLabel = stringTotalChange > 0 ? `+${stringTotalChange}` : `${stringTotalChange}`;

  return (
    <View
      key={`note-parent-${left}-${top}`}
      style={{
        position: "absolute",
        left: left,
        top: top,
        width: diameter * 1.5,
        height: diameter * 1.5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: getIntervalColor(displayInterval, colorCode),
          shadowColor: "black",
          shadowOffset: { width: 2, height: 6 },
          shadowOpacity: 0.7,
          shadowRadius: diameter / 2,
          elevation: 5,
        }}
      ></View>
      <Text
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: diameter,
          top: -0.05 * diameter,
        }}
      >
        {displayInterval}
      </Text>
      {showChange && (
        <Text
          style={{
            position: "absolute",
            left: diameter * 0.8,
            top: -diameter * 0.2,
            fontSize: diameter * 0.7,
            color: "white",
            fontWeight: "bold",
            textShadowColor: "black",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {changeLabel}
        </Text>
      )}
    </View>
  );
};
