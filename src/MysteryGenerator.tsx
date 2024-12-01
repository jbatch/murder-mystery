import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMystery } from "./api";
import type {
  CoreStory,
  Character,
  TimelineEvent,
  Evidence,
  CharacterKnowledge,
  Solution,
  Location,
} from "./types";
import { useConfig } from "./configContext";
import { useState } from "react";
import { Switch } from "./components/ui/switch";
import CharactersView from "./components/CharactersView";
import CoreStoryView from "./components/CoreStoryView";
import TimelineView from "./components/TimelineView";
import LocationsView from "./components/LocationsView";
import EvidenceView from "./components/EvidenceView";
import InterviewsView from "./components/InterviewsView";
import SolutionView from "./components/SolutionView";

const MysteryGenerator = () => {
  const { apiKey, setApiKey, skipCache, setSkipCache } = useConfig();
  const [loading, setLoading] = useState(false);
  const [mystery, setMystery] = useState<{
    story?: CoreStory;
    characters?: Character[];
    timeline?: TimelineEvent[];
    locations?: Location[];
    evidence?: Evidence[];
    interviews?: CharacterKnowledge[];
    solution?: Solution;
  }>({});

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const {
        story,
        characters,
        evidence,
        timeline,
        interviews,
        locations,
        solution,
      } = await generateMystery(apiKey, skipCache);
      setMystery({
        story,
        characters,
        timeline,
        evidence,
        interviews,
        locations,
        solution,
      });
    } catch (error) {
      console.error("Failed to generate mystery:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mystery Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Input
              placeholder="OpenAI API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={skipCache}
                onCheckedChange={setSkipCache}
                id="skip-cache"
              />
              <label htmlFor="skip-cache">Skip Cache</label>
            </div>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Mystery
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="core" className="mt-4">
        <TabsList>
          <TabsTrigger value="core">Core Story</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <CoreStoryView story={mystery.story} />
        </TabsContent>

        <TabsContent value="characters">
          <CharactersView characters={mystery.characters} />
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineView timeline={mystery.timeline} />
        </TabsContent>

        <TabsContent value="locations">
          <LocationsView locations={mystery.locations} />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceView evidence={mystery.evidence} />
        </TabsContent>

        <TabsContent value="interviews">
          <InterviewsView
            interviews={mystery.interviews}
            evidence={mystery.evidence}
          />
        </TabsContent>

        <TabsContent value="solution">
          <SolutionView solution={mystery.solution} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MysteryGenerator;
