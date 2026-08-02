import { Pedal } from "./pedal";

/**
 * Factory profiles that cannot be deleted by the user.
 * These are built-in profiles that ship with the app.
 */

export interface FactoryProfile {
  name: string;
  pedals: Pedal[];
}

// Romain E9 Copedant Setup
export function createRomainE9Profile(): Pedal[] {
  const pedals: Pedal[] = [];

  // Pedal 1 (A)
  const ped1 = new Pedal();
  ped1.name = "A";
  ped1.physicalName = "A";
  ped1.changes = [
    [0, 2],
    [5, 2],
  ];
  pedals.push(ped1);

  // A/2
  const ped1_2 = new Pedal();
  ped1_2.name = "A/2";
  ped1_2.physicalName = "A";
  ped1_2.changes = [
    [0, 1],
    [5, 1],
  ];
  pedals.push(ped1_2);

  // Pedal 2 (B)
  const ped2 = new Pedal();
  ped2.name = "B";
  ped2.physicalName = "B";
  ped2.changes = [
    [4, 2],
    [7, 2],
  ];
  pedals.push(ped2);

  // C Pedal (standard)
  const cPedal = new Pedal();
  cPedal.name = "C";
  cPedal.physicalName = "C";
  cPedal.changes = [
    [5, 2],
    [6, 2],
  ];
  pedals.push(cPedal);

  // D lever (standard - lowers string 1 by 1, string 8 by 2)
  const lklPedal = new Pedal();
  lklPedal.name = "D";
  lklPedal.physicalName = "LKL";
  lklPedal.changes = [
    [1, -1],
    [8, -2],
  ]; // Standard D lever
  pedals.push(lklPedal);

  // D/2
  const lkl2Pedal = new Pedal();
  lkl2Pedal.name = "D/2";
  lkl2Pedal.physicalName = "LKL";
  lkl2Pedal.changes = [[8, -1]];
  pedals.push(lkl2Pedal);

  // G
  const lkrPedal = new Pedal();
  lkrPedal.name = "G";
  lkrPedal.physicalName = "LKR";
  lkrPedal.changes = [
    [3, 1],
    [9, 1],
  ];
  pedals.push(lkrPedal);

  // E
  const rklPedal = new Pedal();
  rklPedal.name = "E";
  rklPedal.physicalName = "RKL";
  rklPedal.changes = [
    [2, -1],
    [6, -1],
  ];
  pedals.push(rklPedal);

  // F
  const rkrPedal = new Pedal();
  rkrPedal.name = "F";
  rkrPedal.physicalName = "RKR";
  rkrPedal.changes = [
    [2, 1],
    [6, 1],
  ];
  pedals.push(rkrPedal);

  return pedals;
}

// Buddy Emmons E9 Copedant Setup
export function createBuddyEmmonsE9Profile(): Pedal[] {
  const pedals: Pedal[] = [];

  // A Pedal (standard) - raises strings 0 & 5 by 2 semitones
  const aPedal = new Pedal();
  aPedal.name = "A";
  aPedal.physicalName = "A";
  aPedal.changes = [
    [0, 2],
    [5, 2],
  ];
  pedals.push(aPedal);

  // B Pedal (standard) - raises strings 4 & 7 by 1 semitone
  const bPedal = new Pedal();
  bPedal.name = "B";
  bPedal.physicalName = "B";
  bPedal.changes = [
    [4, 1],
    [7, 1],
  ];
  pedals.push(bPedal);

  // C Pedal (standard) - raises strings 5 & 6 by 2 semitones
  const cPedal = new Pedal();
  cPedal.name = "C";
  cPedal.physicalName = "C";
  cPedal.changes = [
    [5, 2],
    [6, 2],
  ];
  pedals.push(cPedal);

  // LKL = F lever (raise E strings - strings 3 & 6 by +1)
  const lklPedal = new Pedal();
  lklPedal.name = "LKL";
  lklPedal.physicalName = "LKL";
  lklPedal.changes = [
    [3, 1],
    [6, 1],
  ]; // Raise E strings (string 3 and 6)
  pedals.push(lklPedal);

  // LKV = lower B
  const lkvPedal = new Pedal();
  lkvPedal.name = "LKV";
  lkvPedal.physicalName = "LKV";
  lkvPedal.changes = [
    [0, -1],
    [5, -1],
  ]; // Lower B (string 0 and 5)
  pedals.push(lkvPedal);

  // LKR = E lever (lower E strings - strings 3 & 6 by -1)
  const lkrPedal = new Pedal();
  lkrPedal.name = "LKR";
  lkrPedal.physicalName = "LKR";
  lkrPedal.changes = [
    [3, -1],
    [6, -1],
  ]; // Lower E strings
  pedals.push(lkrPedal);

  // RKL = Raise 2nd string (D# to E, string 1 +1) and lower low G# to F# (string 5 -1)
  const rklPedal = new Pedal();
  rklPedal.name = "RKL";
  rklPedal.physicalName = "RKL";
  rklPedal.changes = [
    [1, 1],
    [5, -1],
  ]; // String 1: D#→E (+1), String 5: G#→F# (-1)
  pedals.push(rklPedal);

  // RKR = D lever (standard - lowers string 1 by 1, string 8 by 2)
  const rkrPedal = new Pedal();
  rkrPedal.name = "RKR";
  rkrPedal.physicalName = "RKR";
  rkrPedal.changes = [
    [1, -1],
    [8, -2],
  ]; // Standard D lever
  pedals.push(rkrPedal);

  // RKR/52 = D/2
  const rkr2Pedal = new Pedal();
  rkr2Pedal.name = "RKR/2";
  rkr2Pedal.physicalName = "RKR";
  rkr2Pedal.changes = [[8, -1]];
  pedals.push(rkr2Pedal);

  return pedals;
}

// Lloyd Green E9 Copedant Setup
export function createLloydGreenE9Profile(): Pedal[] {
  const pedals: Pedal[] = [];

  // Pedal 1 (A)
  const ped1 = new Pedal();
  ped1.name = "A";
  ped1.physicalName = "A";
  ped1.changes = [
    [0, 2],
    [5, 2],
  ];
  pedals.push(ped1);

  // Pedal 2 (B)
  const ped2 = new Pedal();
  ped2.name = "B";
  ped2.physicalName = "B";
  ped2.changes = [
    [4, 2],
    [7, 2],
  ];
  pedals.push(ped2);

  // C Pedal (standard)
  const cPedal = new Pedal();
  cPedal.name = "C";
  cPedal.physicalName = "C";
  cPedal.changes = [
    [5, 2],
    [6, 2],
  ];
  pedals.push(cPedal);

  // LKL
  const lklPedal = new Pedal();
  lklPedal.name = "LKL";
  lklPedal.physicalName = "LKL";
  lklPedal.changes = [[9, 1]];
  pedals.push(lklPedal);

  // LKR
  const lkrPedal = new Pedal();
  lkrPedal.name = "LKR";
  lkrPedal.physicalName = "LKR";
  lkrPedal.changes = [
    [2, 1],
    [6, 1],
  ];
  pedals.push(lkrPedal);

  // RKL
  const rklPedal = new Pedal();
  rklPedal.name = "RKL";
  rklPedal.physicalName = "RKL";
  rklPedal.changes = [[8, -2]];
  pedals.push(rklPedal);

  // RKL/2
  const rkl2Pedal = new Pedal();
  rkl2Pedal.name = "RKL/2";
  rkl2Pedal.physicalName = "RKL";
  rkl2Pedal.changes = [[8, -1]];
  pedals.push(rkl2Pedal);

  // RKR
  const rkrPedal = new Pedal();
  rkrPedal.name = "RKR";
  rkrPedal.physicalName = "RKR";
  rkrPedal.changes = [[2, -1]];
  pedals.push(rkrPedal);

  return pedals;
}

export const FACTORY_PROFILES: FactoryProfile[] = [
  {
    name: "Buddy Emmons E9",
    pedals: createBuddyEmmonsE9Profile(),
  },
  {
    name: "Lloyd Green E9",
    pedals: createLloydGreenE9Profile(),
  },
  {
    name: "Romain E9",
    pedals: createRomainE9Profile(),
  },
];

export function getFactoryProfileByName(name: string): FactoryProfile | undefined {
  return FACTORY_PROFILES.find((p) => p.name === name);
}

export function getAllFactoryProfiles(): FactoryProfile[] {
  return [...FACTORY_PROFILES];
}

export function isFactoryProfile(name: string): boolean {
  return FACTORY_PROFILES.some((p) => p.name === name);
}
