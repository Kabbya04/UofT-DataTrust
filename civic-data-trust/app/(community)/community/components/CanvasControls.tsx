import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ZoomIn, ZoomOut, Maximize2, Grid, Minus, MoreHorizontal } from 'lucide-react';
import { RootState } from '@/app/store';
import { setConnectionLineStyle } from '@/app/store/workflowSlice';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitView: () => void;
}

export default function CanvasControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitView
}: CanvasControlsProps) {
  const dispatch = useDispatch();
  const connectionLineStyle = useSelector((state: RootState) => state.workflow.connectionLineStyle);
  
  const toggleLineStyle = () => {
    dispatch(setConnectionLineStyle(connectionLineStyle === 'solid' ? 'dotted' : 'solid'));
  };
  
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Zoom In (Ctrl +)"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Zoom Out (Ctrl -)"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      
      <div className="px-2 py-1 text-xs text-center border-t border-b">
        {Math.round(zoom * 100)}%
      </div>
      
      <button
        onClick={onZoomReset}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Reset Zoom (Ctrl 0)"
      >
        <Grid className="w-5 h-5" />
      </button>
      
      <button
        onClick={onFitView}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Fit to View"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
      
      <div className="border-t my-1" />
      
      <button
        onClick={toggleLineStyle}
        className={`p-2 rounded transition-colors ${
          connectionLineStyle === 'solid' 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : 'hover:bg-gray-100'
        }`}
        title={`Connection Lines: ${connectionLineStyle === 'solid' ? 'Solid' : 'Dotted'} (Click to toggle)`}
      >
        {connectionLineStyle === 'solid' ? (
          <Minus className="w-5 h-5" />
        ) : (
          <MoreHorizontal className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}