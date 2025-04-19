import {MediaType} from '../types/index'

export const detectMediaType = (src: string | Blob | ArrayBuffer | Uint8Array, mimeType?: string): MediaType => {
    if (mimeType) {
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('video/')) return 'video';
      if (mimeType.startsWith('audio/')) return 'audio';
      if (mimeType === 'application/pdf') return 'pdf';
    }
  
    if (typeof src === 'string') {
      if (src.endsWith('.pdf')) return 'pdf';
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(src)) return 'image';
      if (/\.(mp4|webm|ogg|mov)$/i.test(src)) return 'video';
      if (/\.(mp3|wav|ogg|aac)$/i.test(src)) return 'audio';
    }
  
    return 'unsupported';
  };