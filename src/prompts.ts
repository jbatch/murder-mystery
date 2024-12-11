import {
  CoreStory,
  TimelineEvent,
  Character,
  Evidence,
  Location,
  CharacterKnowledge,
} from "./types";

// Stage 1. Core Story
export const CORE_STORY_PROMPT =
  () => `Create a core murder mystery premise. Include:
1. The setting (time and place)
2. The victim (who they are and why they were targeted)
3. The murderer (who they are and their motive)
4. The basic method of murder
5. The key twist that makes this interesting

Format your response as a JSON object with the following structure:
{
    "setting": {
        "location": string,
        "time_period": string,
        "specific_time": string
    },
    "victim": {
        "name": string,
        "occupation": string,
        "reason_targeted": string
    },
    "murderer": {
        "name": string,
        "occupation": string,
        "motive": string
    },
    "murder_method": {
        "weapon": string,
        "circumstances": string,
        "location": string
    },
    "key_twist": string
}`;

// Stage 2. Characters
export const CHARACTERS_PROMPT = (story: CoreStory) => `Given this core mystery:
    Setting: ${story.setting.location} in ${story.setting.time_period}
    Victim: ${JSON.stringify(story.victim)}
    Murderer: ${JSON.stringify(story.murderer)}
    Murder Method: ${JSON.stringify(story.murder_method)}

    Create a cast of the murderer and 5-7 additional suspects/witnesses who would be present at the scene.
    Each character should have:
    1. A connection to the victim
    2. A potential motive for murder (even if they're innocent)
    3. A secret they're hiding (may or may not be related to the murder)
    4. Their whereabouts during the murder
    
    Format your response as a JSON array of character objects with the following structure:
    {
        "characters": [
            {
                "name": string,
                "occupation": string,
                "connection_to_victim": string,
                "potential_motive": string,
                "secret": string,
                "alibi": string
            }
        ]
    }`;

// Stage 3. Timeline
export const TIMELINE_PROMPT = (
  story: CoreStory,
  characters: { characters: Character[] }
) =>
  `Given this murder mystery:
    Setting: ${story.setting.location} in ${story.setting.time_period}
    Time of Murder: ${story.setting.specific_time}
    Victim: ${JSON.stringify(story.victim)}
    Murderer: ${JSON.stringify(story.murderer)}
    Murder Method: ${JSON.stringify(story.murder_method)}

    Create a detailed timeline of events spanning from 2 hours before to 2 hours after the murder.
    Include movements and actions for:
    1. The victim's final hours
    2. The murderer's preparations and actions
    3. Key movements of all suspects: ${characters.characters
      .map((c) => c.name)
      .join(", ")}
    4. Important events that create alibis or opportunities

    Format your response as a JSON object with the following structure:
    {
        "timeline": [
            {
                "time": string,
                "event": string,
                "characters_involved": [string],
                "location": string,
                "significance": string
            }
        ]
    }
    
    Ensure all character movements are consistent with their provided alibis.`;

// Stage 4: Locations Graph
export const LOCATIONS_PROMPT = (
  story: CoreStory,
  timeline: TimelineEvent[]
) => `Based on this murder mystery:
Setting: ${story.setting.location} in ${story.setting.time_period}
Murder Location: ${story.murder_method.location}
Timeline: ${timeline.map((t) => JSON.stringify(t)).join("\n")}

Create a complete map of all relevant locations for the investigation. For each location include:
1. How it connects to other locations
2. What state it's in initially (e.g. locked, guarded, public)
3. What types of evidence might be found there
4. Any special requirements to access it

Format as a JSON array:
{
    "locations": [
        {
            "id": string,
            "name": string,
            "description": string,
            "connected_locations": string[],  // IDs of connected locations
            "initial_state": string,  // e.g. "locked", "public", "guarded"
            "available_evidence_types": string[],  // e.g. "physical", "documentary", "digital"
            "access_requirements": string[]  // e.g. "key", "permission", "distraction"
        }
    ]
}

Include all locations mentioned in the timeline and any additional areas that would logically exist and be relevant to the investigation.`;

// Stage 5: Evidence Layer
export const EVIDENCE_PROMPT = (
  story: CoreStory,
  timeline: TimelineEvent[],
  locations: Location[]
) => `Given this murder mystery context:
Victim: ${JSON.stringify(story.victim)}
Murderer: ${JSON.stringify(story.murderer)}
Murder Method: ${JSON.stringify(story.murder_method)}
Key Twist: ${story.key_twist}
Timeline: ${timeline.map((event) => JSON.stringify(event)).join("\n")}

And these locations:
${locations.map((l) => `- ${l.name}: ${l.description}`).join("\n")}

Create a network of discoverable evidence. Evidence can be either items found in locations or information learned from interviews.
For each piece of evidence, specify:
1. Where it can be found
2. What it initially appears to mean
3. Its true significance
4. What needs to be discovered before it becomes available/meaningful

Format as a JSON array:
{
    "evidence": [
        {
            "id": string,
            "name": string,
            "type": "physical" | "documentary" | "testimonial" | "digital" | "forensic",
            "location_id": string,
            "description": string,
            "initial_interpretation": string,
            "true_significance": string,
            "requires_discovery": string[],  // IDs of evidence needed before this is meaningful
            "reveals": string[]  // IDs of evidence/locations this unlocks
        }
    ]
}

Ensure a mix of:
1. Immediately available evidence
2. Evidence that requires tools/skills to find
3. Evidence that only becomes meaningful after other discoveries
4. Red herrings that seem important but aren't
5. Key evidence needed for the solution`;

// Stage 6: Interview Topics
export const INTERVIEW_PROMPT = (
  story: CoreStory,
  characters: Character[],
  evidence: Evidence[]
) => `For this murder mystery:
Victim: ${JSON.stringify(story.victim)}
Murderer: ${JSON.stringify(story.murderer)}
Murder Method: ${JSON.stringify(story.murder_method)}
Key Twist: ${story.key_twist}

Characters:
${characters.map((char) => JSON.stringify(char)).join("\n")}

Evidence:
${evidence.map((e) => JSON.stringify(e)).join("\n")}


Create interview content for each character. For each character, specify:
1. What they know about (both relevant and irrelevant info)
2. What they're lying about or hiding
3. Initial dialogue when first met
4. Topics they'll discuss and what evidence triggers these discussions

Format as a JSON array:
{
    "character_knowledge": [
        {
            "character_id": string,
            "knows_about": string[],  // IDs of evidence/events they know about
            "lying_about": string[],  // IDs of evidence/events they're deceptive about
            "initial_dialogue": string,
            "topics": [
                {
                    "id": string,
                    "trigger_evidence": string[],  // Evidence IDs needed to unlock topic
                    "response": string,
                    "reveals": string[]  // IDs of new evidence/knowledge this reveals
                }
            ]
        }
    ]
}

Ensure:
1. Each character has both useful and irrelevant information
2. Some information requires showing evidence to unlock
3. Characters may lie or mislead based on their motives
4. The murderer's responses should be technically true but misleading
5. Some characters know about others' secrets`;

// Stage 7: Solution Path
export const SOLUTION_PROMPT = (
  story: CoreStory,
  evidence: Evidence[],
  interviews: CharacterKnowledge[]
) => `For this murder mystery:
Victim: ${JSON.stringify(story.victim)}
Murderer: ${JSON.stringify(story.murderer)}
Murder Method: ${JSON.stringify(story.murder_method)}
Key Twist: ${story.key_twist}

Character Knowledge:
${interviews.map((i) => JSON.stringify(i)).join("\n")}

Evidence:
${evidence.map((e) => JSON.stringify(e)).join("\n")}

Create the solution requirements and valid paths to solve the mystery. Include:
1. Essential pieces of evidence that must be discovered
2. Key revelations that come from combining evidence
3. Multiple valid paths to reach the solution

Format as a JSON object:
{
    "solution": {
        "required_discoveries": string[],  // Evidence IDs that must be found
        "key_revelations": [
            {
                "id": string,
                "requires_evidence": string[],  // Evidence IDs needed for this revelation
                "revelation": string,
                "leads_to": string[]  // IDs of new evidence/locations this unlocks
            }
        ],
        "valid_solution_paths": string[][],  // Arrays of evidence/revelation IDs that prove the solution
        "minimum_evidence_required": string[]  // The minimal set of evidence needed to accuse correctly
    }
}

Ensure:
1. All paths to solution require discovering the key twist
2. Multiple valid ways to reach key revelations
3. Red herrings are clearly disprovable
4. The solution requires both evidence and logical deduction`;
