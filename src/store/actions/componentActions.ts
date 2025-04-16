import {
  ADD_COMPONENT,
  UPDATE_COMPONENT,
  DELETE_COMPONENT,
  UPDATE_COMPONENT_PROPERTY,
  Component,
  ComponentActionTypes
} from '../types';

export const addComponent = (component: Component): ComponentActionTypes => ({
  type: ADD_COMPONENT,
  payload: component
});

export const updateComponent = (component: Component): ComponentActionTypes => ({
  type: UPDATE_COMPONENT,
  payload: component
});

export const deleteComponent = (componentId: string): ComponentActionTypes => ({
  type: DELETE_COMPONENT,
  payload: componentId
});

export const updateComponentProperty = (
  componentId: string,
  property: string,
  value: any
): ComponentActionTypes => ({
  type: UPDATE_COMPONENT_PROPERTY,
  payload: {
    componentId,
    property,
    value
  }
});
