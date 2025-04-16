import {
  FaHeading,
  FaFont,
  FaAlignLeft,
  FaParagraph,
  FaCheckSquare,
  FaList,
  FaCalendar,
  FaImage,
  FaLink,
  FaToggleOn,
  FaUserCircle,
  FaCamera,
  FaFile
} from 'react-icons/fa';

export interface ComponentDefinition {
  id: string;
  name: string;
  icon: any;
  category: string;
}

export const COMPONENT_CATEGORIES = {
  BASIC_TEXT: 'Basic Text',
  INPUT_FIELDS: 'Input Fields',
  MEDIA: 'Media',
  NAVIGATION: 'Navigation',
  USER: 'User'
} as const;

export const COMPONENTS: ComponentDefinition[] = [
  // Basic Text Components
  {
    id: 'text-heading',
    name: 'Text Heading',
    icon: FaHeading,
    category: COMPONENT_CATEGORIES.BASIC_TEXT
  },
  {
    id: 'sub-heading',
    name: 'Sub Heading',
    icon: FaFont,
    category: COMPONENT_CATEGORIES.BASIC_TEXT
  },
  {
    id: 'text-body',
    name: 'Text Body',
    icon: FaAlignLeft,
    category: COMPONENT_CATEGORIES.BASIC_TEXT
  },
  {
    id: 'text-caption',
    name: 'Text Caption',
    icon: FaParagraph,
    category: COMPONENT_CATEGORIES.BASIC_TEXT
  },

  // Input Field Components
  {
    id: 'opt-in',
    name: 'Opt In',
    icon: FaCheckSquare,
    category: COMPONENT_CATEGORIES.INPUT_FIELDS
  },
  {
    id: 'drop-down',
    name: 'Dropdown',
    icon: FaList,
    category: COMPONENT_CATEGORIES.INPUT_FIELDS
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    icon: FaCalendar,
    category: COMPONENT_CATEGORIES.INPUT_FIELDS
  },

  // Media Components
  {
    id: 'image',
    name: 'Image',
    icon: FaImage,
    category: COMPONENT_CATEGORIES.MEDIA
  },
  {
    id: 'PhotoPicker',
    name: 'Photo Picker',
    icon: FaCamera,
    category: COMPONENT_CATEGORIES.MEDIA
  },
  {
    id: 'DocumentPicker',
    name: 'Document Picker',
    icon: FaFile,
    category: COMPONENT_CATEGORIES.MEDIA
  },

  // Navigation Components
  {
    id: 'embedded-link',
    name: 'Embedded Link',
    icon: FaLink,
    category: COMPONENT_CATEGORIES.NAVIGATION
  },
  {
    id: 'footer-button',
    name: 'Footer Button',
    icon: FaToggleOn,
    category: COMPONENT_CATEGORIES.NAVIGATION
  },

  // User Components
  {
    id: 'user-details',
    name: 'User Details',
    icon: FaUserCircle,
    category: COMPONENT_CATEGORIES.USER
  }
];
