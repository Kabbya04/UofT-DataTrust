import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { NodeData } from '@/app/store/workflowSlice';
import { KonvaEventObject } from 'konva/lib/Node';

interface CanvasNodeProps {
  node: NodeData;
  isSelected: boolean;
  onDragStart?: () => void;  // Added onDragStart
  onDrag: (nodeId: string, e: KonvaEventObject<DragEvent>) => void;
  onPortClick: (nodeId: string, portId: string, portType: 'input' | 'output') => void;
  onSelect: () => void;
  onConfig: () => void;
}

export default function CanvasNode({ 
  node, 
  isSelected, 
  onDragStart,  // Added to props
  onDrag, 
  onPortClick, 
  onSelect,
  onConfig 
}: CanvasNodeProps) {
  const portRadius = 6;
  const portSpacing = 25;
  
  // Calculate port positions
  const getInputPortY = (index: number, total: number) => {
    if (total === 1) return node.height / 2;
    const startY = (node.height - (total - 1) * portSpacing) / 2;
    return startY + index * portSpacing;
  };
  
  const getOutputPortY = (index: number, total: number) => {
    if (total === 1) return node.height / 2;
    const startY = (node.height - (total - 1) * portSpacing) / 2;
    return startY + index * portSpacing;
  };

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable
      onDragStart={(e) => {
        e.cancelBubble = true;  // Prevent event from bubbling to stage
        if (onDragStart) onDragStart();
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true;  // Prevent event from bubbling to stage
        onDrag(node.id, e);
      }}
      onClick={(e) => {
        e.cancelBubble = true;  // Prevent event from bubbling to stage
        onSelect();
      }}
      onDblClick={(e) => {
        e.cancelBubble = true;  // Prevent event from bubbling to stage
        onConfig();
      }}
    >
      {/* Main node rectangle */}
      <Rect
        width={node.width}
        height={node.height}
        fill={node.color || '#FF6B35'}
        stroke={isSelected ? '#3B82F6' : '#374151'}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={8}
        shadowBlur={5}
        shadowOpacity={0.1}
      />
      
      {/* Node name */}
      <Text
        x={10}
        y={node.height / 2 - 8}
        text={node.name}
        fontSize={14}
        fontFamily="Arial"
        fill="#FFFFFF"
        fontStyle="bold"
        width={node.width - 20}
        ellipsis={true}
      />
      
      {/* Input ports */}
      {node.inputs?.map((input, index) => (
        <Circle
          key={`input-${input.id}`}
          x={0}
          y={getInputPortY(index, node.inputs!.length)}
          radius={portRadius}
          fill={input.connected ? '#10B981' : '#6B7280'}
          stroke="#FFFFFF"
          strokeWidth={2}
          onClick={(e) => {
            e.cancelBubble = true;
            onPortClick(node.id, input.id, 'input');
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      ))}
      
      {/* Output ports */}
      {node.outputs?.map((output, index) => (
        <Circle
          key={`output-${output.id}`}
          x={node.width}
          y={getOutputPortY(index, node.outputs!.length)}
          radius={portRadius}
          fill={output.connected ? '#10B981' : '#6B7280'}
          stroke="#FFFFFF"
          strokeWidth={2}
          onClick={(e) => {
            e.cancelBubble = true;
            onPortClick(node.id, output.id, 'output');
          }}
          onMouseEnter={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage()?.container();
            if (container) container.style.cursor = 'default';
          }}
        />
      ))}
      
      {/* Status indicator */}
      {node.data?.status && (
        <Circle
          x={node.width - 10}
          y={10}
          radius={4}
          fill={
            node.data.status === 'success' ? '#10B981' :
            node.data.status === 'error' ? '#EF4444' :
            '#F59E0B'
          }
        />
      )}
    </Group>
  );
}