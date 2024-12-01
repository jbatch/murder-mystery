// components/InterviewsView.tsx
import React from "react";
import { CharacterKnowledge, Evidence } from "@/types";
import { Card, CardContent } from "./ui/card";
import EvidenceTooltip from "./EvidenceTooltip";

const InterviewsView = ({
  interviews,
  evidence,
}: {
  interviews?: CharacterKnowledge[];
  evidence?: Evidence[];
}) => (
  <div className="grid gap-4 mt-4">
    {interviews?.map((interview, i) => (
      <Card key={i}>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg mb-2">
            Character: {interview.character_id}
          </h3>
          <div className="space-y-4 text-sm">
            <p>{interview.initial_dialogue}</p>
            <div>
              <h4 className="font-medium mb-2">Topics:</h4>
              <div className="space-y-2 pl-4">
                {interview.topics.map((topic, j) => (
                  <div key={j} className="border-l-2 border-gray-200 pl-2">
                    <p className="font-medium">{topic.id}</p>
                    <p>Response: {topic.response}</p>
                    <p className="text-xs text-gray-500">
                      Requires:{" "}
                      {topic.trigger_evidence.map((evidenceId, k) => (
                        <React.Fragment key={k}>
                          {k > 0 && ", "}
                          <EvidenceTooltip
                            evidenceId={evidenceId}
                            evidence={evidence}
                          >
                            {evidenceId}
                          </EvidenceTooltip>
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {interview.lying_about.length > 0 && (
              <p className="text-red-600">
                Lying about:{" "}
                {interview.lying_about.map((evidenceId, k) => (
                  <React.Fragment key={k}>
                    {k > 0 && ", "}
                    <EvidenceTooltip
                      evidenceId={evidenceId}
                      evidence={evidence}
                    >
                      {evidenceId}
                    </EvidenceTooltip>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
    {!interviews && (
      <p className="text-gray-500">Generate a mystery to see the interviews</p>
    )}
  </div>
);

export default InterviewsView;
