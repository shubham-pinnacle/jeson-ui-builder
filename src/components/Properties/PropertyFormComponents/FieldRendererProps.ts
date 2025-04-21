import { Component } from "../../types";

export interface FieldRendererProps {
    component: Component;
    onPropertyChange: (prop: string, value: any) => void;
    screens: { id: string; title: string }[];
    selectedOptions: { title: string }[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<{ title: string }[]>>;
    fieldValues: { [key: string]: string };
    setFieldValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    handleFieldChange: (name: string, value: any) => void;
    handleOptionAdd: (field: string) => void;
    handleOptionDelete: (field: string, option: any) => void;
    isMobile: boolean;
  }
  
