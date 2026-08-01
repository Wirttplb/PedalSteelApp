import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useKey } from "../app/keyContext";
import { Pedal } from "../fretboardEngine/pedal";

export default function CopedantConfig() {
  const { tuning, pedals, setPedals } = useKey();

  if (tuning !== "E9") return null;

  const handleRename = (pedalName: string, newName: string) => {
    setPedals(
      pedals.map((p) => {
        if (p.name !== pedalName) return p;
        const newP = new Pedal();
        newP.name = newName;
        newP.changes = [...p.changes];
        return newP;
      }),
    );
  };

  const handlePedalChange = (pedalName: string, stringIdx: number, semitones: number) => {
    const newPedals = pedals.map((p) => {
      if (p.name === pedalName) {
        const newP = new Pedal();
        newP.name = p.name;
        const changes = [...p.changes];
        const existingIdx = changes.findIndex((c) => c[0] === stringIdx);

        if (semitones === 0) {
          if (existingIdx !== -1) changes.splice(existingIdx, 1);
        } else {
          if (existingIdx !== -1) {
            changes[existingIdx] = [stringIdx, semitones];
          } else {
            changes.push([stringIdx, semitones]);
          }
        }
        newP.changes = changes;
        return newP;
      }
      return p;
    });
    setPedals(newPedals);
  };

  return (
    <View style={styles.pedalConfigSection}>
      <Text style={styles.sectionTitle}>Copedant Configuration</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* String label column */}
          <View style={styles.column}>
            <View style={[styles.cell, styles.stringLabelCell]} />
            {Array.from({ length: 10 }, (_, rowIdx) => 9 - rowIdx).map((i, rowIdx) => (
              <View key={i} style={[styles.cell, styles.stringLabelCell]}>
                <Text style={styles.stringLabel}>Str {rowIdx + 1}</Text>
              </View>
            ))}
          </View>

          {/* One column per pedal */}
          {pedals.map((pedal, colIdx) => (
            <View key={colIdx} style={styles.column}>
              <View style={styles.cell}>
                <TextInput
                  style={styles.pedalLabelInput}
                  value={pedal.name}
                  onChangeText={(text) => handleRename(pedal.name, text)}
                  selectTextOnFocus
                />
              </View>
              {Array.from({ length: 10 }, (_, rowIdx) => 9 - rowIdx).map((i) => {
                const change = pedal.changes.find((c) => c[0] === i);
                const value = change ? change[1] : 0;
                return (
                  <View key={i} style={styles.cell}>
                    <RNPickerSelect
                      placeholder={{ label: "0", value: 0 }}
                      onValueChange={(val) => handlePedalChange(pedal.name, i, val)}
                      items={[
                        { label: "+2", value: 2 },
                        { label: "+1", value: 1 },
                        { label: "0", value: 0 },
                        { label: "-1", value: -1 },
                        { label: "-2", value: -2 },
                      ]}
                      value={value}
                      style={smallPickerStyles}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const smallPickerStyles = {
  inputIOS: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
  inputAndroid: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
};

const styles = StyleSheet.create({
  pedalConfigSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 4,
  },
  stringLabelCell: {
    width: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  cell: {
    width: 60,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  pedalLabelInput: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    width: 56,
  },
  stringLabel: {
    color: "#aaa",
    fontSize: 12,
  },
});
