'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Group } from 'react-konva';

interface Plugin {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface CanvasNode {
  id: string;
  type: 'plugin' | 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPoint: 'top' | 'right' | 'bottom' | 'left';
  toPoint: 'top' | 'right' | 'bottom' | 'left';
}

interface WorkflowCanvasProps {
  canvasNodes: CanvasNode[];
  onDrop: (plugin: Plugin, x: number, y: number) => void;
  draggedPlugin: Plugin | null;
}

export default function WorkflowCanvas({ canvasNodes, onDrop, draggedPlugin }: WorkflowCanvasProps) {
  const stageRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<{nodeId: string, point: string} | null>(null);
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState<string | null>(null);
  const [tempLine, setTempLine] = useState<{x1: number, y1: number, x2: number, y2: number} | null>(null);

  useEffect(() => {
    setNodes(canvasNodes);
  }, [canvasNodes]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setCanvasSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleCanvasDrop = (e: React.DragEvent) => {
    if (!draggedPlugin || !stageRef.current) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 30;
    
    onDrop(draggedPlugin, x, y);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNodeDrag = (nodeId: string, newX: number, newY: number) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, x: newX, y: newY } : node
      )
    );
  };

  const getConnectionPointPosition = (node: CanvasNode, point: string) => {
    switch (point) {
      case 'top':
        return { x: node.x + node.width / 2, y: node.y };
      case 'right':
        return { x: node.x + node.width, y: node.y + node.height / 2 };
      case 'bottom':
        return { x: node.x + node.width / 2, y: node.y + node.height };
      case 'left':
        return { x: node.x, y: node.y + node.height / 2 };
      default:
        return { x: node.x, y: node.y };
    }
  };

  const handleConnectionPointClick = (nodeId: string, point: string) => {
    if (!connectingFrom) {
      // Start connection
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const pos = getConnectionPointPosition(node, point);
        setConnectingFrom({ nodeId, point });
        setTempLine({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      }
    } else if (connectingFrom.nodeId !== nodeId) {
      // Complete connection
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: connectingFrom.nodeId,
        to: nodeId,
        fromPoint: connectingFrom.point as any,
        toPoint: point as any,
      };
      setConnections([...connections, newConnection]);
      setConnectingFrom(null);
      setTempLine(null);
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (connectingFrom && tempLine) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setTempLine({
        ...tempLine,
        x2: point.x,
        y2: point.y
      });
    }
  };

  const handleStageClick = (e: any) => {
    // If clicking on stage (not on a connection point), cancel connection
    if (e.target === e.target.getStage() || e.target.className === 'Rect') {
      setConnectingFrom(null);
      setTempLine(null);
    }
  };

  const renderConnectionLine = (connection: Connection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;
    
    const fromPos = getConnectionPointPosition(fromNode, connection.fromPoint);
    const toPos = getConnectionPointPosition(toNode, connection.toPoint);
    
    return (
      <Line
        key={connection.id}
        points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
        stroke="#6B7280"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  return (
    <div
      id="canvas-container"
      className="w-full h-full"
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseMove={handleStageMouseMove}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Render connections */}
          {connections.map(renderConnectionLine)}
          
          {/* Render temp line while connecting */}
          {tempLine && (
            <Line
              points={[tempLine.x1, tempLine.y1, tempLine.x2, tempLine.y2]}
              stroke="#9CA3AF"
              strokeWidth={2}
              dash={[5, 5]}
              lineCap="round"
              lineJoin="round"
            />
          )}
          
          {/* Render nodes */}
          {nodes.map((node) => (
            <Group
              key={node.id}
              x={node.x}
              y={node.y}
              draggable
              onDragEnd={(e) => {
                handleNodeDrag(node.id, e.target.x(), e.target.y());
              }}
            >
              {/* Main rectangle */}
              <Rect
                width={node.width}
                height={node.height}
                fill={node.type === 'image' ? '#EBF8FF' : node.color}
                stroke={node.type === 'image' ? '#3B82F6' : '#374151'}
                strokeWidth={2}
                cornerRadius={8}
              />
              
              {/* Text - now part of the Group so it moves with the rectangle */}
              <Text
                x={10}
                y={node.height / 2 - 8}
                text={node.name}
                fontSize={14}
                fontFamily="Arial"
                fill={node.type === 'image' ? '#1E40AF' : '#FFFFFF'}
                fontStyle="bold"
              />
              
              {/* Connection points */}
              {/* Top */}
              <Circle
                x={node.width / 2}
                y={0}
                radius={6}
                fill={hoveredConnectionPoint === `${node.id}-top` ? '#3B82F6' : '#6B7280'}
                stroke="#FFFFFF"
                strokeWidth={2}
                onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-top`)}
                onMouseLeave={() => setHoveredConnectionPoint(null)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleConnectionPointClick(node.id, 'top');
                }}
              />
              
              {/* Right */}
              <Circle
                x={node.width}
                y={node.height / 2}
                radius={6}
                fill={hoveredConnectionPoint === `${node.id}-right` ? '#3B82F6' : '#6B7280'}
                stroke="#FFFFFF"
                strokeWidth={2}
                onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-right`)}
                onMouseLeave={() => setHoveredConnectionPoint(null)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleConnectionPointClick(node.id, 'right');
                }}
              />
              
              {/* Bottom */}
              <Circle
                x={node.width / 2}
                y={node.height}
                radius={6}
                fill={hoveredConnectionPoint === `${node.id}-bottom` ? '#3B82F6' : '#6B7280'}
                stroke="#FFFFFF"
                strokeWidth={2}
                onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-bottom`)}
                onMouseLeave={() => setHoveredConnectionPoint(null)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleConnectionPointClick(node.id, 'bottom');
                }}
              />
              
              {/* Left */}
              <Circle
                x={0}
                y={node.height / 2}
                radius={6}
                fill={hoveredConnectionPoint === `${node.id}-left` ? '#3B82F6' : '#6B7280'}
                stroke="#FFFFFF"
                strokeWidth={2}
                onMouseEnter={() => setHoveredConnectionPoint(`${node.id}-left`)}
                onMouseLeave={() => setHoveredConnectionPoint(null)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  handleConnectionPointClick(node.id, 'left');
                }}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}