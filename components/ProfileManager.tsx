import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { CopedantProfile } from "../app/profiles";

interface ProfileManagerProps {
  profiles: CopedantProfile[];
  onSaveProfile: (name: string) => Promise<void>;
  onLoadProfile: (profileName: string) => Promise<void>;
  onDeleteProfile: (profileName: string) => Promise<void>;
}

const smallPickerStyles = {
  inputIOS: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
  inputAndroid: { fontSize: 16, color: "#fa990f", padding: 5, minWidth: 40 },
};

export default function ProfileManager({
  profiles,
  onSaveProfile,
  onLoadProfile,
  onDeleteProfile,
}: ProfileManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"save" | "load" | "delete" | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const handleSave = async () => {
    const name = nameInput.trim();
    if (!name) {
      Alert.alert("Error", "Please enter a profile name");
      return;
    }
    await onSaveProfile(name);
    closeModal();
  };

  const handleLoad = async () => {
    if (!selectedProfile) {
      Alert.alert("Error", "Please select a profile to load");
      return;
    }
    await onLoadProfile(selectedProfile);
    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedProfile) return;
    await onDeleteProfile(selectedProfile);
    closeModal();
  };

  const openSaveModal = () => {
    setAction("save");
    setNameInput("");
    setShowModal(true);
  };

  const openLoadModal = () => {
    if (profiles.length === 0) {
      Alert.alert("No Profiles", "No saved profiles to load");
      return;
    }
    setAction("load");
    setSelectedProfile(profiles[0].name);
    setShowModal(true);
  };

  const openDeleteModal = () => {
    if (profiles.length === 0) {
      Alert.alert("No Profiles", "No saved profiles to delete");
      return;
    }
    setAction("delete");
    setSelectedProfile(profiles[0].name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAction(null);
    setNameInput("");
    setSelectedProfile(null);
  };

  const getModalTitle = () => {
    switch (action) {
      case "save":
        return "Save Profile";
      case "load":
        return "Load Profile";
      case "delete":
        return "Delete Profile";
      default:
        return "";
    }
  };

  const getConfirmButtonText = () => {
    switch (action) {
      case "save":
        return "Save";
      case "load":
        return "Load";
      case "delete":
        return "Delete";
      default:
        return "OK";
    }
  };

  const renderModalContent = () => {
    if (action === "save") {
      return (
        <TextInput
          style={styles.modalInput}
          value={nameInput}
          onChangeText={setNameInput}
          placeholder="Enter profile name"
          autoFocus
        />
      );
    }

    if (action === "load" || action === "delete") {
      return (
        <View style={styles.modalPickerContainer}>
          <Text style={styles.modalPickerLabel}>
            {action === "load" ? "Select Profile:" : "Select Profile to Delete:"}
          </Text>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={(val) => setSelectedProfile(val)}
            items={profiles.map((p) => ({ label: p.name, value: p.name }))}
            value={selectedProfile || ""}
            style={smallPickerStyles}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      );
    }

    return null;
  };

  const renderConfirmHandler = () => {
    switch (action) {
      case "save":
        return handleSave;
      case "load":
        return handleLoad;
      case "delete":
        return handleDelete;
      default:
        return undefined;
    }
  };

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileButtonRow}>
        <Pressable style={styles.profileButton} onPress={openSaveModal}>
          <Text style={styles.profileButtonText}>Save Profile</Text>
        </Pressable>
        <Pressable style={styles.profileButton} onPress={openLoadModal}>
          <Text style={styles.profileButtonText}>Load Profile</Text>
        </Pressable>
        <Pressable style={styles.profileButton} onPress={openDeleteModal}>
          <Text style={styles.profileButtonText}>Delete Profile</Text>
        </Pressable>
      </View>

      {/* Profile Modal */}
      {showModal && (
        <Modal visible={showModal} animationType="fade" transparent>
          <View style={styles.modalOverlay} onStartShouldSetResponder={() => true}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              {renderModalContent()}
              <View style={styles.modalButtonRow}>
                <Pressable style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={renderConfirmHandler()}>
                  <Text style={styles.modalConfirmButtonText}>{getConfirmButtonText()}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    paddingTop: 15,
    width: "100%",
    alignItems: "center",
  },
  profileButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
    width: "30%",
  },
  profileButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(116, 116, 116, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  profileButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  profileList: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  profileListTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 5,
  },
  profileListItem: {
    color: "#fff",
    fontSize: 12,
    marginVertical: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "white",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#555",
  },
  modalPickerContainer: {
    marginBottom: 15,
  },
  modalPickerLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 5,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "rgba(116, 116, 116, 0.75)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalConfirmButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
