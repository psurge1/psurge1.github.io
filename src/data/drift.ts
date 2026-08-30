export const DRIFT_DELAYS: Record<string, number> = {
  profile: -0.8,
  education: -2.2,
  experience: -4.1,
  projects: -1.6,
  now: -5,
  reading: -3.7,
}

export const ASSEMBLY_DELAYS: Record<string, number> = {
  profile: 80,
  education: 220,
  experience: 260,
  projects: 360,
  now: 460,
  reading: 520,
}

export type DriftPattern = {
  first: [number, number]
  second: [number, number]
  third: [number, number]
}

export const DRIFT_PATTERNS: Record<string, DriftPattern> = {
  profile: {
    first: [4, -4],
    second: [1, -8],
    third: [-3, -5],
  },
  education: {
    first: [-3, -5],
    second: [-5, -1],
    third: [2, -7],
  },
  experience: {
    first: [5, -2],
    second: [-2, -6],
    third: [-4, -1],
  },
  projects: {
    first: [1, -6],
    second: [4, -2],
    third: [-3, -7],
  },
  now: {
    first: [-4, -3],
    second: [1, -7],
    third: [5, -4],
  },
  reading: {
    first: [3, -5],
    second: [-2, -2],
    third: [-4, -6],
  },
}
