import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_completion(prompt, system="You are a helpful assistant.", model="gpt-4o-mini"):
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": prompt},
    ]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7,
        response_format={"type": "json_object"},
    )

    return response.choices[0].message.content


def generate_core_story():
    system = """You are a mystery writer specializing in murder mysteries. 
    You excel at creating compelling core premises that can be expanded into full stories."""

    prompt = """Create a core murder mystery premise. Include:
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
            "circumstances": string
        },
        "key_twist": string
    }"""

    try:
        response = get_completion(prompt, system)
        story_core = json.loads(response)
        return story_core
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response")
        return None


def generate_character_list(story_core):
    system = """You are a character designer for murder mysteries.
    You excel at creating interconnected casts of characters with complex relationships and motives."""

    prompt = f"""Given this core mystery:
    Setting: {story_core['setting']['location']} in {story_core['setting']['time_period']}
    Victim: {story_core['victim']['name']}, {story_core['victim']['occupation']}
    Murderer: {story_core['murderer']['name']}, {story_core['murderer']['occupation']}

    Create a cast of 5-7 additional suspects/witnesses who would be present at the scene.
    Each character should have:
    1. A connection to the victim
    2. A potential motive for murder (even if they're innocent)
    3. A secret they're hiding (may or may not be related to the murder)
    4. Their whereabouts during the murder
    
    Format your response as a JSON array of character objects with the following structure:
    {{
        "characters": [
            {{
                "name": string,
                "occupation": string,
                "connection_to_victim": string,
                "potential_motive": string,
                "secret": string,
                "alibi": string
            }}
        ]
    }}"""

    try:
        response = get_completion(prompt, system)
        characters = json.loads(response)
        return characters
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response")
        return None


import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_timeline(story_core, characters):
    system = """You are a mystery plot designer specializing in creating detailed, consistent timelines 
    that account for all character movements and key events."""

    prompt = f"""Given this murder mystery:
    Setting: {story_core['setting']['location']} in {story_core['setting']['time_period']}
    Time of Murder: {story_core['setting']['specific_time']}
    Victim: {story_core['victim']['name']}
    Murder Method: {story_core['murder_method']['circumstances']}

    Create a detailed timeline of events spanning from 2 hours before to 2 hours after the murder.
    Include movements and actions for:
    1. The victim's final hours
    2. The murderer's preparations and actions
    3. Key movements of all suspects
    4. Important events that create alibis or opportunities

    Format your response as a JSON object with the following structure:
    {{
        "timeline": [
            {{
                "time": string,
                "event": string,
                "characters_involved": [string],
                "location": string,
                "significance": string
            }}
        ]
    }}
    
    Ensure all character movements are consistent with their provided alibis."""

    try:
        response = get_completion(prompt, system)
        timeline = json.loads(response)
        return timeline
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response")
        return None


def generate_evidence(story_core, characters, timeline):
    system = """You are a forensics expert and mystery designer. You excel at creating networks 
    of evidence that form a solvable trail while maintaining plausible red herrings."""

    prompt = f"""Given this murder mystery:
    Setting: {story_core['setting']['location']}
    Murder Method: {story_core['murder_method']['weapon']}
    Key Twist: {story_core['key_twist']}

    Create a collection of evidence that will be discovered during the investigation. Include:
    1. Physical evidence at the crime scene
    2. Documentary evidence (notes, letters, receipts, etc.)
    3. Witness testimonies or observations
    4. Red herrings that seem important but lead to wrong conclusions
    5. Key evidence that points to the real killer

    For each piece of evidence, specify:
    - Where it's found
    - Initial interpretation
    - True significance
    - Requirements to discover it (if any)

    Format your response as a JSON object with the following structure:
    {{
        "evidence": [
            {{
                "name": string,
                "type": string,
                "location": string,
                "description": string,
                "initial_interpretation": string,
                "true_significance": string,
                "requirements": {{
                    "items_needed": [string],
                    "knowledge_needed": [string]
                }},
                "leads_to": [string]
            }}
        ],
        "evidence_connections": [
            {{
                "evidence_a": string,
                "evidence_b": string,
                "connection_type": string,
                "revelation": string
            }}
        ]
    }}"""

    try:
        response = get_completion(prompt, system)
        evidence = json.loads(response)
        return evidence
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response")
        return None


def validate_consistency(story_core, characters, timeline, evidence):
    system = """You are a mystery editor specializing in detecting plot holes, 
    timeline inconsistencies, and logical errors in mystery narratives."""

    prompt = """Review this mystery's components for consistency and logic.
    Check for:
    1. Timeline contradictions
    2. Evidence that couldn't exist given the sequence of events
    3. Alibis that don't make sense
    4. Plot holes in the central mystery
    5. Ensure the mystery is solvable with the given evidence

    Format your response as a JSON object with the following structure:
    {{
        "is_consistent": boolean,
        "issues": [
            {{
                "type": string,
                "description": string,
                "severity": string,
                "suggested_fix": string
            }}
        ]
    }}"""

    try:
        response = get_completion(prompt, system)
        validation = json.loads(response)
        return validation
    except json.JSONDecodeError:
        print("Error: Failed to parse JSON response")
        return None


def main():
    # Generate core story
    print("Generating core story...")
    story_core = generate_core_story()
    if not story_core:
        return

    print("\nCore story generated:")
    print(json.dumps(story_core, indent=2))

    # Generate character list
    print("\nGenerating characters...")
    characters = generate_character_list(story_core)
    if not characters:
        return

    print("\nCharacters generated:")
    print(json.dumps(characters, indent=2))

    # Generate timeline
    print("\nGenerating timeline...")
    timeline = generate_timeline(story_core, characters)
    if not timeline:
        return

    print("\nTimeline generated:")
    print(json.dumps(timeline, indent=2))

    # Generate evidence
    print("\nGenerating evidence...")
    evidence = generate_evidence(story_core, characters, timeline)
    if not evidence:
        return

    print("\nEvidence generated:")
    print(json.dumps(evidence, indent=2))

    # Validate consistency
    print("\nValidating mystery consistency...")
    validation = validate_consistency(story_core, characters, timeline, evidence)
    if not validation:
        return

    print("\nValidation results:")
    print(json.dumps(validation, indent=2))


if __name__ == "__main__":
    main()
