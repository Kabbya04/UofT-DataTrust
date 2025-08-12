'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { KonvaEventObject } from 'konva/lib/Node';
import { RootState } from '@/app/store';
import { 
  addConnection, 
  updateNode, 
  setZoom, 
  setViewport,
  startConnecting,
  endConnecting,
  setSelectedNodes,
  deleteNode
} from '@/app/store/workflowSlice';
import CanvasNode from './CanvasNode';
import CanvasConnection from './CanvasConnection';
import CanvasControls from './CanvasControls';
import Minimap from './Minimap';
import NodeConfigPanel from './NodeConfigPanel';

interface WorkflowCanvasProps {
  canvasNodes: any[];
  onDrop: (e: React.DragEvent) => void;
  draggedPlugin: any;
}

export default function WorkflowCanvas({ canvasNodes, onDrop, draggedPlugin }: WorkflowCanvasProps) {
  const dispatch = useDispatch();
  const { nodes, connections, zoom, viewport, isConnecting, connectingFrom, selectedNodeIds } = 
    useSelector((state: RootState) => state.workflow);
  
  const stageRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [tempConnection, setTempConnection] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [configPanelNode, setConfigPanelNode] = useState<string | null>(null);

  // Handle canvas resize
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

  // Handle node dragging
  const handleNodeDrag = useCallback((nodeId: string, e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    dispatch(updateNode({
      id: nodeId,
      updates: {
        x: node.x(),
        y: node.y()
      }
    }));
  }, [dispatch]);

  // Handle port click for connections
  const handlePortClick = useCallback((nodeId: string, portId: string, portType: 'input' | 'output') => {
    if (!isConnecting) {
      // Start connection from output port
      if (portType === 'output') {
        dispatch(startConnecting({ nodeId, portId }));
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
          const portIndex = node.outputs?.findIndex(p => p.id === portId) || 0;
          const portY = node.height / 2 + (portIndex * 25) - ((node.outputs?.length || 1) - 1) * 12.5;
          setTempConnection({
            x1: node.x + node.width,
            y1: node.y + portY,
            x2: node.x + node.width,
            y2: node.y + portY
          });
        }
      }
    } else if (connectingFrom && portType === 'input' && connectingFrom.nodeId !== nodeId) {
      // Complete connection to input port
      const connectionId = `conn-${Date.now()}`;
      dispatch(addConnection({
        id: connectionId,
        sourceNodeId: connectingFrom.nodeId,
        sourcePortId: connectingFrom.portId,
        targetNodeId: nodeId,
        targetPortId: portId,
        type: 'main'
      }));
      dispatch(endConnecting());
      setTempConnection(null);
    }
  }, [isConnecting, connectingFrom, nodes, dispatch]);

  // Handle mouse move for temp connection
  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (isConnecting && tempConnection && stageRef.current) {
      const stage = stageRef.current;
      const point = stage.getPointerPosition();
      if (point) {
        setTempConnection({
          ...tempConnection,
          x2: (point.x - viewport.x) / zoom,
          y2: (point.y - viewport.y) / zoom
        });
      }
    }
  }, [isConnecting, tempConnection, viewport, zoom]);

  // Handle click on empty canvas
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    // Check if clicking on empty space
    if (e.target === e.target.getStage()) {
      dispatch(setSelectedNodes([]));
      setConfigPanelNode(null);
      if (isConnecting) {
        dispatch(endConnecting());
        setTempConnection(null);
      }
    }
  }, [isConnecting, dispatch]);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
    
    dispatch(setZoom(newScale));
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    stage.position(newPos);
    dispatch(setViewport(newPos));
  }, [dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected nodes
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeIds.length > 0) {
        selectedNodeIds.forEach(id => {
          dispatch(deleteNode(id));
        });
      }
      
      // Select all
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        dispatch(setSelectedNodes(nodes.map(n => n.id)));
      }
      
      // Zoom controls
      if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        dispatch(setZoom(Math.min(2, zoom * 1.1)));
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        dispatch(setZoom(Math.max(0.1, zoom / 1.1)));
      }
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        dispatch(setZoom(1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, nodes, zoom, dispatch]);

  // Fit view function
  const handleFitView = useCallback(() => {
    if (nodes.length === 0) return;
    
    const bounds = nodes.reduce((acc, node) => ({
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
    
    const padding = 50;
    const scaleX = (canvasSize.width - padding * 2) / (bounds.maxX - bounds.minX);
    const scaleY = (canvasSize.height - padding * 2) / (bounds.maxY - bounds.minY);
    const newZoom = Math.min(1, Math.min(scaleX, scaleY));
    
    dispatch(setZoom(newZoom));
    dispatch(setViewport({
      x: -bounds.minX * newZoom + padding,
      y: -bounds.minY * newZoom + padding
    }));
  }, [nodes, canvasSize, dispatch]);

  return (
    <div
      id="canvas-container"
      className="relative w-full h-full overflow-hidden bg-gray-50"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={viewport.x}
        y={viewport.y}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onClick={handleStageClick}
        draggable
        onDragEnd={(e) => {
          dispatch(setViewport({
            x: e.target.x(),
            y: e.target.y()
          }));
        }}
      >
        <Layer>
          {/* Render connections */}
          {connections.map(conn => (
            <CanvasConnection
              key={conn.id}
              connection={conn}
              sourceNode={nodes.find(n => n.id === conn.sourceNodeId)}
              targetNode={nodes.find(n => n.id === conn.targetNodeId)}
            />
          ))}
          
          {/* Render temp connection while connecting */}
          {tempConnection && (
            <Line
              points={[tempConnection.x1, tempConnection.y1, tempConnection.x2, tempConnection.y2]}
              stroke="#9CA3AF"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
          
          {/* Render nodes */}
          {nodes.map(node => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              onDrag={handleNodeDrag}
              onPortClick={handlePortClick}
              onSelect={() => dispatch(setSelectedNodes([node.id]))}
              onConfig={() => setConfigPanelNode(node.id)}
            />
          ))}
        </Layer>
      </Stage>
      
      {/* Canvas Controls */}
      <CanvasControls
        zoom={zoom}
        onZoomIn={() => dispatch(setZoom(Math.min(2, zoom * 1.2)))}
        onZoomOut={() => dispatch(setZoom(Math.max(0.1, zoom / 1.2)))}
        onZoomReset={() => dispatch(setZoom(1))}
        onFitView={handleFitView}
      />
      
      {/* Minimap */}
      <Minimap
        nodes={nodes}
        viewport={viewport}
        zoom={zoom}
        canvasSize={canvasSize}
      />
      
      {/* Node Configuration Panel */}
      {configPanelNode && (
        <NodeConfigPanel
          nodeId={configPanelNode}
          onClose={() => setConfigPanelNode(null)}
        />
      )}
    </div>
  );
}