import React, { useState, useEffect } from 'react';
import { Component } from '../../types';

interface Props { component: Component; }

const SimulatorTextInput: React.FC<Props> = ({ component }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const label = component.properties?.label || '';
  const initValue = component.properties?.initValue || '';

  const hasUserInput = value.length > 0;
  const isFloating = hasUserInput || focused;

  // If no user input and initValue exists, show it as placeholder
  const placeholder = !hasUserInput && !focused ? initValue : '';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Only display label when input is filled or focused */}
      {isFloating && (
        <label
          style={{
            position: 'absolute',
            left: '12px',
            top: '4px',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'white',
            padding: '0 4px',
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
          }}
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '16px 12px 8px 12px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          background: 'white',
          outline: 'none',
        }}
      />
    </div>
  );
};

export default SimulatorTextInput;
