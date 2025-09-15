export const SplitPlugin = {
  id: 'split',
  name: 'Split Data',
  color: '#9C27B0',
  inputs: [
    {
      id: 'input',
      type: 'csv',
      label: 'CSV Input'
    }
  ],
  outputs: [
    {
      id: 'output1',
      type: 'csv',
      label: 'Output 1'
    },
    {
      id: 'output2',
      type: 'csv',
      label: 'Output 2'
    }
  ],
  parameters: {
    splitType: 'rows',
    rowCount: 10,
    selectedColumns1: [],
    selectedColumns2: []
  }
};

export default SplitPlugin;