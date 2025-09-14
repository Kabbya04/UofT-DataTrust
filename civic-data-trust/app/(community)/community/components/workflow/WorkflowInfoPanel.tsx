import React from 'react';
import WorkflowManagement from './WorkflowManagement';
import WorkflowStats from './WorkflowStats';

interface WorkflowInfoPanelProps {
  isDarkMode: boolean;
}

export default function WorkflowInfoPanel({ isDarkMode }: WorkflowInfoPanelProps) {
  return (
    <>
      <WorkflowManagement />
      <WorkflowStats />
    </>
  );
}