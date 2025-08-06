import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Fret from '../components/fret';
import InlayDot from './dot';

const NUM_FRETS = 12; // + 1
const NUT_WIDTH = '4.3%';
const NUM_STRINGS = 10;

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
        const diameter = 2 * screenWidth / 70;

        // For double dots on 12th, 24th fret
        const isDouble = fret % 12 === 0;

        if (isDouble) {
            return (
            <React.Fragment key={fret}>
                <InlayDot left={left} top={screenHeight / 3 - diameter/2} diameter={diameter} />
                <InlayDot left={left} top={2 * screenHeight / 3 - diameter/2} diameter={diameter}/>
            </React.Fragment>
            );
        } else {
            return <InlayDot key={fret} left={left} top={dotTop-diameter/2} diameter={diameter}/>;
        }
    });

    // Strings (horizontal lines)
    const strings = Array.from({ length: NUM_STRINGS }, (_, index) => {
        const top = (index + 1) * (1.08 * screenHeight / (NUM_STRINGS + 1)) - 0.04 * screenHeight;
        let height = screenHeight / 150;
        if (index < 0.3 * NUM_STRINGS){ height*=3/5 } 
        else if (index < 0.5 * NUM_STRINGS){ height*=4/5 } 
        return (
            <View key={`string-${index}`} style={{
                position: 'absolute',
                width: '100%',
                top }}>
                <View style={[styles.string, {height: height}]} />
                <View style={[styles.stringShadow, {height: 0.3 * height, marginTop: height}]} />
            </View>
        );
    });

    // Add everything
  return (
    <View style={styles.container}>
        <View style={styles.neck} />
        <View style={styles.nut} />
        <View style={styles.nutLine} />
        {frets}
        {dots}
        {strings}
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#211f1d',
    justifyContent: 'center',
    alignItems: 'center',
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
  string: {
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: '#e2dabfff',
    },
  stringShadow: {
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: '#958963',
    },
});

export default Fretboard;