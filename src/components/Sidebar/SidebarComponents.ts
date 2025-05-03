import type { IconType } from 'react-icons';
import { FaHeading, FaAlignLeft, FaParagraph, FaFont } from 'react-icons/fa';
import { BsTextareaResize, BsInputCursorText } from 'react-icons/bs';
import { MdRadioButtonChecked, MdCheckBox } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { BiImageAlt, BiImage } from 'react-icons/bi';
import { AiOutlineLink, AiOutlineCalendar } from 'react-icons/ai';
import { VscSymbolClass } from 'react-icons/vsc';
import { RiSwitchLine } from 'react-icons/ri';

export interface ComponentItem {
  id: string;
  name: string;
  icon: IconType;
}

export interface SidebarComponents {
  BasicText: ComponentItem[];
  TextEntry: ComponentItem[];
  SelectControls: ComponentItem[];
  Buttons: ComponentItem[];
  MediaInput: ComponentItem[];
  AdvancedControls: ComponentItem[];
}

export const SidebarComponents: SidebarComponents = {
  BasicText: [
    { id: 'text-heading', name: 'Text Heading', icon: FaHeading },
    { id: 'sub-heading', name: 'Sub Heading', icon: FaFont },
    { id: 'text-body', name: 'Text Body', icon: FaAlignLeft },
    { id: 'text-caption', name: 'Text Caption', icon: FaParagraph },
    { id: 'rich-text', name: 'Rich Text', icon: FaFont },
  ],
  TextEntry: [
    { id: 'text-input', name: 'Text Input', icon: BsInputCursorText },
    { id: 'text-area', name: 'Text Area', icon: BsTextareaResize },
  ],
  SelectControls: [
    { id: 'radio-button', name: 'Radio Button', icon: MdRadioButtonChecked },
    { id: 'check-box', name: 'Check Box', icon: MdCheckBox },
    { id: 'drop-down', name: 'Drop Down', icon: IoMdArrowDropdown },
  ],
  Buttons: [
    { id: 'footer-button', name: 'Footer Button', icon: AiOutlineLink },
    { id: 'embedded-link', name: 'Embedded Link', icon: AiOutlineLink },
    { id: 'opt-in', name: 'Opt In', icon: MdCheckBox },
  ],
  MediaInput: [
    { id: 'PhotoPicker', name: 'Photo', icon: BiImageAlt },
    { id: 'DocumentPicker', name: 'Document', icon: BiImageAlt },
    { id: 'image', name: 'Image', icon: BiImage },
  ],
  AdvancedControls: [
    { id: 'if-else', name: 'If‑Else', icon: VscSymbolClass },
    { id: 'switch', name: 'Switch', icon: RiSwitchLine },
    { id: 'date-picker', name: 'Date Picker', icon: AiOutlineCalendar },
    { id: 'calendar-picker', name: 'Calendar Picker', icon: AiOutlineCalendar },
    // { id: 'user-details', name: 'User Details', icon: RiUserLine },
  ],
};

export default SidebarComponents;
