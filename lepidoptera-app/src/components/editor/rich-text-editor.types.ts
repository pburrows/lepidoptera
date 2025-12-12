/**
 * Type definitions for the RichTextEditor component
 */

export interface RichTextEditorProps {
  /**
   * Initial content value (HTML format)
   */
  value?: string;
  
  /**
   * Callback fired when content changes
   * @param content - HTML content string
   */
  onChange?: (content: string) => void;
  
  /**
   * Placeholder text shown when editor is empty
   */
  placeholder?: string;
  
  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean;
  
  /**
   * Minimum height of the editor
   * @default "200px"
   */
  minHeight?: string;
  
  /**
   * Maximum height of the editor (enables scrolling)
   */
  maxHeight?: string;
  
  /**
   * Whether to show the formatting toolbar
   * @default true
   */
  showToolbar?: boolean;
  
  /**
   * Enable inline comments feature (requires comments extension)
   * @default false
   */
  enableComments?: boolean;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * HTML id attribute
   */
  id?: string;
  
  /**
   * Whether to show character/word count
   * @default false
   */
  showCount?: boolean;
  
  /**
   * Custom extensions to add to the editor
   */
  extensions?: any[];
}

export interface EditorToolbarButton {
  /**
   * Button label/aria-label
   */
  label: string;
  
  /**
   * Icon component or element
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the button is active
   */
  isActive?: boolean;
  
  /**
   * Click handler
   */
  onClick: () => void;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

export interface EditorContent {
  /**
   * HTML content
   */
  html: string;
  
  /**
   * Markdown content (for future export feature)
   */
  markdown?: string;
  
  /**
   * Plain text content
   */
  text: string;
}

