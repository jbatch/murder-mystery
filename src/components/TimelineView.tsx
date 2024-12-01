// components/TimelineView.tsx

import { TimelineEvent } from "@/types";
import { Card, CardContent } from "./ui/card";

const TimelineView = ({ timeline }: { timeline?: TimelineEvent[] }) => (
  <div className="space-y-4 mt-4">
    {timeline?.map((event, i) => (
      <Card key={i}>
        <CardContent className="pt-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{event.time}</span>
            <span className="text-gray-500">{event.location}</span>
          </div>
          <p>{event.event}</p>
          <div className="mt-2 text-sm">
            <p>
              <span className="font-medium">Present:</span>{" "}
              {event.characters_involved.join(", ")}
            </p>
            <p>
              <span className="font-medium">Significance:</span>{" "}
              {event.significance}
            </p>
          </div>
        </CardContent>
      </Card>
    ))}
    {!timeline && (
      <p className="text-gray-500">Generate a mystery to see the timeline</p>
    )}
  </div>
);

export default TimelineView;
