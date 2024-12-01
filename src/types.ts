// types.ts
export interface CoreStory {
  setting: {
    location: string;
    time_period: string;
    specific_time: string;
  };
  victim: {
    name: string;
    occupation: string;
    reason_targeted: string;
  };
  murderer: {
    name: string;
    occupation: string;
    motive: string;
  };
  murder_method: {
    weapon: string;
    circumstances: string;
  };
  key_twist: string;
}

export interface Character {
  name: string;
  occupation: string;
  connection_to_victim: string;
  potential_motive: string;
  secret: string;
  alibi: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
  characters_involved: string[];
  location: string;
  significance: string;
}

export interface EvidenceConnection {
  evidence_a: string;
  evidence_b: string;
  connection_type: string;
  revelation: string;
}

// types/investigation.ts

// Basic evidence types
export type EvidenceType =
  | "physical"
  | "documentary"
  | "testimonial"
  | "digital"
  | "forensic"
  | "observation";

// Locations where things can be found/investigated
export type LocationType =
  | "crime_scene"
  | "suspect_location"
  | "witness_location"
  | "laboratory"
  | "public_space"
  | "hidden_area";

// Different ways to interact with evidence/locations
export type InteractionType =
  | "examine"
  | "interview"
  | "analyze"
  | "search"
  | "combine"
  | "compare";

// Requirements to unlock a node
export interface UnlockRequirement {
  type: "evidence" | "location" | "interview" | "skill" | "item" | "knowledge";
  id: string;
  condition?: string; // Optional condition that must be met
}

// What gets revealed when a node is discovered
export interface Discovery {
  type: "evidence" | "location" | "suspect" | "motive" | "connection" | "fact";
  id: string;
  description: string;
  significance: string;
  reveals_ids: string[]; // IDs of nodes this discovery makes available
}

// Individual pieces of evidence
export interface Evidence {
  id: string;
  name: string;
  type: "physical" | "documentary" | "testimonial" | "digital" | "forensic";
  location_id: string;
  description: string;
  initial_interpretation: string;
  true_significance: string;
  requires_discovery: string[]; // IDs of evidence needed before this is meaningful
  reveals: string[]; // IDs of evidence/locations this unlocks
}

// Interview responses and dialogue
export interface DialogueOption {
  id: string;
  text: string;
  requires: UnlockRequirement[];
  reveals: Discovery[];
  follow_ups: string[]; // IDs of follow-up dialogue options
}

// Character interviews
export interface Interview {
  id: string;
  character_id: string;
  location_id: string;
  initial_dialogue: DialogueOption[];
  available_topics: {
    [topic: string]: {
      requires: UnlockRequirement[];
      dialogue: DialogueOption[];
    };
  };
  demeanor: string;
  lying_about: string[];
  knows_about: string[]; // Evidence/fact IDs this character knows about
}

export interface CharacterKnowledge {
  character_id: string;
  knows_about: string[]; // IDs of evidence/events they know about
  lying_about: string[]; // IDs of evidence/events they're deceptive about
  initial_dialogue: string;
  topics: {
    id: string;
    trigger_evidence: string[]; // Evidence IDs needed to unlock topic
    response: string;
    reveals: string[]; // IDs of new evidence/knowledge this reveals
  }[];
}

// Locations that can be investigated
export interface Location {
  id: string;
  name: string;
  description: string;
  connected_locations: string[]; // IDs of connected locations
  initial_state: string; // e.g. "locked", "public", "guarded"
  available_evidence_types: string[]; // e.g. "physical", "documentary", "digital"
  access_requirements: string[]; // e.g. "key", "permission", "distraction"
}

// Player's investigation state
export interface InvestigationState {
  discovered_evidence: Set<string>;
  interviewed_characters: Set<string>;
  visited_locations: Set<string>;
  known_facts: Set<string>;
  current_theories: {
    [theory_id: string]: {
      supporting_evidence: string[];
      contradicting_evidence: string[];
      confidence: number;
    };
  };
  available_actions: {
    locations: string[];
    interviews: string[];
    evidence_to_examine: string[];
  };
}

// Complete mystery data structure
export interface MysteryData {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3;

  // Core story elements
  victim: {
    id: string;
    name: string;
    background: string;
  };

  murderer: {
    id: string;
    name: string;
    motive: string;
  };

  // Investigation elements
  locations: { [id: string]: Location };
  evidence: { [id: string]: Evidence };
  interviews: { [id: string]: Interview };
  characters: { [id: string]: Character };

  // Solution requirements
  required_discoveries: string[];
  solution_path: {
    key_revelations: string[];
    required_evidence: string[];
    required_deductions: string[];
  };

  // Optional helper data
  hints: {
    [hint_id: string]: {
      trigger_condition: UnlockRequirement[];
      text: string;
      reveals: string[];
    };
  };

  // Red herrings and false leads
  red_herrings: {
    [red_herring_id: string]: {
      evidence_ids: string[];
      why_misleading: string;
      how_disproven: string[];
    };
  };
}

// Example usage in a game state manager
export interface GameState {
  mystery: MysteryData;
  investigation: InvestigationState;
  current_location: string;
  inventory: string[];
  notes: {
    [evidence_id: string]: string;
  };
  timeline: {
    [time: string]: {
      events: string[];
      characters_involved: string[];
      locations: string[];
    };
  };
}

export interface Solution {
  required_discoveries: string[]; // Evidence IDs that must be found
  key_revelations: [
    {
      id: string;
      requires_evidence: string[]; // Evidence IDs needed for this revelation
      revelation: string;
      leads_to: string[]; // IDs of new evidence/locations this unlocks
    }
  ];
  valid_solution_paths: string[][]; // Arrays of evidence/revelation IDs that prove the solution
  minimum_evidence_required: string[]; // The minimal set of evidence needed to accuse correctly
}
