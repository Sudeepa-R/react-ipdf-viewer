import React from 'react';

export type MediaType = 'pdf' | 'image' | 'video' | 'audio' | 'unsupported';
export type ViewerTheme = 'light' | 'dark';

export interface NexusViewerProps {
  src: string | Blob | ArrayBuffer | Uint8Array;
  mimeType?: string;
  fileName?: string;
  onError?: (error: Error) => void;
  showControls?: boolean;
  defaultZoom?: number;
  allowDownload?: boolean;
  allowPrint?: boolean;
  allowRotate?: boolean;
  allowFullScreen?: boolean;
  theme?: ViewerTheme;
  rotateValue?:number;
  autoHeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
  renderToolbar?: (controls: ViewerControls) => React.ReactNode;
}

export interface ViewerControls {
  zoom: number;
  rotation: number;
  download: () => void;
  print: () => void;
  // rotate: (degrees: number) => void;
  rotateRight: (degrees: number) => void;
  rotateLeft: (degrees: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  isFullscreen: boolean;
  toggleTheme: () => void;
  currentTheme: ViewerTheme;
}

export interface MediaRenderProps {
  src: string;
  mimeType: string;
  zoom: number;
  rotation: number;
  theme: ViewerTheme;
  onError?: (error: Error) => void;
}