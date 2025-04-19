export const createObjectURL = (data: Blob | ArrayBuffer | Uint8Array, mimeType: string): string => {
    let blob: Blob;
    
    if (data instanceof Blob) {
      blob = data;
    } else {
      blob = new Blob([data], { type: mimeType });
    }
    
    return URL.createObjectURL(blob);
  };
  
  export const downloadBlob = (data: Blob | ArrayBuffer | Uint8Array, mimeType: string, fileName: string) => {
    const url = createObjectURL(data, mimeType);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  
  export const isBlob = (src: any): src is Blob => {
    return src instanceof Blob;
  };
  
  export const isArrayBuffer = (src: any): src is ArrayBuffer => {
    return src instanceof ArrayBuffer;
  };
  
  export const isUint8Array = (src: any): src is Uint8Array => {
    return src instanceof Uint8Array;
  };