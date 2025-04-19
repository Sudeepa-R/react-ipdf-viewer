import * as PDFJS from 'pdfjs-dist/types/src/pdf';

declare global {
  interface Window {
    pdfjsLib: typeof PDFJS;
  }
}