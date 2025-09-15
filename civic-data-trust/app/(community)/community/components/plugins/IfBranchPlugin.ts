export const IfBranchPlugin = {
  id: 'if_branch',
  name: 'If/Branch',
  category: 'Control Flow',
  color: '#FFA500',
  inputs: [
    {
      id: 'input',
      type: 'any',
      label: 'Input Data'
    }
  ],
  outputs: [
    {
      id: 'true',
      type: 'any',
      label: 'True (1)'
    },
    {
      id: 'false',
      type: 'any',
      label: 'False (0)'
    }
  ],
  parameters: {
    condition: 1
  }
};

export default IfBranchPlugin;