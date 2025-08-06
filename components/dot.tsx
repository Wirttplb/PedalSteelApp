import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface InlayDotProps {
  left: number;
  top: number;
  diameter: number;
}

export default function InlayDot({ left, top, diameter }: InlayDotProps) {

  const screenWidth = Dimensions.get('window').width;
//   const radius = screenWidth / 70;
//   const diameter = radius * 2;
    const radius = diameter / 2;

  return (
    <View style={[
        styles.dot,
        {
            left,
            top,
            width: diameter,
            height: diameter,
            borderRadius: radius*3,
        }]} />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    backgroundColor: '#383530',
    opacity: 0.8,
  },
});