// Component Types
export interface Component {
  id: string;
  type: string;
  name: string;
  properties?: Record<string, any>;
}

// Action Types
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const UPDATE_COMPONENT = 'UPDATE_COMPONENT';
export const DELETE_COMPONENT = 'DELETE_COMPONENT';
export const UPDATE_COMPONENT_PROPERTY = 'UPDATE_COMPONENT_PROPERTY';

// State Types
export interface ComponentState {
  components: Component[];
  selectedComponent: Component | null;
}

// Action Interfaces
interface AddComponentAction {
  type: typeof ADD_COMPONENT;
  payload: Component;
}

interface UpdateComponentAction {
  type: typeof UPDATE_COMPONENT;
  payload: Component;
}

interface DeleteComponentAction {
  type: typeof DELETE_COMPONENT;
  payload: string; // component id
}

interface UpdateComponentPropertyAction {
  type: typeof UPDATE_COMPONENT_PROPERTY;
  payload: {
    componentId: string;
    property: string;
    value: any;
  };
}

export type ComponentActionTypes = 
  | AddComponentAction 
  | UpdateComponentAction 
  | DeleteComponentAction 
  | UpdateComponentPropertyAction;
