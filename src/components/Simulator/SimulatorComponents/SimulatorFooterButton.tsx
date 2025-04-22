import React from 'react';
import { Component } from '../../types';
import { Button,Box, Typography } from '@mui/material';

interface Props { component: Component; }

const SimulatorFooterButton: React.FC<Props> = ({ component }) => {
  const text = component.properties?.buttonText || 'Button';
  const variant =
    (component.properties?.variant as 'text' | 'outlined' | 'contained') ||
    'contained';

  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
    <Typography>
    {(component.properties?.leftCaption) && component.properties?.leftCaption  }
     

    </Typography>
    <Typography>
    {(component.properties?.centerCaption) && component.properties?.centerCaption  }
    </Typography>
<Typography>
{(component.properties?.rightCaption) && component.properties?.rightCaption  }
</Typography>
    </Box>
    <Button
      variant={variant}
      color="primary"
      fullWidth
      style={{ textTransform: 'none', marginTop: '8px' }}
      >
      {text}
    </Button>
      </>
  );
};

export default SimulatorFooterButton;
