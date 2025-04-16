import {
  ADD_COMPONENT,
  UPDATE_COMPONENT,
  DELETE_COMPONENT,
  UPDATE_COMPONENT_PROPERTY,
  ComponentState,
  ComponentActionTypes
} from '../types';

const initialState: ComponentState = {
  components: [],
  selectedComponent: null
};

export const componentReducer = (
  state = initialState,
  action: ComponentActionTypes
): ComponentState => {
  switch (action.type) {
    case ADD_COMPONENT:
      return {
        ...state,
        components: [...state.components, action.payload]
      };

    case UPDATE_COMPONENT:
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.id ? action.payload : component
        )
      };

    case DELETE_COMPONENT:
      return {
        ...state,
        components: state.components.filter(component => component.id !== action.payload)
      };

    case UPDATE_COMPONENT_PROPERTY:
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.componentId
            ? {
                ...component,
                properties: {
                  ...component.properties,
                  [action.payload.property]: action.payload.value
                }
              }
            : component
        )
      };

    default:
      return state;
  }
};
