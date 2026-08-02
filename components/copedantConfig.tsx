import React, { useMemo, useRef, useState } from "react";
import type { ViewStyle } from "react-native";
import { PanResponder, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { buildInitialPedals, useKey } from "../appContext/keyContext";
import { Pedal, PHYSICAL_PEDALS, PhysicalPedal } from "../fretboardEngine/pedal";
import { getStringNames } from "../fretboardEngine/tuningUtils";
import ProfileManager from "./ProfileManager";

const COLUMN_WIDTH = 60;

const PHYSICAL_PEDAL_ITEMS = PHYSICAL_PEDALS.map((p) => ({ label: p, value: p }));

export default function CopedantConfig() {
  const { tuning, pedals, setPedals, profiles, currentProfile, saveProfile, loadProfile, deleteProfile } = useKey();
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const draggingRef = useRef<number | null>(null);
  const dropRef = useRef<number | null>(null);
  const pedalsRef = useRef(pedals);
  pedalsRef.current = pedals;
  const pedalsLenRef = useRef(pedals.length);
  pedalsLenRef.current = pedals.length;

  const handleRemovePedal = (colIdx: number) => {
    setPedals(pedals.filter((_, i) => i !== colIdx));
  };

  const handleAddPedal = () => {
    const newP = new Pedal();
    newP.name = "New";
    newP.physicalName = "A";
    newP.changes = [];
    setPedals([...pedals, newP]);
  };

  const handleResetToDefault = () => {
    setPedals(buildInitialPedals());
  };

  const handleRename = (colIdx: number, newName: string) => {
    setPedals(
      pedals.map((p, i) => {
        if (i !== colIdx) return p;
        const newP = new Pedal();
        newP.name = newName;
        newP.physicalName = p.physicalName;
        newP.changes = [...p.changes];
        return newP;
      }),
    );
  };

  const handlePhysicalChange = (colIdx: number, newPhysicalName: PhysicalPedal) => {
    setPedals(
      pedals.map((p, i) => {
        if (i !== colIdx) return p;
        const newP = new Pedal();
        newP.name = p.name;
        newP.physicalName = newPhysicalName;
        newP.changes = p.changes;
        return newP;
      }),
    );
  };

  const handlePedalChange = (colIdx: number, stringIdx: number, semitones: number) => {
    setPedals(
      pedals.map((p, i) => {
        if (i !== colIdx) return p;
        const newP = new Pedal();
        newP.name = p.name;
        newP.physicalName = p.physicalName;
        const changes = [...p.changes];
        const existingIdx = changes.findIndex((c) => c[0] === stringIdx);
        if (semitones === 0) {
          if (existingIdx !== -1) changes.splice(existingIdx, 1);
        } else {
          if (existingIdx !== -1) changes[existingIdx] = [stringIdx, semitones];
          else changes.push([stringIdx, semitones]);
        }
        newP.changes = changes;
        return newP;
      }),
    );
  };

  const panResponders = useMemo(
    () =>
      Array.from({ length: pedals.length }, (_, colIdx) =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            draggingRef.current = colIdx;
            dropRef.current = colIdx;
            setDraggingIdx(colIdx);
            setDropIdx(colIdx);
          },
          onPanResponderMove: (_, { dx }) => {
            const colsMoved = Math.round(dx / COLUMN_WIDTH);
            const target = Math.max(0, Math.min(pedalsLenRef.current - 1, colIdx + colsMoved));
            dropRef.current = target;
            setDropIdx(target);
          },
          onPanResponderRelease: () => {
            const from = draggingRef.current;
            const to = dropRef.current;
            if (from !== null && to !== null && from !== to) {
              const next = [...pedalsRef.current];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              setPedals(next);
            }
            draggingRef.current = null;
            dropRef.current = null;
            setDraggingIdx(null);
            setDropIdx(null);
          },
          onPanResponderTerminate: () => {
            draggingRef.current = null;
            dropRef.current = null;
            setDraggingIdx(null);
            setDropIdx(null);
          },
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pedals.length],
  );

  // Get string names for the current tuning (ordered from lowest to highest)
  // We need to reverse for display (highest to lowest)
  const stringNames = getStringNames(tuning).slice().reverse();
  const stringCount = stringNames.length;

  if (stringCount === 0) return null;

  return (
    <View style={styles.pedalConfigSection}>
      <Text style={styles.currentProfileName}>{currentProfile ? currentProfile : "—"}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.table}>
          {/* Fixed string label column */}
          <View key="string-labels" style={styles.column}>
            <View key="lbl-drag" style={[styles.cell, styles.stringLabelCell]} />
            <View key="lbl-name" style={[styles.cell, styles.stringLabelCell]} />
            <View key="lbl-physical" style={[styles.cell, styles.stringLabelCell]} />
            {stringNames.map((noteName, rowIdx) => (
              <View key={`lbl-${rowIdx}`} style={[styles.cell, styles.stringLabelCell]}>
                <Text style={styles.stringLabel}>
                  {rowIdx + 1 + " "}
                  {noteName}
                </Text>
              </View>
            ))}
            <View key="lbl-delete" style={[styles.cell, styles.stringLabelCell]} />
          </View>

          {/* Pedal columns */}
          {pedals.map((pedal, colIdx) => (
            <View
              key={`col-${colIdx}`}
              style={[
                styles.column,
                draggingIdx === colIdx && styles.columnDragging,
                dropIdx === colIdx && draggingIdx !== colIdx && styles.columnDropTarget,
              ]}
            >
              {/* Drag handle */}
              <View key="drag" style={[styles.cell, styles.dragHandle]} {...panResponders[colIdx]?.panHandlers}>
                <Text style={styles.dragHandleIcon}>⠿</Text>
              </View>

              {/* Editable name */}
              <View key="name" style={styles.cell}>
                <TextInput
                  style={styles.pedalLabelInput}
                  value={pedal.name}
                  onChangeText={(text) => handleRename(colIdx, text)}
                />
              </View>

              {/* Physical pedal/lever selector */}
              <View key="physical" style={styles.cell}>
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={(val) => handlePhysicalChange(colIdx, val as PhysicalPedal)}
                  items={PHYSICAL_PEDAL_ITEMS}
                  value={pedal.physicalName}
                  style={smallPickerStyles}
                  useNativeAndroidPickerStyle={false}
                />
              </View>

              {/* String pickers */}
              {stringNames.map((_, rowIdx) => {
                // stringNames is reversed (highest to lowest), but pedal changes use index from lowest (0) to highest
                const stringIndex = stringCount - 1 - rowIdx;
                const change = pedal.changes.find((c) => c[0] === stringIndex);
                const value = change ? change[1] : 0;
                return (
                  <View key={`row-${stringIndex}`} style={styles.cell}>
                    <RNPickerSelect
                      placeholder={{}}
                      onValueChange={(val) => handlePedalChange(colIdx, stringIndex, val)}
                      items={[
                        { label: "+2", value: 2 },
                        { label: "+1", value: 1 },
                        { label: "0", value: 0 },
                        { label: "-1", value: -1 },
                        { label: "-2", value: -2 },
                      ]}
                      value={value}
                      style={value === 0 ? smallPickerStylesZero : smallPickerStyles}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                );
              })}

              {/* Delete button */}
              <Pressable
                key="delete"
                style={[styles.cell, styles.deleteCell]}
                onPress={() => handleRemovePedal(colIdx)}
              >
                <Text style={styles.removeButton}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonRow}>
        <Pressable style={styles.addPedalButton} onPress={handleAddPedal}>
          <Text style={styles.addPedalButtonText}>+ Add Pedal</Text>
        </Pressable>
        <Pressable style={styles.resetButton} onPress={handleResetToDefault}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>

      <ProfileManager
        profiles={profiles}
        onSaveProfile={saveProfile}
        onLoadProfile={loadProfile}
        onDeleteProfile={deleteProfile}
      />
    </View>
  );
}

const smallPickerStyles = {
  inputIOS: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
  inputAndroid: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
};

const smallPickerStylesZero = {
  inputIOS: { fontSize: 16, color: "rgba(255,255,255,0.5)", padding: 5, minWidth: 40 },
  inputAndroid: { fontSize: 16, color: "rgba(255,255,255,0.5)", padding: 5, minWidth: 40 },
};

const styles = StyleSheet.create({
  pedalConfigSection: {
    marginTop: 0,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.0)",
    borderRadius: 10,
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  table: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  columnDragging: {
    opacity: 0.4,
  },
  columnDropTarget: {
    backgroundColor: "rgba(250, 153, 15, 0.15)",
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
  dragHandle: {
    backgroundColor: "rgba(255,255,255,0.05)",
  } as ViewStyle,
  dragHandleIcon: {
    color: "#888",
    fontSize: 18,
    letterSpacing: -2,
  },
  deleteCell: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  removeButton: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "bold",
  },
  addPedalButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(116, 116, 116, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  addPedalButtonText: {
    color: "white",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 0,
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#ac8957",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fa990f",
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
  },
  pedalLabelInput: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    width: 56,
  },
  stringLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  stringNoteLabel: {
    color: "rgba(250, 153, 15, 0.8)",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: -2,
  },
  currentProfileName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    fontStyle: "italic",
  },
});
