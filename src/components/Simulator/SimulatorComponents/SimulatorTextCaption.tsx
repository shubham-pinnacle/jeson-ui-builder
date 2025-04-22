import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props {
  component: Component;
}

const SimulatorTextCaption: React.FC<Props> = ({ component }) => {
  // pull out props for clarity
  const { fontWeight, strikethrough, text } = component.properties;

  // defaults
  let weight: React.CSSProperties['fontWeight'] = 'normal';
  let fontStyle: React.CSSProperties['fontStyle'] = 'normal';
  let textDecoration: React.CSSProperties['textDecoration'] = 'none';

  // determine weight & style
  if (fontWeight === 'bold') {
    weight = 'bold';
  } else if (fontWeight === 'bold_italic') {
    weight = 'bold';
    fontStyle = 'italic';
  } else if (fontWeight === 'italic') {
    fontStyle = 'italic';
  }
  // determine strike‑through
  if (strikethrough === 'true' || strikethrough === true) {
    textDecoration = 'line-through';
  }

  return (
    <Typography
      variant="body2"
      sx={{
        color: '#999',
        fontWeight: weight,
        fontStyle: fontStyle,
        textDecoration: textDecoration,
      }}
    >
      {text}
    </Typography>
  );
};

export default SimulatorTextCaption;
