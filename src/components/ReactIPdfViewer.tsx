import React, { useState, useEffect, useRef, useMemo } from "react";
import { useViewerControls } from "../hooks/useViewerControls";
import { Toolbar } from "./Toolbar";
// import { PDFRenderer } from './PDFRenderer';
import PDFRenderer from "./PDFRenderer";
import {
  ImageRenderer,
  VideoRenderer,
  AudioRenderer,
  UnsupportedRenderer,
} from "./MediaRenderer";
import { detectMediaType } from "../utils/mediaTypeDetector";
import { createObjectURL } from "../utils/blobHelpers";
import { NexusViewerProps, MediaType } from "../types";

export const ReactIPdfViewer: React.FC<NexusViewerProps> = ({
  src,
  mimeType,
  fileName,
  onError,
  showControls = true,
  defaultZoom = 1,
  allowDownload = true,
  allowPrint = true,
  allowRotate = true,
  allowFullScreen = true,
  theme = "light",
  rotateValue = 0,
  autoHeight = true,
  className,
  style,
  renderToolbar,
}) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("unsupported");
  const [containerHeight, setContainerHeight] = useState("100%");
  const containerRef = useRef<HTMLDivElement>(null);

  const controls = useViewerControls(
    defaultZoom,
    () => {
      if (typeof src === "string") {
        const link = document.createElement("a");
        link.href = src;
        link.download = fileName || "download";
        link.click();
      } else {
        const url =
          mediaUrl ||
          createObjectURL(src, mimeType || "application/octet-stream");

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "download";

        if (url.startsWith("blob:")) {
          // Ensure Blob URL is revoked after download to avoid memory leaks
          link.addEventListener("click", () => {
            URL.revokeObjectURL(url);
          });
        }

        link.click();
      }
    },
    theme,
    // () => {
    //   const fileUrl =
    //     typeof src === "string"
    //       ? src
    //       : URL.createObjectURL(
    //           src instanceof Blob
    //             ? src
    //             : new Blob([src], {
    //                 type: mimeType || "application/octet-stream",
    //               })
    //         );

    //   const printFrame = document.createElement("iframe");
    //   printFrame.style.position = "fixed";
    //   printFrame.style.right = "0";
    //   printFrame.style.bottom = "0";
    //   printFrame.style.width = "0";
    //   printFrame.style.height = "0";
    //   printFrame.style.border = "0";
    //   printFrame.style.visibility = "hidden";

    //   document.body.appendChild(printFrame);

    //   const isPDF = fileUrl.includes(".pdf") || mimeType === "application/pdf";

    //   if (isPDF) {
    //     printFrame.onload = () => {
    //       try {
    //         printFrame.contentWindow?.focus();
    //         printFrame.contentWindow?.print();
    //       } catch (err) {
    //         console.error("Print error:", err);
    //       } finally {
    //         setTimeout(() => {
    //           document.body.removeChild(printFrame);
    //           if (typeof src !== "string") URL.revokeObjectURL(fileUrl);
    //         }, 1000);
    //       }
    //     };

    //     // ✅ Set src directly for PDFs — no srcdoc
    //     printFrame.src = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    //   } else {
    //     // For images and other types
    //     printFrame.onload = () => {
    //       setTimeout(() => {
    //         printFrame.contentWindow?.focus();
    //         printFrame.contentWindow?.print();
    //         setTimeout(() => {
    //           document.body.removeChild(printFrame);
    //           if (typeof src !== "string") URL.revokeObjectURL(fileUrl);
    //         }, 1000);
    //       }, 500);
    //     };

    //     // ✅ srcdoc is fine for images
    //     printFrame.srcdoc = `
    //       <!DOCTYPE html>
    //       <html>
    //         <head><title>Print</title></head>
    //         <body style="margin: 0;">
    //           <img src="${fileUrl}" style="max-width: 100%;" onload="window.print()" />
    //         </body>
    //       </html>
    //     `;
    //   }
    // },
    // () => {
    //   const fileUrl =
    //     typeof src === "string"
    //       ? src
    //       : URL.createObjectURL(
    //           new Blob([src], { type: mimeType || "application/octet-stream" })
    //         );

    //   const frame = document.createElement("iframe");
    //   frame.style.display = "none";
    //   document.body.appendChild(frame);

    //   const cleanUp = () => {
    //     document.body.removeChild(frame);
    //     if (typeof src !== "string") URL.revokeObjectURL(fileUrl);
    //   };

    //   const isPDF = fileUrl.includes(".pdf") || mimeType === "application/pdf";

    //   frame.onload = () => {
    //     frame.contentWindow?.focus();
    //     frame.contentWindow?.print();
    //     setTimeout(cleanUp, 1000);
    //   };

    //   frame.src = isPDF
    //     ? `${fileUrl}#toolbar=0`
    //     : `data:text/html,
    //       <html>
    //         <body style="margin:0">
    //           <img src='${fileUrl}' style='width:100%' onload='window.print()' />
    //         </body>
    //       </html>`;
    // },
    () => {
      const fileUrl = typeof src === "string"
        ? src
        : URL.createObjectURL(new Blob([src], { type: mimeType || "application/octet-stream" }));
    
      const frame = document.createElement("iframe");
      frame.style.display = "none";
      document.body.appendChild(frame);
    
      const isPDF = fileUrl.includes(".pdf") || mimeType === "application/pdf";
    
      frame.src = isPDF
        ? `${fileUrl}#toolbar=0`
        : `data:text/html,
          <html>
            <body style="margin:0">
              <img src='${fileUrl}' style='width:100%'>
            </body>
          </html>`;
    
      // Wait a little bit for iframe to load, then print directly
      setTimeout(() => {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(frame);
          if (typeof src !== "string") URL.revokeObjectURL(fileUrl);
        }, 1000);
      }, 500); // wait 0.5 sec to let iframe load
    },
    

    rotateValue
  );

  // Calculate height based on window size
  useEffect(() => {
    if (!autoHeight) {
      setContainerHeight("100%");
      return;
    }

    const updateHeight = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const rect = containerRef.current.getBoundingClientRect();
        const height = windowHeight - rect.top - 20; // 20px padding
        setContainerHeight(`${Math.max(height, 300)}px`); // Minimum 300px
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [autoHeight]);

  // Handle media source changes
  useEffect(() => {
    let url: string | null = null;

    const type = detectMediaType(src, mimeType);
    setMediaType(type);

    if (typeof src !== "string") {
      let effectiveMimeType = mimeType;
      if (!effectiveMimeType) {
        switch (type) {
          case "pdf":
            effectiveMimeType = "application/pdf";
            break;
          case "image":
            effectiveMimeType = "image/*";
            break;
          case "video":
            effectiveMimeType = "video/*";
            break;
          case "audio":
            effectiveMimeType = "audio/*";
            break;
          default:
            effectiveMimeType = "application/octet-stream";
        }
      }
      url = createObjectURL(src, effectiveMimeType);
      setMediaUrl(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [src, mimeType]);

  const themeStyles = {
    light: {
      backgroundColor: "#ffffff",
      color: "#000000",
    },
    dark: {
      backgroundColor: "#1e1e1e",
      color: "#ffffff",
    },
  };

  const renderMedia = useMemo(() => {
    const effectiveUrl = typeof src === "string" ? src : mediaUrl;
    if (!effectiveUrl) return null;

    const mediaProps = {
      fileUrl: effectiveUrl,
      src: effectiveUrl,
      mimeType: mimeType || "",
      zoom: controls.zoom,
      rotation: controls.rotation,
      theme: controls.currentTheme,
      onError,
    };

    switch (mediaType) {
      case "pdf":
        return <PDFRenderer {...mediaProps} />;
      case "image":
        return <ImageRenderer {...mediaProps} />;
      case "video":
        return <VideoRenderer {...mediaProps} />;
      case "audio":
        return <AudioRenderer {...mediaProps} />;
      default:
        return <UnsupportedRenderer mimeType={mimeType} />;
    }
  }, [
    src,
    mediaUrl,
    mediaType,
    mimeType,
    controls.zoom,
    controls.rotation,
    controls.currentTheme,
    onError,
  ]);

  return (
    <div
      ref={containerRef}
      className={`nexus-viewer ${className || ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        // width: "60%",
        height: containerHeight,
        ...themeStyles[controls.currentTheme],
        ...style,
        ...(controls.isFullscreen
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }
          : {}),
      }}
    >
      {showControls &&
        (renderToolbar ? (
          renderToolbar(controls)
        ) : (
          <Toolbar
            controls={controls}
            allowDownload={allowDownload}
            allowPrint={allowPrint}
            allowRotate={allowRotate}
            allowFullScreen={allowFullScreen}
          />
        ))}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
          // padding: "20px",
          backgroundColor:
            controls.currentTheme === "dark" ? "#2d2d2d" : "#f5f5f5",
        }}
      >
        {renderMedia}
      </div>
    </div>
  );
};
