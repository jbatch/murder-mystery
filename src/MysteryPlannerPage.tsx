// src/pages/MysteryPlannerPage.tsx

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Box,
  MessageCircle,
  AlertCircle,
  Plus,
  Star,
  GripVertical,
} from "lucide-react";
import { useState } from "react";

interface Node {
  id: string;
  type: "evidence" | "conversation" | "knowledge";
  title: string;
  description: string;
  timeslot?: number;
  isCriticalPath?: boolean;
  requirements?: string[];
}

const MysteryPlannerPage = () => {
  const [stagingNodes, setStagingNodes] = useState<Node[]>([]);
  const [placedNodes, setPlacedNodes] = useState<Node[]>([
    {
      id: "crime_scene",
      type: "knowledge",
      title: "Initial Crime Scene",
      description: "Victim found in study, blunt force trauma",
      timeslot: 0,
      isCriticalPath: true,
      requirements: [],
    },
  ]);

  const [draggedNode, setDraggedNode] = useState<
    (Node & { fromStaging: boolean }) | null
  >(null);

  const timeSlots = 5;

  const handleGenerateEvidence = () => {
    const newNode: Node = {
      id: `evidence_${stagingNodes.length + 1}`,
      type: "evidence",
      title: `New Evidence ${stagingNodes.length + 1}`,
      description: "Generated evidence description",
    };
    setStagingNodes([...stagingNodes, newNode]);
  };

  const handleGenerateConversation = () => {
    const newNode: Node = {
      id: `conversation_${stagingNodes.length + 1}`,
      type: "conversation",
      title: `New Conversation ${stagingNodes.length + 1}`,
      description: "Generated conversation description",
    };
    setStagingNodes([...stagingNodes, newNode]);
  };

  const handleDragStart = (node: Node, fromStaging: boolean) => {
    setDraggedNode({ ...node, fromStaging });
  };

  const handleDrop = (timeslot: number) => {
    if (!draggedNode) return;

    if (draggedNode.fromStaging) {
      setStagingNodes(stagingNodes.filter((n) => n.id !== draggedNode.id));
      setPlacedNodes([...placedNodes, { ...draggedNode, timeslot }]);
    } else {
      setPlacedNodes(
        placedNodes.map((node) =>
          node.id === draggedNode.id ? { ...node, timeslot } : node
        )
      );
    }
    setDraggedNode(null);
  };

  const getNodeIcon = (type: Node["type"]) => {
    switch (type) {
      case "evidence":
        return <Box className="h-4 w-4" />;
      case "conversation":
        return <MessageCircle className="h-4 w-4" />;
      case "knowledge":
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const NodeCard = ({
    node,
    isDraggable = true,
    fromStaging = true,
  }: {
    node: Node;
    isDraggable?: boolean;
    fromStaging?: boolean;
  }) => (
    <Card
      draggable={isDraggable}
      onDragStart={() => handleDragStart(node, fromStaging)}
      className={`p-3 mb-2 cursor-move ${
        node.isCriticalPath ? "border-l-4 border-l-red-500" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <GripVertical className="h-4 w-4 text-gray-400" />
        {getNodeIcon(node.type)}
        <span className="font-medium text-sm">{node.title}</span>
        {node.isCriticalPath && <Star className="h-4 w-4 text-red-500" />}
      </div>
      <p className="text-xs text-gray-600">{node.description}</p>
    </Card>
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Mystery Planner</h1>

      {/* Staging Area */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Evidence Staging</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleGenerateEvidence}>
              <Plus className="h-4 w-4 mr-1" />
              Evidence
            </Button>
            <Button size="sm" onClick={handleGenerateConversation}>
              <Plus className="h-4 w-4 mr-1" />
              Conversation
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {stagingNodes.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>

      {/* Timeline Board */}
      <div className="flex border rounded-lg overflow-hidden">
        {Array(timeSlots)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="flex-1 border-l first:border-l-0 relative"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              <div className="px-2 py-1 border-b bg-gray-50 sticky top-0">
                <span className="font-medium">Phase {index}</span>
              </div>
              <div className="p-2 min-h-[400px]">
                {placedNodes
                  .filter((node) => node.timeslot === index)
                  .map((node) => (
                    <NodeCard key={node.id} node={node} fromStaging={false} />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MysteryPlannerPage;
