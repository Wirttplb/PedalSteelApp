import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface InlayDotProps extends ViewProps {
  left: number;
  top: number;
  diameter: number;
}

export default function InlayDot({ left, top, diameter, pointerEvents, ...props }: InlayDotProps) {
  const radius = diameter / 2;

  return (
    <View
      style={[
        styles.dot,
        {
          left,
          top,
          width: diameter,
          height: diameter,
          borderRadius: radius * 3,
        },
      ]}
      pointerEvents={pointerEvents}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    backgroundColor: "#383530",
    opacity: 0.8,
  },
});
