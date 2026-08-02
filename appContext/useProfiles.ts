import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllFactoryProfiles, isFactoryProfile } from "../fretboardEngine/factoryProfiles";
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

  // Load factory profiles
  const factoryProfiles = useMemo(() => getAllFactoryProfiles(), []);

  // Combine user profiles with factory profiles
  const allProfiles = useMemo(() => [...factoryProfiles, ...profiles], [factoryProfiles, profiles]);

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

      // Prevent overwriting factory profiles
      if (isFactoryProfile(trimmedName)) {
        console.warn(`Cannot overwrite factory profile: ${trimmedName}`);
        return;
      }

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
      // Check factory profiles first
      const factoryProfile = factoryProfiles.find((p) => p.name === profileName);
      if (factoryProfile) {
        return { name: factoryProfile.name, pedals: factoryProfile.pedals };
      }
      // Then check user profiles
      return profiles.find((p) => p.name === profileName);
    },
    [profiles, factoryProfiles],
  );

  const deleteProfile = useCallback(
    async (profileName: string) => {
      // Prevent deleting factory profiles
      if (isFactoryProfile(profileName)) {
        console.warn(`Cannot delete factory profile: ${profileName}`);
        return;
      }

      const updatedProfiles = profiles.filter((p) => p.name !== profileName);
      await saveProfiles(updatedProfiles);
      if (currentProfile === profileName) {
        setCurrentProfile(null);
      }
    },
    [profiles, saveProfiles, currentProfile],
  );

  return {
    profiles: allProfiles,
    currentProfile,
    setCurrentProfile,
    saveProfile,
    loadProfile,
    deleteProfile,
  };
}
