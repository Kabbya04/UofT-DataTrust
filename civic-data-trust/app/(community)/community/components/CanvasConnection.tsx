import React from 'react';
import { Arrow } from 'react-konva';
import { Connection, NodeData } from '@/app/store/workflowSlice';

interface CanvasConnectionProps {
  connection: Connection;
  sourceNode?: NodeData;
  targetNode?: NodeData;
}

export default function CanvasConnection({ 
  connection, 
  sourceNode, 
  targetNode 
}: CanvasConnectionProps) {
  if (!sourceNode || !targetNode) return null;
  
  // Calculate port positions
  const getPortY = (node: NodeData, portId: string, isOutput: boolean) => {
    const ports = isOutput ? node.outputs : node.inputs;
    const portIndex = ports?.findIndex(p => p.id === portId) || 0;
    const totalPorts = ports?.length || 1;
    
    if (totalPorts === 1) return node.height / 2;
    const portSpacing = 25;
    const startY = (node.height - (totalPorts - 1) * portSpacing) / 2;
    return startY + portIndex * portSpacing;
  };
  
  const sourceY = sourceNode.y + getPortY(sourceNode, connection.sourcePortId, true);
  const targetY = targetNode.y + getPortY(targetNode, connection.targetPortId, false);
  
  // Create curved path
  const startX = sourceNode.x + sourceNode.width;
  const endX = targetNode.x;
  const controlOffset = Math.abs(endX - startX) * 0.5;
  
  const points = [
    startX, sourceY,
    startX + controlOffset, sourceY,
    endX - controlOffset, targetY,
    endX, targetY
  ];
  
  return (
    <Arrow
      points={points}
      stroke={connection.type === 'main' ? '#374151' : '#9CA3AF'}
      strokeWidth={2}
      fill="#374151"
      pointerLength={8}
      pointerWidth={8}
      tension={0.3}
      bezier={true}
    />
  );
}