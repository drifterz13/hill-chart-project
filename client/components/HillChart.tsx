import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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

// Constants
const SVG_WIDTH = 800;
const SVG_HEIGHT = 400;
const SVG_PADDING = 60;
const CHART_WIDTH = SVG_WIDTH - SVG_PADDING * 2;
const CHART_HEIGHT = SVG_HEIGHT - SVG_PADDING * 2;
const MIN_DISTANCE = 40; // Minimum horizontal distance between dots
const VERTICAL_SPACING = 30; // Vertical spacing when stacking
const DOT_RADIUS = 8;
const GLOW_RADIUS = 20;
const LABEL_OFFSET = 15;
const POSITION_INDICATOR_OFFSET = 25;

// Bezier curve control points (extracted to avoid duplication)
const BEZIER_START_X = SVG_PADDING;
const BEZIER_START_Y = SVG_PADDING + CHART_HEIGHT;
const BEZIER_END_X = SVG_PADDING + CHART_WIDTH;
const BEZIER_END_Y = SVG_PADDING + CHART_HEIGHT;
const BEZIER_CONTROL_X = SVG_PADDING + CHART_WIDTH / 2;
const BEZIER_CONTROL_Y = SVG_PADDING - CHART_HEIGHT * 0.3;

export default function HillChart({ items, onPositionChange }: HillChartProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate hill curve using quadratic bezier (memoized)
  const hillPath = useMemo(() => {
    return `M ${BEZIER_START_X},${BEZIER_START_Y} Q ${BEZIER_CONTROL_X},${BEZIER_CONTROL_Y} ${BEZIER_END_X},${BEZIER_END_Y}`;
  }, []);

  // Convert position (0-100) to x,y coordinates on the hill (memoized)
  const positionToCoords = useCallback((position: number): { x: number; y: number } => {
    const t = position / 100;

    // Quadratic bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const x =
      Math.pow(1 - t, 2) * BEZIER_START_X +
      2 * (1 - t) * t * BEZIER_CONTROL_X +
      Math.pow(t, 2) * BEZIER_END_X;
    const y =
      Math.pow(1 - t, 2) * BEZIER_START_Y +
      2 * (1 - t) * t * BEZIER_CONTROL_Y +
      Math.pow(t, 2) * BEZIER_END_Y;

    return { x, y };
  }, []);

  // Calculate positions with collision detection (memoized for performance)
  const positionedItems = useMemo((): PositionedItem[] => {
    // First, get base positions for all items
    const basePositions = items.map((item) => {
      // Use drag position if this item is being dragged
      const position = item.id === selectedId && dragPosition !== null ? dragPosition : item.position;
      const coords = positionToCoords(position);
      return {
        ...item,
        position, // Update position for display
        displayX: coords.x,
        displayY: coords.y,
        originalY: coords.y,
      };
    });

    // Sort by x position to process left to right
    const sorted = [...basePositions].sort((a, b) => a.displayX - b.displayX);

    // Detect and resolve collisions using a smarter approach
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      if (!current) continue;

      const conflictingItems: PositionedItem[] = [];

      // Find all items that are too close
      for (let j = 0; j < i; j++) {
        const other = sorted[j];
        if (!other) continue;

        const distance = Math.abs(current.displayX - other.displayX);

        if (distance < MIN_DISTANCE) {
          conflictingItems.push(other);
        }
      }

      // Find the highest stack level among conflicting items
      let maxStackLevel = 0;
      for (const conflicting of conflictingItems) {
        const conflictStackLevel = Math.round(
          (conflicting.originalY - conflicting.displayY) / VERTICAL_SPACING,
        );
        maxStackLevel = Math.max(maxStackLevel, conflictStackLevel + 1);
      }

      // Apply vertical offset if needed
      if (maxStackLevel > 0) {
        current.displayY = current.originalY - maxStackLevel * VERTICAL_SPACING;
      }
    }

    return sorted;
  }, [items, selectedId, dragPosition, positionToCoords]);

  // Convert SVG coordinates to position (0-100) - memoized
  const coordsToPosition = useCallback((clientX: number): number => {
    if (!svgRef.current) return 0;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const relativeX = Math.max(SVG_PADDING, Math.min(x, SVG_PADDING + CHART_WIDTH));
    const position = ((relativeX - SVG_PADDING) / CHART_WIDTH) * 100;

    return Math.max(0, Math.min(100, position));
  }, []);

  const handleDotMouseDown = useCallback((e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();

    setSelectedId(id);
    setDragPosition(null);
  }, []);

  // Memoized event handlers to prevent memory leaks
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!selectedId) return;

    const position = coordsToPosition(e.clientX);
    // Update visual position during drag (no API call)
    setDragPosition(position);
  }, [selectedId, coordsToPosition]);

  const handleMouseUp = useCallback(() => {
    if (!selectedId) return;

    // Call API only once when dragging finishes
    if (dragPosition !== null) {
      onPositionChange(selectedId, dragPosition);
    }

    // Always deselect after mouse up
    setSelectedId(null);
    setDragPosition(null);
  }, [selectedId, dragPosition, onPositionChange]);

  // Handle dragging - attach/detach event listeners
  useEffect(() => {
    if (selectedId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [selectedId, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-base-100 rounded-xl shadow-md">
      <div className="mb-4">
        <div className="flex justify-between px-[60px]">
          <div className="flex flex-col text-center">
            <span className="text-sm font-semibold text-base-content mb-1">
              Figuring things out
            </span>
            <span className="text-xs text-base-content/60">
              Uncertainty, exploring
            </span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-semibold text-base-content mb-1">
              Making it happen
            </span>
            <span className="text-xs text-base-content/60">Confidence, shipping</span>
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        className="block mx-auto bg-base-100 rounded-lg"
      >
        {/* Grid lines */}
        <g className="grid">
          {[0, 25, 50, 75, 100].map((percent) => {
            const x = SVG_PADDING + (CHART_WIDTH * percent) / 100;
            return (
              <line
                key={percent}
                x1={x}
                y1={SVG_PADDING}
                x2={x}
                y2={SVG_PADDING + CHART_HEIGHT}
                stroke="var(--color-base-200)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            );
          })}
        </g>

        {/* Hill curve */}
        <path d={hillPath} fill="none" stroke="var(--color-primary)" strokeWidth="3" />

        {/* Center line */}
        <line
          x1={SVG_PADDING + CHART_WIDTH / 2}
          y1={SVG_PADDING}
          x2={SVG_PADDING + CHART_WIDTH / 2}
          y2={SVG_PADDING + CHART_HEIGHT}
          stroke="var(--color-neutral)"
          strokeWidth="2"
          strokeDasharray="8,4"
        />

        {/* Item dots */}
        {positionedItems.map((item) => {
          const isSelected = item.id === selectedId;
          const isHovered = item.id === hoveredId;
          const isOffset = item.displayY !== item.originalY;
          const isDragging = isSelected && dragPosition !== null;

          return (
            <g key={item.id}>
              {/* Connector line to show original position when offset */}
              {isOffset && (
                <line
                  x1={item.displayX}
                  y1={item.displayY}
                  x2={item.displayX}
                  y2={item.originalY}
                   stroke="var(--color-neutral)"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
              )}

              {/* Glow effect for selected/hovered - enhanced when dragging */}
              {(isSelected || isHovered) && (
                <circle
                  cx={item.displayX}
                  cy={item.displayY}
                  r={GLOW_RADIUS}
                   fill={isDragging ? "var(--color-accent)" : "var(--color-neutral)"}
                  opacity={isDragging ? "0.3" : "0.2"}
                  className={isDragging ? "animate-pulse" : ""}
                />
              )}

              {/* Main dot - change color when dragging */}
              <circle
                cx={item.displayX}
                cy={item.displayY}
                r={DOT_RADIUS}
                 fill={isDragging ? "var(--color-accent)" : isSelected ? "var(--color-neutral)" : "var(--color-neutral)"}
                 stroke={isDragging ? "var(--color-accent)" : isSelected ? "var(--color-neutral)" : "var(--color-base-100)"}
                strokeWidth={isDragging ? "3" : "2"}
                className="hill-dot"
                onMouseDown={(e) => handleDotMouseDown(e, item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              />

              {/* Label */}
              <text
                x={item.displayX}
                y={item.displayY - LABEL_OFFSET}
                textAnchor="middle"
                fontSize="12"
                 fill={isDragging ? "var(--color-accent)" : "var(--color-base-content)"}
                fontWeight={isSelected || isHovered ? "600" : "400"}
                pointerEvents="none"
              >
                {item.title}
              </text>

              {/* Position indicator */}
              {(isSelected || isHovered) && (
                <text
                  x={item.displayX}
                  y={item.displayY + POSITION_INDICATOR_OFFSET}
                  textAnchor="middle"
                  fontSize="10"
                   fill={isDragging ? "var(--color-accent)" : "var(--color-neutral-content)"}
                  fontWeight={isDragging ? "600" : "400"}
                  pointerEvents="none"
                >
                  {Math.round(item.position)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {dragPosition !== null && (
        <div className="mt-4 px-3 py-2 bg-accent/10 text-accent rounded-md text-center text-sm font-medium animate-fade-in">
          Release to place the item at this position
        </div>
      )}
    </div>
  );
}
