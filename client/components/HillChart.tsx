import { useState, useRef, useEffect } from "react";
import "./HillChart.css";

type HillChartItem = {
  id: number;
  title: string;
  position: number; // 0-100, where 0 is start, 50 is peak, 100 is end
};

type HillChartProps = {
  items: HillChartItem[];
  onPositionChange: (id: number, position: number) => void;
};

type PositionedItem = HillChartItem & {
  displayX: number;
  displayY: number;
  originalY: number;
};

export default function HillChart({ items, onPositionChange }: HillChartProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 800;
  const height = 400;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const minDistance = 40; // Minimum horizontal distance between dots
  const verticalSpacing = 30; // Vertical spacing when stacking

  // Generate hill curve using quadratic bezier
  const getHillPath = () => {
    const startX = padding;
    const startY = padding + chartHeight;
    const endX = padding + chartWidth;
    const endY = padding + chartHeight;
    const controlX = padding + chartWidth / 2;
    const controlY = padding;

    return `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;
  };

  // Convert position (0-100) to x,y coordinates on the hill
  const positionToCoords = (position: number): { x: number; y: number } => {
    const t = position / 100;
    const startX = padding;
    const startY = padding + chartHeight;
    const endX = padding + chartWidth;
    const endY = padding + chartHeight;
    const controlX = padding + chartWidth / 2;
    const controlY = padding;

    // Quadratic bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const x =
      Math.pow(1 - t, 2) * startX +
      2 * (1 - t) * t * controlX +
      Math.pow(t, 2) * endX;
    const y =
      Math.pow(1 - t, 2) * startY +
      2 * (1 - t) * t * controlY +
      Math.pow(t, 2) * endY;

    return { x, y };
  };

  // Calculate positions with collision detection
  const getPositionedItems = (): PositionedItem[] => {
    // First, get base positions for all items
    const basePositions = items.map((item) => {
      const coords = positionToCoords(item.position);
      return {
        ...item,
        displayX: coords.x,
        displayY: coords.y,
        originalY: coords.y,
      };
    });

    // Sort by x position to process left to right
    const sorted = [...basePositions].sort((a, b) => a.displayX - b.displayX);

    // Detect and resolve collisions using a smarter approach
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i]!;
      const conflictingItems: PositionedItem[] = [];

      // Find all items that are too close
      for (let j = 0; j < i; j++) {
        const other = sorted[j]!;
        const distance = Math.abs(current.displayX - other.displayX);

        if (distance < minDistance) {
          conflictingItems.push(other);
        }
      }

      // Find the highest stack level among conflicting items
      let maxStackLevel = 0;
      for (const conflicting of conflictingItems) {
        const conflictStackLevel = Math.round(
          (conflicting.originalY - conflicting.displayY) / verticalSpacing,
        );
        maxStackLevel = Math.max(maxStackLevel, conflictStackLevel + 1);
      }

      // Apply vertical offset if needed
      if (maxStackLevel > 0) {
        current.displayY = current.originalY - maxStackLevel * verticalSpacing;
      }
    }

    return sorted;
  };

  const positionedItems = getPositionedItems();

  // Convert SVG coordinates to position (0-100)
  const coordsToPosition = (clientX: number): number => {
    if (!svgRef.current) return 0;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const relativeX = Math.max(padding, Math.min(x, padding + chartWidth));
    const position = ((relativeX - padding) / chartWidth) * 100;

    return Math.max(0, Math.min(100, position));
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedId) return;

    const position = coordsToPosition(e.clientX);
    onPositionChange(selectedId, position);
    setSelectedId(null);
  };

  const handleDotClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedId(id === selectedId ? null : id);
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedId) return;

      const position = coordsToPosition(e.clientX);
      onPositionChange(selectedId, position);
    };

    const handleMouseUp = () => {
      setSelectedId(null);
    };

    if (selectedId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [selectedId, onPositionChange]);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4">
        <div className="flex justify-between px-[60px]">
          <div className="flex flex-col text-center">
            <span className="text-sm font-semibold text-gray-800 mb-1">
              Figuring things out
            </span>
            <span className="text-xs text-gray-500">Uncertainty, exploring</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-semibold text-gray-800 mb-1">
              Making it happen
            </span>
            <span className="text-xs text-gray-500">Confidence, shipping</span>
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={height}
        onClick={handleClick}
        className={`block mx-auto bg-gray-50 rounded-lg ${selectedId ? "cursor-crosshair" : ""}`}
      >
        {/* Grid lines */}
        <g className="grid">
          {[0, 25, 50, 75, 100].map((percent) => {
            const x = padding + (chartWidth * percent) / 100;
            return (
              <line
                key={percent}
                x1={x}
                y1={padding}
                x2={x}
                y2={padding + chartHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            );
          })}
        </g>

        {/* Hill curve */}
        <path d={getHillPath()} fill="none" stroke="#3b82f6" strokeWidth="3" />

        {/* Center line */}
        <line
          x1={padding + chartWidth / 2}
          y1={padding}
          x2={padding + chartWidth / 2}
          y2={padding + chartHeight}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="8,4"
        />

        {/* Item dots */}
        {positionedItems.map((item) => {
          const isSelected = item.id === selectedId;
          const isHovered = item.id === hoveredId;
          const isOffset = item.displayY !== item.originalY;

          return (
            <g key={item.id}>
              {/* Connector line to show original position when offset */}
              {isOffset && (
                <line
                  x1={item.displayX}
                  y1={item.displayY}
                  x2={item.displayX}
                  y2={item.originalY}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              )}

              {/* Glow effect for selected/hovered */}
              {(isSelected || isHovered) && (
                <circle
                  cx={item.displayX}
                  cy={item.displayY}
                  r="20"
                  fill="#3b82f6"
                  opacity="0.2"
                />
              )}

              {/* Main dot */}
              <circle
                cx={item.displayX}
                cy={item.displayY}
                r="8"
                fill={isSelected ? "#2563eb" : "#3b82f6"}
                stroke={isSelected ? "#1e40af" : "#fff"}
                strokeWidth="2"
                className="hill-dot"
                onMouseDown={(e) => handleDotClick(e, item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: "pointer" }}
              />

              {/* Label */}
              <text
                x={item.displayX}
                y={item.displayY - 15}
                textAnchor="middle"
                fontSize="12"
                fill="#1f2937"
                fontWeight={isSelected || isHovered ? "600" : "400"}
                pointerEvents="none"
              >
                {item.title}
              </text>

              {/* Position indicator */}
              {(isSelected || isHovered) && (
                <text
                  x={item.displayX}
                  y={item.displayY + 25}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                  pointerEvents="none"
                >
                  {Math.round(item.position)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {selectedId && (
        <div className="mt-4 px-3 py-2 bg-blue-50 text-blue-800 rounded-md text-center text-sm font-medium animate-fade-in">
          Click anywhere on the hill to move the selected item
        </div>
      )}
    </div>
  );
}
