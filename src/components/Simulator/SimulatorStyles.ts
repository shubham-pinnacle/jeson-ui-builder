import styled from 'styled-components';
import { FormControl } from '@mui/material';

export const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin-bottom: 15px;
`;

export const PreviewFrame = styled.div`
  width: 300px;
  height: 70vh;
  background: white;
  border-radius: 32px;
  padding: 10px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  border: 3px solid #333;
  margin: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 13px;
    background: #333;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const PreviewHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

export const PreviewTitle = styled.h1`
  font-size: 18px;
  color: #333;
  margin: 0;
  text-align: center;
`;

interface PreviewContentProps {
  $hasFooter: boolean;
}

export const PreviewContent = styled.div<PreviewContentProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: ${props => (props.$hasFooter ? '60px' : '0')};
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
`;

export const StyledFormControl = styled(FormControl)`
  width: 100%;
  margin-bottom: 16px;
`;
