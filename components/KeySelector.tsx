import React from "react";
import { StyleSheet, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useKey } from "../app/keyContext";

export default function KeySelector() {
  const { selectedKey, setSelectedKey } = useKey();

  return (
    <View style={styles.dropdownWrapper}>
      <RNPickerSelect
        placeholder={{}}
        useNativeAndroidPickerStyle={false}
        onValueChange={(itemValue) => setSelectedKey(itemValue)}
        items={[
          { label: "C", value: "C" },
          { label: "C#", value: "C#" },
          { label: "D", value: "D" },
          { label: "D#", value: "D#" },
          { label: "E", value: "E" },
          { label: "F", value: "F" },
          { label: "F#", value: "F#" },
          { label: "G", value: "G" },
          { label: "G#", value: "G#" },
          { label: "A", value: "A" },
          { label: "A#", value: "A#" },
          { label: "B", value: "B" },
        ]}
        value={selectedKey}
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
