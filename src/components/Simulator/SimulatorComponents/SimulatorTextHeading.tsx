import React from 'react';
import { Typography } from '@mui/material';
import { Component } from '../../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface Props { component: Component; }

const SimulatorTextHeading: React.FC<Props> = ({ component }) => {
  // Get variables from Redux store
  const dynamicVariables = useSelector((state: RootState) => state.dynamicVariables.variables);
  
  // Process text to replace variable placeholders with their actual values
  const processText = (text: string) => {
    if (!text) return '';
    let processedText = text;
    
    // Replace ${data.variableName} format with actual values
    if (text.includes('${data.')) {
      // Extract all variable names in the format ${data.name}
      const dataVarMatches = text.match(/\${data\.(.*?)}/g) || [];
      
      // Process each match
      dataVarMatches.forEach(match => {
        // Extract just the variable name from ${data.name}
        const varName = match.replace(/\${data\.(.*?)}/, '$1');
        // Find the variable in the Redux store
        const variable = dynamicVariables.find(v => v.name === varName);
        // Replace with sample/value if found, or keep as is if not found
        const replacement = variable ? variable.sample || variable.value || varName : varName;
        processedText = processedText.replace(match, replacement);
      });
    }
    
    // Also handle {{variableName}} format
    if (processedText.includes('{{')) {
      // Extract all variable names in the format {{name}}
      const braceVarMatches = processedText.match(/{{(.*?)}}/g) || [];
      
      // Process each match
      braceVarMatches.forEach(match => {
        // Extract just the variable name from {{name}}
        const varName = match.replace(/{{(.*?)}}/, '$1');
        // Find the variable in the Redux store
        const variable = dynamicVariables.find(v => v.name === varName);
        // Replace with sample/value if found, or keep as is if not found
        const replacement = variable ? variable.sample || variable.value || varName : varName;
        processedText = processedText.replace(match, replacement);
      });
    }
    
    return processedText;
  };

  // Process the text to get the final display value with variables resolved
  const displayText = processText(component.properties?.text || '');
  
  return (
    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
      {displayText}
    </Typography>
  );
};

export default SimulatorTextHeading;
