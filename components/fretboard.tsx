import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Fret from '../components/fret';
import InlayDot from './dot';

const NUM_FRETS = 12; // + 1
const NUT_WIDTH = '4.3%';

const Fretboard = () => {

    // Calculate fret positions based on screen width
    const screenWidth = Dimensions.get('window').width;
    const fretOffset = screenWidth / 17;
    const fretSpacing = screenWidth  / (NUM_FRETS + 1);
    const frets = Array.from({ length: NUM_FRETS }, (_, index) => (
    <Fret key={index} left={index * fretSpacing + 2 * fretOffset}/>
  ));

    // Inlay dots
    const screenHeight = Dimensions.get('window').height;
    const inlayFrets = [3, 5, 7, 9, 12];
    const dotTop = 0.5 * screenHeight;

    const dots = inlayFrets.map((fret, index) => {
        // Position between frets
        // const left = (fret  )* fretSpacing + fretOffset - fretSpacing / 2;
        const left =  (fret - 0.1)* fretSpacing;

        // For double dots on 12th, 24th fret
        const isDouble = fret % 12 === 0;

        if (isDouble) {
            return (
            <React.Fragment key={fret}>
                <InlayDot left={left} top={screenHeight / 3} />
                <InlayDot left={left} top={2 * screenHeight / 3} />
            </React.Fragment>
            );
        } else {
            return <InlayDot key={fret} left={left} top={dotTop} />;
        }
    });

    // Add everything
  return (
    <View style={styles.container}>
        <View style={styles.neck} />
        <View style={styles.nut} />
        <View style={styles.nutLine} />
        {frets}
        {dots}
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
    width: '100%',
    height: '100%',
    backgroundColor: '#25292e',
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    },
  neck: {
    width: '100%',
    height: '100%',
    backgroundColor: '#a57a39',
    justifyContent: 'center',
    alignItems: 'center',
    },
  nut:{
    position: 'absolute',
    width: NUT_WIDTH,
    height: '100%',
    left: 0,
    backgroundColor: '#211f1d',
  },
  nutLine:{
    position: 'absolute',
    width: '0.4%',
    height: '100%',
    left: NUT_WIDTH,
    backgroundColor: '#686868',
  },
  fret:
  {
    position: 'absolute',
  }
});

export default Fretboard;