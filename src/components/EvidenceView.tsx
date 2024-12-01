// components/EvidenceView.tsx
import { Evidence } from "@/types";
import { Card, CardContent } from "./ui/card";

const EvidenceView = ({ evidence }: { evidence?: Evidence[] }) => (
  <div className="grid gap-4 mt-4">
    {evidence?.map((item, i) => (
      <Card key={i}>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">
              {item.id}: {item.name}
            </h3>
            <span className="text-sm bg-blue-100 px-2 py-1 rounded">
              {item.type}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <p>{item.description}</p>
            <p>
              <span className="font-medium">Found at:</span> {item.location_id}
            </p>
            <p>
              <span className="font-medium">Initial interpretation:</span>{" "}
              {item.initial_interpretation}
            </p>
            <p>
              <span className="font-medium">True significance:</span>{" "}
              {item.true_significance}
            </p>
            {item.requires_discovery.length > 0 && (
              <p>
                <span className="font-medium">Requires:</span>{" "}
                {item.requires_discovery.join(", ")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
    {!evidence && (
      <p className="text-gray-500">Generate a mystery to see the evidence</p>
    )}
  </div>
);

export default EvidenceView;
