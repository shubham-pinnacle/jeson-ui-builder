import React from 'react';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';
import { RootState } from '../../store';

interface PreviewContainerProps {
  isVisible: boolean;
}

const PreviewWrapper = styled('div')<PreviewContainerProps>(({ isVisible }) => ({
  width: '375px',
  minWidth: '375px',
  height: '100%',
  borderRight: '1px solid #e0e0e0',
  overflow: 'hidden',
  display: isVisible ? 'flex' : 'none',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
}));

const PhoneFrame = styled('div')({
  margin: '20px auto',
  width: '320px',
  height: '600px',
  border: '10px solid #333',
  borderRadius: '30px',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'white',
});

const PhoneContent = styled('div')({
  padding: '20px',
  height: '100%',
  overflowY: 'auto',
});

interface MobilePreviewProps {
  isVisible: boolean;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ isVisible }) => {
  const components = useSelector((state: RootState) => state.component.components);

  const renderComponent = (component: any) => {
    switch (component.type) {
      case 'text-heading':
        return (
          <Typography variant="h4" gutterBottom>
            {component.properties?.text || 'Heading'}
          </Typography>
        );
      case 'sub-heading':
        return (
          <Typography variant="h6" gutterBottom>
            {component.properties?.text || 'Subheading'}
          </Typography>
        );
      case 'text-body':
        return (
          <Typography variant="body1" gutterBottom>
            {component.properties?.text || 'Body text'}
          </Typography>
        );
      case 'text-caption':
        return (
          <Typography variant="caption" display="block" gutterBottom>
            {component.properties?.text || 'Caption text'}
          </Typography>
        );
      case 'opt-in':
        return (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <input
              type="checkbox"
              checked={component.properties?.initValue === 'true'}
              readOnly
            />
            <Typography variant="body2">
              {component.properties?.label || 'Opt-in'}
            </Typography>
          </Box>
        );
      default:
        return (
          <Box border={1} p={1} mb={1} borderRadius={1} borderColor="#ddd">
            {component.name}
          </Box>
        );
    }
  };

  return (
    <PreviewWrapper isVisible={isVisible}>
      <PhoneFrame>
        <PhoneContent>
          {components.map(component => (
            <Box 
              key={component.id}
              sx={{
                display: component.properties?.visible === 'false' ? 'none' : 'block'
              }}
            >
              {renderComponent(component)}
            </Box>
          ))}
        </PhoneContent>
      </PhoneFrame>
    </PreviewWrapper>
  );
};
