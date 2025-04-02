import { DropResult } from 'react-beautiful-dnd';

export interface Component {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
}

export interface BuilderProps {
  components: Component[];
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
  onPropertyChange: (componentId: string, property: string, value: any) => void;
  onDeleteComponent: (componentId: string) => void;
  onDragEnd: (result: DropResult) => void;
  onAddComponent: (type: string) => void;
}

export interface SidebarProps {
  components: Component[];
  onComponentSelect: (component: Component | null) => void;
  onDeleteComponent: (componentId: string) => void;
  onAddComponent: (type: string) => void;
}

export interface MetaJsonGeneratorProps {
  jsonInput: string;
  onJsonChange: (newJson: string) => void;
  onMetaGenerate: (metaJson: any) => void;
}

export interface MobilePreviewProps {
  components: Component[];
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
}

export interface DroppedComponentProps {
  $isSelected: boolean;
  $type: string;
}

export interface PropertyConfig {
  label: string;
  type: 'text' | 'select' | 'color';
  options?: string[];
}

export type ComponentProperties = {
  [key: string]: PropertyConfig;
}

export const componentProperties: { [key: string]: ComponentProperties } = {
  'text-body': {
    text: {
      label: 'Text Content',
      type: 'text'
    },
    color: {
      label: 'Text Color',
      type: 'color'
    }
  },
  'text-input': {
    placeholder: {
      label: 'Placeholder',
      type: 'text'
    },
    label: {
      label: 'Label',
      type: 'text'
    }
  },
  'footer-button': {
    buttonText: {
      label: 'Button Text',
      type: 'text'
    },
    variant: {
      label: 'Variant',
      type: 'select',
      options: ['contained', 'outlined', 'text']
    }
  }
}; 