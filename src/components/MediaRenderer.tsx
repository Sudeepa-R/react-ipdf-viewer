import React from 'react';
import { MediaRenderProps } from '../types';

export const ImageRenderer: React.FC<MediaRenderProps> = ({ src, zoom, rotation, onError }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt=""
        onError={onError ? () => onError(new Error('Failed to load image')) : undefined}
        style={{
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transition: 'transform 0.4s ease',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export const VideoRenderer: React.FC<MediaRenderProps> = ({ src, zoom, rotation, onError }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease',
    }}>
      <video
        controls
        src={src}
        onError={onError ? () => onError(new Error('Failed to load video')) : undefined}
        style={{
          transform: `scale(${zoom})`,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export const AudioRenderer: React.FC<MediaRenderProps> = ({ src, zoom, onError }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    }}>
      <audio
        controls
        src={src}
        onError={onError ? () => onError(new Error('Failed to load audio')) : undefined}
        style={{
          width: `${zoom * 100}%`,
          maxWidth: '100%',
        }}
      />
    </div>
  );
};

export const UnsupportedRenderer: React.FC<{ mimeType?: string }> = ({ mimeType }) => {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      color: '#666',
    }}>
      {mimeType ? `Unsupported media type: ${mimeType}` : 'Unsupported media type'}
    </div>
  );
};