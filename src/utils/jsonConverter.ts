import { DynamicVariable } from "../components/Settings/AddDynamicVariableDialog";

// Convert dynamic variables to the JSON structure as shown in the screenshots
export const convertDynamicVariablesToJson = (
  screenName: string, 
  variables: DynamicVariable[]
): string => {
  // Filter variables for this screen
  const screenVariables = variables.filter(v => v.screen === screenName);
  
  // Create the data object structure
  const dataObject: Record<string, any> = {
    "extraDetails": ""
  };
  
  // Add each variable to the data object based on its type
  screenVariables.forEach(variable => {
    switch (variable.type) {
      case 'String':
        dataObject[variable.name] = variable.sample || "";
        break;
      case 'Boolean':
        dataObject[variable.name] = variable.booleanValue || false;
        break;
      case 'Number':
        dataObject[variable.name] = variable.numberValue || 0;
        break;
      case 'Array':
        if (variable.arraySamples && variable.arraySamples.length > 0) {
          dataObject[variable.name] = variable.arraySamples;
        } else {
          dataObject[variable.name] = [];
        }
        break;
    }
  });
  
  // Create the final JSON structure
  const jsonStructure = {
    "screen": screenName,
    "data": dataObject
  };
  
  return JSON.stringify(jsonStructure, null, 2);
};

// Parse JSON back into dynamic variables
export const parseJsonToDynamicVariables = (
  jsonString: string
): DynamicVariable[] => {
  try {
    const jsonData = JSON.parse(jsonString);
    const screenName = jsonData.screen;
    const data = jsonData.data || {};
    
    const variables: DynamicVariable[] = [];
    
    // Parse each property in the data object
    Object.entries(data).forEach(([key, value]) => {
      // Skip extraDetails
      if (key === "extraDetails") return;
      
      let variable: DynamicVariable = {
        name: key,
        type: 'String', // Default
        screen: screenName,
        value: String(value)
      };
      
      // Determine the type based on the value
      if (typeof value === 'boolean') {
        variable.type = 'Boolean';
        variable.booleanValue = value;
      } else if (typeof value === 'number') {
        variable.type = 'Number';
        variable.numberValue = value;
      } else if (Array.isArray(value)) {
        variable.type = 'Array';
        variable.arraySamples = value;
      } else {
        variable.sample = String(value);
      }
      
      variables.push(variable);
    });
    
    return variables;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
};
