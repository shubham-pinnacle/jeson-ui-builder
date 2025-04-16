import React from 'react';
import { useDispatch } from 'react-redux';
import { updateComponentProperty } from '../../../store/actions/componentActions';
import { Component } from '../../../store/types';
import { Box, Typography } from '@mui/material';

interface BuilderComponentProps {
  component: Component;
}

export const BuilderComponent: React.FC<BuilderComponentProps> = ({ component }) => {
  const dispatch = useDispatch();

  const handlePropertyChange = (property: string, value: any) => {
    dispatch(updateComponentProperty(component.id, property, value));
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'text-heading':
        return (
          <Typography variant="h4">
            {component.properties?.text || 'Heading'}
          </Typography>
        );
      case 'text-body':
        return (
          <Typography>
            {component.properties?.text || 'Body Text'}
          </Typography>
        );
      // Add more component types here
      default:
        return (
          <Box border={1} p={2} borderRadius={1}>
            {component.name}
          </Box>
        );
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        '&:hover': {
          outline: '2px solid #1976d2',
          outlineOffset: '2px'
        }
      }}
    >
      {renderComponent()}
    </Box>
  );
};
