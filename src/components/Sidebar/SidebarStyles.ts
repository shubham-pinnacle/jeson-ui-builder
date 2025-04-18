import styled from 'styled-components';


export const FlowNameContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers content horizontally */
  align-items: center; /* Centers content vertically */
  // border: 1px solid #ccc;
  background-color:#eee;
  padding: 10px;
  border-radius: 5px;

`;

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  background: white;
  height: 100%;
  padding: 20px;
  border-right: 0.5px solid #ffff;
  overflow-y: scroll; /* Still allow scrolling */
  
  /* Hide scrollbar for Firefox */
  scrollbar-width: none; 
  
  /* Hide scrollbar for IE, Edge */
  -ms-overflow-style: none; 
  
  /* Hide scrollbar for Chrome, Safari, and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  color: #333;
  margin: 20px 0 10px;
  font-weight: 600;
`;

export const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ComponentCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
    border-color: #2196f3;
  }
`;

export const ComponentName = styled.span`
  font-size: 12px;
  color: #666;
  text-align: center;
  font-weight: bold;
`;