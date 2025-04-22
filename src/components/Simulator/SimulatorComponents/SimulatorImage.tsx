import React from 'react';
import { Component } from '../../types';
import { Box } from '@mui/material';

interface Props { component: Component; }

const SimulatorImage: React.FC<Props> = ({ component }) => {
  const {
    base64Data,
    src,
    altText,
    width,
    height,
    aspectRatio,
    scaleType,
  } = component.properties || {};

  const imageSrc = base64Data
    ? `data:image/png;base64,${base64Data}`
    : src || '';

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <img
        src={imageSrc}
        alt={altText || ''}
        style={{
          width: width || 200,
          height: height || 200,
          aspectRatio: aspectRatio || 1,
          objectFit: scaleType || 'contain',
          maxWidth: '100%',
        }}
      />
    </Box>
  );
};

export default SimulatorImage;
