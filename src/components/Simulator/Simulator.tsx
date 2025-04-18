import React from 'react';
import { Component } from '../types';
import {
  Box,
} from '@mui/material';

import {
  PreviewContainer,
  PreviewFrame,
  PreviewHeader,
  PreviewTitle,
  PreviewContent,
  FooterContainer,
} from './SimulatorStyles';

import SimulatorTextHeading       from './SimulatorComponents/SimulatorTextHeading';
import SimulatorSubHeading        from './SimulatorComponents/SimulatorSubHeading';
import SimulatorTextBody          from './SimulatorComponents/SimulatorTextBody';
import SimulatorTextCaption       from './SimulatorComponents/SimulatorTextCaption';
import SimulatorTextInput         from './SimulatorComponents/SimulatorTextInput';
import SimulatorTextArea          from './SimulatorComponents/SimulatorTextArea';
import SimulatorDropDown          from './SimulatorComponents/SimulatorDropDown';
import SimulatorRadioButton       from './SimulatorComponents/SimulatorRadioButton';
import SimulatorCheckBoxGroup     from './SimulatorComponents/SimulatorCheckBoxGroup';
import SimulatorFooterButton      from './SimulatorComponents/SimulatorFooterButton';
import SimulatorOptIn             from './SimulatorComponents/SimulatorOptIn';
import SimulatorFilePicker        from './SimulatorComponents/SimulatorFilePicker';
import SimulatorImage             from './SimulatorComponents/SimulatorImage';
import SimulatorEmbeddedLink      from './SimulatorComponents/SimulatorEmbeddedLink';
import SimulatorDatePicker        from './SimulatorComponents/SimulatorDatePicker';

interface SimulatorProps {
  components: Component[];
  screenTitle: string;
}

const componentMap: { [key: string]: React.FC<{ component: Component }> } = {
  'text-heading':    SimulatorTextHeading,
  'sub-heading':     SimulatorSubHeading,
  'text-body':       SimulatorTextBody,
  'text-caption':    SimulatorTextCaption,
  'text-input':      SimulatorTextInput,
  'text-area':       SimulatorTextArea,
  'drop-down':       SimulatorDropDown,
  'radio-button':    SimulatorRadioButton,
  'check-box':       SimulatorCheckBoxGroup,
  'opt-in':          SimulatorOptIn,
  PhotoPicker:       SimulatorFilePicker,
  DocumentPicker:    SimulatorFilePicker,
  image:             SimulatorImage,
  'embedded-link':   SimulatorEmbeddedLink,
  'date-picker':     SimulatorDatePicker,
};

const Simulator: React.FC<SimulatorProps> = ({ components, screenTitle }) => {
  const footerComponent = components.find(c => c.type === 'footer-button');
  const nonFooterComponents = components.filter(c => c.type !== 'footer-button');

  const renderComponent = (component: Component) => {
    if (component.properties?.visible === 'false') return null;
    const Renderer = componentMap[component.type];
    return Renderer ? <Renderer key={component.id} component={component} /> : null;
  };

  return (
    <PreviewContainer>
      <PreviewFrame>
        <PreviewHeader>
          <PreviewTitle>{screenTitle}</PreviewTitle>
        </PreviewHeader>

        <PreviewContent $hasFooter={!!footerComponent}>
          {nonFooterComponents.map(renderComponent)}
        </PreviewContent>

        {footerComponent && (
          <FooterContainer>
            <SimulatorFooterButton component={footerComponent} />
          </FooterContainer>
        )}
      </PreviewFrame>
    </PreviewContainer>
  );
};

export default Simulator;
