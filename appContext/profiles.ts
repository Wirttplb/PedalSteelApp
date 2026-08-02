import { Pedal } from "../fretboardEngine/pedal";

export const PROFILES_STORAGE_KEY = "pedalsteel_copedant_profiles";

export interface CopedantProfile {
  name: string;
  pedals: Pedal[];
}

export interface ProfileContextType {
  profiles: CopedantProfile[];
  currentProfile: string | null;
  setCurrentProfile: (name: string | null) => void;
  saveProfile: (name: string, pedals: Pedal[]) => Promise<void>;
  loadProfile: (profileName: string) => CopedantProfile | undefined;
  deleteProfile: (profileName: string) => Promise<void>;
}
