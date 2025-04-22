import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextBody: React.FC<Props> = ({ component }) => {
  let weight = "normal";
  let style = "normal";
  let strikeThrough = "none";
  if(component.properties.fontWeight === "bold" ){
    weight = "bold";
  }
  else if (component.properties.fontWeight === "normal") {
    weight = "normal";
  }

  if (component.properties.fontWeight === "italic") {
    style = "italic";
  }
  if (component.properties.fontWeight === "bold_italic") {
    style = "italic";
    weight = "bold";
  }

  if (component.properties.strikethrough === "true") {
    strikeThrough = "line-through";
  }
  else{
    strikeThrough = "none";
  }
  
  return (
    <Typography
      variant="body1"
      sx={{ color: '#333', fontWeight: `${weight}`, fontStyle: `${style}`, textDecoration: `${strikeThrough}` }}
    >
      {component.properties?.text}
    </Typography>
  );
};

export default SimulatorTextBody;
