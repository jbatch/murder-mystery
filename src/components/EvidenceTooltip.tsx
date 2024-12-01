import React, { useState } from "react";
import { Evidence } from "@/types";

const EvidenceTooltip = ({
  evidenceId,
  evidence,
  children,
}: {
  evidenceId: string;
  evidence?: Evidence[];
  children: React.ReactNode;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const matchingEvidence = evidence?.find((e) => e.id === evidenceId);

  if (!matchingEvidence) {
    return <>{children}</>;
  }

  return (
    <span
      className="cursor-help relative inline"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {showTooltip && (
        <div
          className="fixed z-50 bg-white shadow-lg rounded-lg p-2 text-sm border max-w-xs"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          {matchingEvidence.name}
        </div>
      )}
    </span>
  );
};

export default EvidenceTooltip;
