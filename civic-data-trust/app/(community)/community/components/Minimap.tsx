import React, { useMemo } from 'react';
import { NodeData } from '@/app/store/workflowSlice';

interface MinimapProps {
  nodes: NodeData[];
  viewport: { x: number; y: number };
  zoom: number;
  canvasSize: { width: number; height: number };
}

export default React.memo(function Minimap({ nodes, viewport, zoom, canvasSize }: MinimapProps) {
  const minimapWidth = 200;
  const minimapHeight = 120;
  
  if (nodes.length === 0) return null;
  
  // Memoized bounds and scale calculation
  const { bounds, scale } = useMemo(() => {
    const calculatedBounds = nodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height)
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    });
    
    const workflowWidth = calculatedBounds.maxX - calculatedBounds.minX + 100;
    const workflowHeight = calculatedBounds.maxY - calculatedBounds.minY + 100;
    const calculatedScale = Math.min(
      (minimapWidth - 20) / workflowWidth,
      (minimapHeight - 20) / workflowHeight,
      0.2
    );
    
    return { bounds: calculatedBounds, scale: calculatedScale };
  }, [nodes, minimapWidth, minimapHeight]);
  
  return (
    <div 
      className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 border border-gray-200"
      style={{ width: minimapWidth, height: minimapHeight }}
    >
      <svg width={minimapWidth - 4} height={minimapHeight - 4}>
        {/* Background */}
        <rect
          width={minimapWidth - 4}
          height={minimapHeight - 4}
          fill="#f9fafb"
          rx={4}
        />
        
        {/* Render miniature nodes */}
        {nodes.map(node => (
          <rect
            key={node.id}
            x={(node.x - bounds.minX + 50) * scale}
            y={(node.y - bounds.minY + 50) * scale}
            width={node.width * scale}
            height={node.height * scale}
            fill={node.color || '#FF6B35'}
            opacity={0.8}
            rx={2}
          />
        ))}
        
        {/* Viewport indicator */}
        <rect
          x={(-viewport.x / zoom - bounds.minX + 50) * scale}
          y={(-viewport.y / zoom - bounds.minY + 50) * scale}
          width={(canvasSize.width / zoom) * scale}
          height={(canvasSize.height / zoom) * scale}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={2}
          opacity={0.5}
        />
      </svg>
    </div>
  );
});