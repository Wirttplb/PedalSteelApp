import React from "react";
import { StyleSheet, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { pickerStyles } from "./pickerStyles";

interface SelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  style?: any;
  wrapperStyle?: any;
}

export default function BaseSelector({ value, onValueChange, items, style, wrapperStyle }: SelectorProps) {
  // Merge pickerStyles with custom style
  const mergedStyle = { ...pickerStyles, ...style };

  return (
    <View style={[styles.dropdownWrapper, wrapperStyle]}>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        onValueChange={onValueChange}
        items={items}
        value={value}
        style={mergedStyle}
        placeholder={{}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
    backgroundColor: "#333",
    minWidth: 100,
  },
});
