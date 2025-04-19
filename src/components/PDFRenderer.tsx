import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Spin } from "antd";
import { MediaRenderProps } from "../types";

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
  rotation,
  onError,
}) => {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<Array<React.RefObject<HTMLCanvasElement>>>([]);

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(fileUrl);
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      renderAllPages(loadedPdf);
    };

    loadPdf();
  }, [fileUrl]);

  const renderAllPages = async (loadedPdf: pdfjsLib.PDFDocumentProxy) => {
    const numPages = loadedPdf.numPages;
    canvasRefs.current = Array(numPages)
      .fill(null)
      .map(() => React.createRef<HTMLCanvasElement>());

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await loadedPdf.getPage(pageNumber);
      const canvasRef = canvasRefs.current[pageNumber - 1];
      const canvas = canvasRef.current;

      if (!canvas) continue;

      const context = canvas.getContext("2d");
      if (!context) continue;

      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "80%",
        height: "100%",
        justifyContent: "center",
        transform: `scale(${zoom})`,
        transformOrigin: "left top",
        transition: "transform 0.5s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // transform: `rotate(${rotation}deg)`,
          // transition: "transform 0.5s ease",

          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            // overflowY: "auto",
            marginTop: "5px",
            marginBottom: "10px",
          }}
        >
          {pdf &&
            Array.from({ length: pdf.numPages }, (_, index) => (
              <canvas
                key={index}
                ref={canvasRefs.current[index]}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  transform: ` rotate(${rotation}deg)`,
                  transition: "transform 0.5s ease",
                }}
              />
            ))}
          {!pdf && (
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
