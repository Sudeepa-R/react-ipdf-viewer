import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Spin } from "antd";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFRendererProps {
  fileUrl: string;
  mimeType: string;
  zoom: number;
  rotation: number;
  onError?: (error: Error) => void;
}

const PDFRenderer: React.FC<PDFRendererProps> = ({
  fileUrl,
  zoom = 1.5,
  rotation = 0,
  onError,
}) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<Array<React.RefObject<HTMLCanvasElement>>>([]);

  // Load PDF and create canvas refs
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);

        // Prepare canvas refs based on number of pages
        canvasRefs.current = Array(loadedPdf.numPages)
          .fill(null)
          .map(() => React.createRef<HTMLCanvasElement>());
      } catch (err) {
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    };

    loadPdf();
  }, [fileUrl, onError]);

  // Render pages after canvases are mounted
  useEffect(() => {
    const renderAllPages = async () => {
      if (!pdf || canvasRefs.current.length === 0) return;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        try {
          const page = await pdf.getPage(pageNumber);
          const canvas = canvasRefs.current[pageNumber - 1].current;

          if (!canvas) continue;

          const context = canvas.getContext("2d");
          if (!context) continue;

          // Important: rotation is passed here
          const viewport = page.getViewport({ scale: 1.5 });

          // Resize the canvas to match the page size
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Clear previous drawings
          context.clearRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
        } catch (err) {
          if (onError && err instanceof Error) {
            onError(err);
          }
        }
      }
    };

    renderAllPages();
  }, [pdf, zoom, rotation, onError]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
        height: "100%",
        justifyContent: "center",
        transition: "transform 0.5s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            marginTop: "5px",
            marginBottom: "10px",
            overflow: "auto",
          }}
        >
          {pdf ? (
            Array.from({ length: pdf.numPages }, (_, index) => (
              <canvas
                key={index}
                ref={canvasRefs.current[index]}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                }}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Spin size="large" tip="Loading PDF..." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFRenderer;
