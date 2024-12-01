// components/LocationView.tsx

import { Card, CardContent } from "./ui/card";
import { Location } from "../types";

const LocationsView = ({ locations }: { locations?: Location[] }) => (
  <div className="grid gap-4 mt-4">
    {locations?.map((location, i) => (
      <Card key={i}>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg mb-2">
            {location.id}: {location.name}
          </h3>
          <div className="space-y-2 text-sm">
            <p>{location.description}</p>
            <p>
              <span className="font-medium">State:</span>{" "}
              {location.initial_state}
            </p>
            <p>
              <span className="font-medium">Evidence Types:</span>{" "}
              {location.available_evidence_types.join(", ")}
            </p>
            <p>
              <span className="font-medium">Connected to:</span>{" "}
              {location.connected_locations.join(", ")}
            </p>
            {location.access_requirements.length > 0 && (
              <p>
                <span className="font-medium">Requirements:</span>{" "}
                {location.access_requirements.join(", ")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
    {!locations && (
      <p className="text-gray-500">Generate a mystery to see the locations</p>
    )}
  </div>
);

export default LocationsView;
