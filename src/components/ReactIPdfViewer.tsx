import React, { useState, useEffect, useRef, useMemo } from "react";
import { useViewerControls } from "../hooks/useViewerControls";
import { Toolbar } from "./Toolbar";
// import { PDFRenderer } from './PDFRenderer';
import PDFRenderer from "./PDFRenderer";
import { NexusViewerProps, MediaType } from "../types";

export const ReactIPdfViewerLite: React.FC<NexusViewerProps> = ({
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

  const renderMedia = useMemo(() => {
    const effectiveUrl = typeof src === "string" ? src : mediaUrl;
    if (!effectiveUrl) return null;

    const mediaProps = {
      fileUrl: effectiveUrl,
    };

    switch (mediaType) {
      case "pdf":
        return <PDFRenderer {...mediaProps} />;
      // case "image":
      //   return <ImageRenderer {...mediaProps} />;
      // case "video":
      //   return <VideoRenderer {...mediaProps} />;
      // case "audio":
      //   return <AudioRenderer {...mediaProps} />;
      default:
        return <PDFRenderer {...mediaProps} />;
    }
  }, [src]);

  return <div>{renderMedia}</div>;
};
