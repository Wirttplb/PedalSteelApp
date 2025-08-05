import React from 'react';
import { StyleSheet, View } from 'react-native';

interface FretProps {
  left: number
}

const Fret = ({ left }: FretProps) => {
  return (
    <View style={[styles.container, { left }]}>
        <View style={styles.fretLine} />
        <View style={styles.shadowLine} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    height: '100%',
    width: '1%'
  },
  fretLine: {
    width: '60%',
    backgroundColor: '#d7d6d6', // light silver
  },
  shadowLine: {
    width: '40%',
    marginLeft: 0,
    backgroundColor: '#686868', // darker shadow color
  },
});

export default Fret;