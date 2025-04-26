import { useState, useCallback, useEffect } from "react";

type ViewerTheme = "light" | "dark";

interface ViewerControls {
  zoom: number;
  rotation: number;
  isFullscreen: boolean;
  currentTheme: ViewerTheme;
  zoomIn: () => void;
  zoomOut: () => void;
  // rotate: (degrees: number) => void;
  rotateLeft: (degrees: number) => void;
  rotateRight: (degrees: number) => void;
  reset: () => void;
  download: () => void;
  print: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleTheme: () => void;
}

export const useViewerControls = (
  initialZoom = 1,
  onDownload?: () => void,
  initialTheme: ViewerTheme = "light",
  onPrint?: () => void,
  rotateValue = 0
): ViewerControls => {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(rotateValue);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ViewerTheme>(initialTheme);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3)); // Cap at 3x zoom
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5)); // Floor at 0.5x zoom
  }, []);

  // Rotation control (fixed for negative values)
  // const rotate = useCallback((degrees: number) => {
  //   setRotation(prev => (prev + degrees + 360) % 360);
  // }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setZoom(initialZoom);
    setRotation(0);
  }, [initialZoom]);

  // File operations
  const download = useCallback(() => {
    onDownload?.();
  }, [onDownload]);

  const print = useCallback(() => {
    onPrint?.();
  }, [onPrint]);

  // Fullscreen handling with event listeners
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const enterFullscreen = useCallback(() => {
    document.documentElement
      .requestFullscreen?.()
      .then(() => setIsFullscreen(true))
      .catch(console.error);
  }, []);

  const exitFullscreen = useCallback(() => {
    document
      .exitFullscreen?.()
      .then(() => setIsFullscreen(false))
      .catch(console.error);
  }, []);

  // Theme management
  const toggleTheme = useCallback(() => {
    setCurrentTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  }, []);

  // const rotate = useCallback(() => {
  //   setRotation(prev => (prev + 90));
  // }, [rotateValue]);

  const rotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, [rotateValue]);

  const rotateRight = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, [rotateValue]);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, [initialTheme]);

  return {
    zoom,
    rotation,
    isFullscreen,
    currentTheme,
    zoomIn,
    zoomOut,
    // rotate
    rotateRight,
    rotateLeft,
    reset,
    download,
    print,
    enterFullscreen,
    exitFullscreen,
    toggleTheme,
  };
};
