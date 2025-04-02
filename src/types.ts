export interface Component {
  id: string;
  type: string;
  name: string;
  properties?: {
    [key: string]: string;
  };
}

export interface BuilderProps {
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
}

export interface DroppedComponentProps {
  isSelected: boolean;
  type: string;
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