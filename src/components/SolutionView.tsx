// components/SolutionView.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Route, AlertCircle } from "lucide-react";
import { Solution } from "@/types";

const SolutionView = ({ solution }: { solution?: Solution }) => {
  if (!solution) {
    return (
      <p className="text-gray-500 mt-4">
        Generate a mystery to see the solution
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Required Discoveries */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-lg">Required Discoveries</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {solution.required_discoveries.map((discovery, i) => (
              <div
                key={i}
                className="bg-amber-50 p-2 rounded border border-amber-200"
              >
                {discovery}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Revelations */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Key Revelations</h3>
          </div>
          <div className="space-y-4">
            {solution.key_revelations.map((revelation, i) => (
              <div
                key={i}
                className="bg-blue-50 p-3 rounded border border-blue-200"
              >
                <p className="font-medium mb-2">{revelation.revelation}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-blue-700">Requires:</span>{" "}
                    {revelation.requires_evidence.join(", ")}
                  </p>
                  <p>
                    <span className="text-blue-700">Leads to:</span>{" "}
                    {revelation.leads_to.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Valid Solution Paths */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Route className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-lg">Valid Solution Paths</h3>
          </div>
          <div className="space-y-4">
            {solution.valid_solution_paths.map((path, i) => (
              <div
                key={i}
                className="bg-green-50 p-3 rounded border border-green-200"
              >
                <p className="font-medium mb-2">Path {i + 1}:</p>
                <div className="pl-4">
                  {path.map((step, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <span className="text-green-700">{j + 1}.</span>
                      <span>{step}</span>
                      {j < path.length - 1 && (
                        <span className="text-green-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Minimum Required Evidence */}
      <Alert>
        <AlertDescription>
          <p className="font-semibold mb-2">Minimum Evidence Required:</p>
          <div className="pl-4">
            {solution.minimum_evidence_required.map((evidence, i) => (
              <div key={i} className="text-sm">
                • {evidence}
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SolutionView;
