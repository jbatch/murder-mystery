// api.ts

import { callOpenAI } from "./openaiHelper";
import {
  CORE_STORY_PROMPT,
  CHARACTERS_PROMPT,
  TIMELINE_PROMPT,
  LOCATIONS_PROMPT,
  EVIDENCE_PROMPT,
  INTERVIEW_PROMPT,
  SOLUTION_PROMPT,
} from "./prompts";
import {
  Character,
  CharacterKnowledge,
  CoreStory,
  Evidence,
  Solution,
  TimelineEvent,
  Location,
} from "./types";

export async function generateCoreStory(
  apiKey: string,
  skipCache: boolean
): Promise<CoreStory> {
  console.log("Generating core story.");
  return callOpenAI<CoreStory>({
    apiKey,
    systemPrompt:
      "You are a mystery writer specializing in murder mysteries. You excel at creating compelling core premises that can be expanded into full stories.",
    userPrompt: CORE_STORY_PROMPT(),
    requiredFields: [
      "setting.location",
      "setting.time_period",
      "setting.specific_time",
      "victim.name",
      "victim.occupation",
      "victim.reason_targeted",
      "murderer.name",
      "murderer.occupation",
      "murderer.motive",
      "murder_method.weapon",
      "murder_method.circumstances",
      "key_twist",
    ],
    skipCache,
  });
}

export async function generateCharacters(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory
) {
  console.log("Generating characters.");
  return callOpenAI<{ characters: Character[] }>({
    apiKey,
    systemPrompt:
      "You are a character designer for murder mysteries. You excel at creating interconnected casts of characters with complex relationships and motives.",
    userPrompt: CHARACTERS_PROMPT(story),
    requiredFields: [
      "characters.0.name",
      "characters.0.occupation",
      "characters.0.connection_to_victim",
      "characters.0.potential_motive",
      "characters.0.secret",
      "characters.0.alibi",
    ],
    skipCache,
  });
}

export async function generateTimeline(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory,
  characters: { characters: Character[] }
) {
  console.log("Generating timeline.");
  return callOpenAI<{ timeline: TimelineEvent[] }>({
    apiKey,
    systemPrompt:
      "You are a mystery plot designer specializing in creating detailed, consistent timelines that account for all character movements and key events.",
    userPrompt: TIMELINE_PROMPT(story, characters),
    requiredFields: [
      "timeline.0.time",
      "timeline.0.event",
      "timeline.0.characters_involved",
      "timeline.0.location",
      "timeline.0.significance",
    ],
    skipCache,
  });
}

export async function generateLocations(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory,
  timeline: { timeline: TimelineEvent[] }
) {
  console.log("Generating locations.");
  return callOpenAI<{ locations: Location[] }>({
    apiKey,
    systemPrompt:
      "You are a mystery location designer. You excel at creating interconnected spaces that support investigation and discovery.",
    userPrompt: LOCATIONS_PROMPT(story, timeline.timeline),
    requiredFields: [
      "locations.0.id",
      "locations.0.name",
      "locations.0.description",
      "locations.0.connected_locations",
      "locations.0.initial_state",
      "locations.0.available_evidence_types",
      "locations.0.access_requirements",
    ],
    skipCache,
  });
}

export async function generateEvidence(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory,
  timeline: { timeline: TimelineEvent[] },
  locations: { locations: Location[] }
) {
  console.log("Generating evidence.");
  return callOpenAI<{ evidence: Evidence[] }>({
    apiKey,
    systemPrompt:
      "You are a forensics expert and mystery designer. You excel at creating networks of evidence that form a solvable trail.",
    userPrompt: EVIDENCE_PROMPT(story, timeline.timeline, locations.locations),
    requiredFields: [
      "evidence.0.id",
      "evidence.0.name",
      "evidence.0.type",
      "evidence.0.location_id",
      "evidence.0.description",
      "evidence.0.initial_interpretation",
      "evidence.0.true_significance",
      "evidence.0.requires_discovery",
      "evidence.0.reveals",
    ],
    skipCache,
  });
}

export async function generateInterviews(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory,
  characters: { characters: Character[] },
  evidence: { evidence: Evidence[] }
) {
  console.log("Generating interviews.");
  return callOpenAI<{ character_knowledge: CharacterKnowledge[] }>({
    apiKey,
    systemPrompt:
      "You are an expert in creating complex character interactions and dialogue trees for mysteries.",
    userPrompt: INTERVIEW_PROMPT(
      story,
      characters.characters,
      evidence.evidence
    ),
    requiredFields: [
      "character_knowledge.0.character_id",
      "character_knowledge.0.knows_about",
      "character_knowledge.0.lying_about",
      "character_knowledge.0.initial_dialogue",
      "character_knowledge.0.topics",
    ],
    skipCache,
  });
}

export async function generateSolution(
  apiKey: string,
  skipCache: boolean,
  story: CoreStory,
  evidence: { evidence: Evidence[] },
  interviews: { character_knowledge: CharacterKnowledge[] }
) {
  console.log("Generating solution.");
  return callOpenAI<{ solution: Solution }>({
    apiKey,
    systemPrompt:
      "You are a mystery puzzle designer who excels at creating satisfying solution paths that require both evidence and deduction.",
    userPrompt: SOLUTION_PROMPT(
      story,
      evidence.evidence,
      interviews.character_knowledge
    ),
    requiredFields: [
      "solution.required_discoveries",
      "solution.key_revelations",
      "solution.valid_solution_paths",
      "solution.minimum_evidence_required",
    ],
    skipCache,
  });
}

// Update main generation function
export const generateMystery = async (apiKey: string, skipCache: boolean) => {
  const story = await generateCoreStory(apiKey, skipCache);
  const characters = await generateCharacters(apiKey, skipCache, story);
  const timeline = await generateTimeline(apiKey, skipCache, story, characters);
  const locations = await generateLocations(apiKey, skipCache, story, timeline);
  const evidence = await generateEvidence(
    apiKey,
    skipCache,
    story,
    timeline,
    locations
  );
  const interviews = await generateInterviews(
    apiKey,
    skipCache,
    story,
    characters,
    evidence
  );
  const solution = await generateSolution(
    apiKey,
    skipCache,
    story,
    evidence,
    interviews
  );

  return {
    story,
    characters: characters.characters,
    timeline: timeline.timeline,
    locations: locations.locations,
    evidence: evidence.evidence,
    interviews: interviews.character_knowledge,
    solution: solution.solution,
  };
};
