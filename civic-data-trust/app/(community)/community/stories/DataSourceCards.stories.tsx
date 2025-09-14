import type { Meta, StoryObj } from '@storybook/react';
import ImageDataCard from '../components/data-sources/ImageDataCard';
import JsonDataCard from '../components/data-sources/JsonDataCard';
import CsvDataCard from '../components/data-sources/CsvDataCard';
import DatabaseCard from '../components/data-sources/DatabaseCard';
import DataSourcesPanel from '../components/data-sources/DataSourcesPanel';

// ImageDataCard Stories
const ImageDataCardMeta: Meta<typeof ImageDataCard> = {
  title: 'Data Sources/Image Data Card',
  component: ImageDataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for selecting image data sources. Shows image file information and selection state.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
  tags: ['autodocs'],
};

export default ImageDataCardMeta;

type ImageCardStory = StoryObj<typeof ImageDataCard>;

export const Default: ImageCardStory = {
  args: {
    isDarkMode: false,
  },
};

export const DarkMode: ImageCardStory = {
  args: {
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// JsonDataCard Stories
const JsonDataCardMeta: Meta<typeof JsonDataCard> = {
  title: 'Data Sources/JSON Data Card',
  component: JsonDataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for adding JSON data sources. Allows custom JSON input configuration.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
  tags: ['autodocs'],
};

export const JsonDefault: StoryObj<typeof JsonDataCard> = {
  args: {
    isDarkMode: false,
  },
};

export const JsonDarkMode: StoryObj<typeof JsonDataCard> = {
  args: {
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// CsvDataCard Stories
const CsvDataCardMeta: Meta<typeof CsvDataCard> = {
  title: 'Data Sources/CSV Data Card',
  component: CsvDataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for uploading CSV data files. Handles file selection and processing.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
  tags: ['autodocs'],
};

export const CsvDefault: StoryObj<typeof CsvDataCard> = {
  args: {
    isDarkMode: false,
  },
};

export const CsvDarkMode: StoryObj<typeof CsvDataCard> = {
  args: {
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// DatabaseCard Stories
const DatabaseCardMeta: Meta<typeof DatabaseCard> = {
  title: 'Data Sources/Database Card',
  component: DatabaseCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A placeholder card component for future database connectivity features.',
      },
    },
  },
  tags: ['autodocs'],
};

export const DatabaseDefault: StoryObj<typeof DatabaseCard> = {};

// Complete Panel Story
const DataSourcesPanelMeta: Meta<typeof DataSourcesPanel> = {
  title: 'Data Sources/Complete Panel',
  component: DataSourcesPanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The complete data sources panel containing all data source cards in a grid layout.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: 'Enable dark mode styling',
    },
  },
  tags: ['autodocs'],
};

export const PanelDefault: StoryObj<typeof DataSourcesPanel> = {
  args: {
    isDarkMode: false,
  },
};

export const PanelDarkMode: StoryObj<typeof DataSourcesPanel> = {
  args: {
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};