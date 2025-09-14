import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import NotebookView from '../components/notebook/NotebookView';
import NotebookCleanupModal from '../components/notebook/NotebookCleanupModal';

// NotebookView Stories
const NotebookViewMeta: Meta<typeof NotebookView> = {
  title: 'Notebook/Notebook View',
  component: NotebookView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A component that displays the Jupyter notebook iframe with loading and error states.',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    url: {
      control: 'text',
      description: 'Jupyter notebook URL',
    },
  },
  tags: ['autodocs'],
};

export default NotebookViewMeta;

type NotebookViewStory = StoryObj<typeof NotebookView>;

export const Loading: NotebookViewStory = {
  args: {
    loading: true,
    url: '',
  },
};

export const LoadedWithUrl: NotebookViewStory = {
  args: {
    loading: false,
    url: 'http://localhost:8888/lab',
  },
};

export const FailedToLoad: NotebookViewStory = {
  args: {
    loading: false,
    url: '',
  },
};

// NotebookCleanupModal Stories
const NotebookCleanupModalMeta: Meta<typeof NotebookCleanupModal> = {
  title: 'Notebook/Cleanup Modal',
  component: NotebookCleanupModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal dialog for handling file cleanup before opening the notebook.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Modal visibility state',
    },
    onCleanupAndStart: {
      action: 'cleanup-and-start',
      description: 'Callback for cleanup and start action',
    },
    onKeepFilesAndStart: {
      action: 'keep-files-and-start',
      description: 'Callback for keeping files and start action',
    },
    onCancel: {
      action: 'cancel',
      description: 'Callback for cancel action',
    },
  },
  tags: ['autodocs'],
};

export const CleanupModalOpen: StoryObj<typeof NotebookCleanupModal> = {
  args: {
    isOpen: true,
    onCleanupAndStart: action('cleanup-and-start'),
    onKeepFilesAndStart: action('keep-files-and-start'),
    onCancel: action('cancel'),
  },
};

export const CleanupModalClosed: StoryObj<typeof NotebookCleanupModal> = {
  args: {
    isOpen: false,
    onCleanupAndStart: action('cleanup-and-start'),
    onKeepFilesAndStart: action('keep-files-and-start'),
    onCancel: action('cancel'),
  },
};

// Interactive example
export const InteractiveCleanupModal: StoryObj<typeof NotebookCleanupModal> = {
  args: {
    isOpen: true,
    onCleanupAndStart: async () => {
      action('cleanup-and-start')();
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Files cleaned up and notebook started!');
    },
    onKeepFilesAndStart: () => {
      action('keep-files-and-start')();
      alert('Keeping files and starting notebook!');
    },
    onCancel: () => {
      action('cancel')();
      alert('Operation cancelled');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive version of the cleanup modal with simulated actions.',
      },
    },
  },
};