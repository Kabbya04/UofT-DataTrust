import React, { useState } from 'react';
import { Arrow } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { Connection, NodeData, deleteConnection } from '@/app/store/workflowSlice';
import { RootState } from '@/app/store';

export interface CanvasConnectionProps {
  connection: Connection;
  sourceNode?: NodeData;
  targetNode?: NodeData;
}

const CanvasConnection: React.FC<CanvasConnectionProps> = ({ 
  connection, 
  sourceNode, 
  targetNode 
}) => {
  const dispatch = useDispatch();
  const connectionLineStyle = useSelector((state: RootState) => state.workflow.connectionLineStyle);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!sourceNode || !targetNode) return null;
  
  const handleConnectionClick = () => {
    // Delete connection on click (with confirmation for better UX)
    if (window.confirm('Delete this connection?')) {
      dispatch(deleteConnection(connection.id));
    }
  };
  
  // Calculate port positions with improved precision
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
  
  // Enhanced curved path with better control points
  const startX = sourceNode.x + sourceNode.width;
  const endX = targetNode.x;
  const distance = Math.abs(endX - startX);
  const controlOffset = Math.max(distance * 0.4, 50); // Minimum curve for better aesthetics
  
  const points = [
    startX, sourceY,
    startX + controlOffset, sourceY,
    endX - controlOffset, targetY,
    endX, targetY
  ];
  
  // Enhanced styling based on connection type and line style
  const getConnectionColor = () => {
    switch (connection.type) {
      case 'main': return '#374151';
      case 'data': return '#3B82F6';
      case 'condition': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };
  
  const strokeColor = getConnectionColor();
  const isDotted = connectionLineStyle === 'dotted';
  
  return (
    <Arrow
      points={points}
      stroke={isHovered ? '#EF4444' : strokeColor} // Red on hover for delete indication
      strokeWidth={isHovered ? 3.5 : 2.5} // Thicker on hover
      fill={isHovered ? '#EF4444' : strokeColor}
      pointerLength={10}
      pointerWidth={8}
      tension={0.4}
      bezier={true}
      dash={isDotted ? [8, 6] : undefined}
      lineCap="round"
      lineJoin="round"
      shadowColor={isHovered ? "rgba(239, 68, 68, 0.3)" : "rgba(0, 0, 0, 0.1)"}
      shadowBlur={isHovered ? 4 : 2}
      shadowOffset={{ x: 1, y: 1 }}
      shadowOpacity={0.3}
      perfectDrawEnabled={false}
      listening={true} // Enable interaction
      onClick={handleConnectionClick}
      onMouseEnter={() => {
        setIsHovered(true);
        const container = document.body;
        container.style.cursor = 'pointer';
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        const container = document.body;
        container.style.cursor = 'default';
      }}
    />
  );
};

export default CanvasConnection;