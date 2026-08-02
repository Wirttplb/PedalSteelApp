import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Pedal } from "../fretboardEngine/pedal";
import { CopedantProfile, PROFILES_STORAGE_KEY, ProfileContextType } from "./profiles";

function pedalToJSON(pedal: Pedal) {
  return {
    name: pedal.name,
    physicalName: pedal.physicalName,
    changes: pedal.changes,
  };
}

function pedalFromJSON(data: { name: string; physicalName: string; changes: [number, number][] }): Pedal {
  const p = new Pedal();
  p.name = data.name;
  p.physicalName = data.physicalName as Pedal["physicalName"];
  p.changes = data.changes;
  return p;
}

function profileToJSON(profile: CopedantProfile) {
  return {
    name: profile.name,
    pedals: profile.pedals.map(pedalToJSON),
  };
}

function profileFromJSON(data: { name: string; pedals: ReturnType<typeof pedalToJSON>[] }): CopedantProfile {
  return {
    name: data.name,
    pedals: data.pedals.map(pedalFromJSON),
  };
}

export function useProfiles(): ProfileContextType {
  const [profiles, setProfiles] = useState<CopedantProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<string | null>(null);

  // Load profiles from storage
  const loadProfiles = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          setProfiles(parsed.map(profileFromJSON));
        }
      }
    } catch (e) {
      console.error("Failed to load profiles:", e);
    }
  }, []);

  // Save profiles to storage
  const saveProfiles = useCallback(async (newProfiles: CopedantProfile[]) => {
    try {
      await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles.map(profileToJSON)));
      setProfiles(newProfiles);
    } catch (e) {
      console.error("Failed to save profiles:", e);
    }
  }, []);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const saveProfile = useCallback(
    async (name: string, pedals: Pedal[]) => {
      const trimmedName = name.trim();
      if (!trimmedName) return;

      const newProfile: CopedantProfile = {
        name: trimmedName,
        pedals: [...pedals],
      };

      const profileExists = profiles.some((p) => p.name === trimmedName);
      const updatedProfiles = profiles.map((p) => (p.name === trimmedName ? newProfile : p));
      const finalProfiles = profileExists ? updatedProfiles : [...updatedProfiles, newProfile];
      await saveProfiles(finalProfiles);
      setCurrentProfile(trimmedName);
    },
    [profiles, saveProfiles],
  );

  const loadProfile = useCallback(
    (profileName: string): CopedantProfile | undefined => {
      return profiles.find((p) => p.name === profileName);
    },
    [profiles],
  );

  const deleteProfile = useCallback(
    async (profileName: string) => {
      const updatedProfiles = profiles.filter((p) => p.name !== profileName);
      await saveProfiles(updatedProfiles);
      if (currentProfile === profileName) {
        setCurrentProfile(null);
      }
    },
    [profiles, saveProfiles, currentProfile],
  );

  return {
    profiles,
    currentProfile,
    setCurrentProfile,
    saveProfile,
    loadProfile,
    deleteProfile,
  };
}
