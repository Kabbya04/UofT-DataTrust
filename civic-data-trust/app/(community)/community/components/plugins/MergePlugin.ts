export const MergePlugin = {
  id: 'merge',
  name: 'Merge Data',
  color: '#4CAF50',
  inputs: [
    {
      id: 'input1',
      type: 'csv',
      label: 'CSV Input 1'
    },
    {
      id: 'input2',
      type: 'csv',
      label: 'CSV Input 2'
    }
  ],
  outputs: [
    {
      id: 'output',
      type: 'csv',
      label: 'Merged CSV'
    }
  ],
  parameters: {
    mergeType: 'columns',
    selectedColumns: {
      input1: [],
      input2: []
    }
  }
};

export default MergePlugin;