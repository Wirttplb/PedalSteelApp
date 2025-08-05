import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface InlayDotProps {
  left: number;
  top: number;
}

export default function InlayDot({ left, top }: InlayDotProps) {

  const screenWidth = Dimensions.get('window').width;
  const radius = screenWidth / 70;
  const diameter = radius * 2;

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
    // width: 10,
    // height: 10,
    // borderRadius: 5,
    backgroundColor: '#383530',
    opacity: 0.8,
  },
});