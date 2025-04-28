import React, { useState } from 'react';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextInput: React.FC<Props> = ({ component }) => {
  const [value, setValue] = useState('');
  const label = component.properties?.label || '';

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      style={{
        width: '100%',
        padding: '16px 12px 8px 12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        background: 'white',
        position: 'relative',
      }}
    />
  );
};

export default SimulatorTextInput;
