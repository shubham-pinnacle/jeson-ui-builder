export interface ComponentType {
  id: string;
  type: string;
  label?: string;
  name?: string;
  required?: boolean;
  children?: ComponentType[];
  data?: {
    extraDetails?: {
      type?: string;
      example?: string;
    };
    source?: Array<{
      id: string;
      title: string;
    }>;
  };
  layout?: {
    type: string;
    children: ComponentType[];
  };
}

export interface UIState {
  components: ComponentType[];
  selectedComponent: ComponentType | null;
  jsonOutput: string;
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
} 