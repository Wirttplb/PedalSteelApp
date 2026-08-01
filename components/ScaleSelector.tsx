import React from "react";
import { StyleSheet, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useKey } from "../app/keyContext";

export default function ScaleSelector() {
  const { selectedMode, setSelectedMode } = useKey();

  return (
    <View style={styles.dropdownWrapper}>
      <RNPickerSelect
        placeholder={{}}
        useNativeAndroidPickerStyle={false}
        onValueChange={(itemValue) => setSelectedMode(itemValue)}
        items={[
          { label: "Major", value: "Major" },
          { label: "Minor", value: "Minor" },
          { label: "Major Pentatonic", value: "Major Pentatonic" },
          { label: "Minor Pentatonic", value: "Minor Pentatonic" },
          { label: "Dorian", value: "Dorian" },
          { label: "Phrygian", value: "Phrygian" },
          { label: "Lydian", value: "Lydian" },
          { label: "Mixolydian", value: "Mixolydian" },
          { label: "Aeolian", value: "Aeolian" },
          { label: "Locrian", value: "Locrian" },
          { label: "Diminished Seventh", value: "Diminished Seventh" },
          { label: "Augmented", value: "Augmented" },
          { label: "Whole-tone", value: "Whole-tone" },
          { label: "Chromatic", value: "Chromatic" },
        ]}
        value={selectedMode}
        style={pickerStyles}
      />
    </View>
  );
}

const pickerStyles = {
  inputIOS: { fontSize: 16, color: "white", padding: 8 },
  inputAndroid: { fontSize: 16, color: "white", padding: 8 },
};

const styles = StyleSheet.create({
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "#333",
    minWidth: 100,
  },
});
