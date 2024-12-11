# Murder Mystery Generator

A proof-of-concept application exploring the use of Large Language Models (LLMs) to assist in crafting interactive murder mystery stories. This spike tests the viability of using AI to generate coherent, logically-consistent mystery narratives while maintaining human creative control.

## Project Overview

The application consists of two main components:

1. **Mystery Generator**: An AI-assisted tool that generates complete murder mystery scenarios, including:

   - Core story elements (setting, victim, murderer, method)
   - Character profiles and relationships
   - Evidence chains and discovery paths
   - Location mapping
   - Timeline of events
   - Character interviews and knowledge
   - Solution paths and requirements

2. **Mystery Planner**: A drag-and-drop interface for organizing and structuring mystery elements across different investigation phases. (Not written yet)

## Technology Stack

- React with TypeScript
- OpenAI API for content generation
- shadcn/ui for component library
- Tailwind CSS for styling
- React Router for navigation
- Local Storage for caching generated content

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features

### Mystery Generator

- AI-powered generation of complete mystery scenarios
- Caching system for generated content
- Tabbed interface for viewing different aspects of the mystery:
  - Core Story
  - Characters
  - Timeline
  - Locations
  - Evidence
  - Interviews
  - Solution

### Mystery Planner

- Drag-and-drop interface for organizing mystery elements
- Timeline-based planning board
- Evidence and conversation staging area
- Critical path highlighting
- Node dependencies and requirements tracking

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CharactersView/  # Character display component
│   ├── CoreStoryView/   # Core story display
│   ├── EvidenceView/    # Evidence network viewer
│   └── ...
├── types/               # TypeScript type definitions
├── api.ts              # OpenAI API integration
├── cache.ts            # Local storage caching system
├── prompts.ts          # LLM prompt templates
└── MysteryGenerator.tsx # Main generator component
```

## Generation Process

The mystery generation follows a sequential process:

1. Core Story Generation
2. Character Creation
3. Timeline Construction
4. Location Mapping
5. Evidence Placement
6. Interview Content Generation
7. Solution Path Definition

Each stage builds upon the previous ones to ensure consistency and logical coherence.

## Caching System

The application implements a 24-hour caching system for generated content to:

- Reduce API costs
- Speed up development iterations
- Allow for content persistence

## Future Development

This spike demonstrates several areas for potential development:

1. Enhanced prompt engineering for more coherent narratives
2. Improved evidence chain generation
3. More sophisticated character interaction systems
4. Visual diagram generation for relationships and timelines
5. Export functionality for generated mysteries
6. Interactive playthrough system

## Known Limitations

- Generated content may sometimes contain logical inconsistencies
- Character motivations can be simplistic
- Evidence chains may not always connect logically
- Limited validation of solution paths
- Basic implementation of the planning interface
