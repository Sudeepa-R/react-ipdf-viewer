import React from "react";
import { ViewerControls, ViewerTheme } from "../types";
import {
  DownloadOutlined,
  PrinterOutlined,
  RotateRightOutlined,
  RotateLeftOutlined,
  MoonOutlined,
  SunOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

interface ToolbarProps {
  controls: ViewerControls;
  allowDownload?: boolean;
  allowPrint?: boolean;
  allowRotate?: boolean;
  allowFullScreen?: boolean;
}

const toolbarButtonStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid",
  borderRadius: "4px",
  padding: "6px 8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  margin: "0 2px",
};

export const Toolbar: React.FC<ToolbarProps> = ({
  controls,
  allowDownload = true,
  allowPrint = true,
  allowRotate = true,
  allowFullScreen = true,
}) => {
  const themeStyles = {
    light: {
      backgroundColor: "#F5F5F5",
      borderColor: "#dddddd",
      color: "#333333",
      hoverBackground: "#f0f0f0",
    },
    dark: {
      backgroundColor: "#333333",
      borderColor: "#555555",
      color: "#ffffff",
      hoverBackground: "#444444",
    },
  };

  const currentTheme = themeStyles[controls.currentTheme];
  const rotateValue = 0;

  const buttonStyle = {
    ...toolbarButtonStyle,
    backgroundColor: currentTheme.backgroundColor,
    borderColor: currentTheme.borderColor,
    color: currentTheme.color,
    ":hover": {
      backgroundColor: currentTheme.hoverBackground,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        backgroundColor: currentTheme.backgroundColor,
        borderBottom: `1px solid ${currentTheme.borderColor}`,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <div style={{display:"flex", alignItems:"center", paddingLeft:"5px"}}>
        <button
          onClick={controls.toggleTheme}
          title={`Switch to ${
            controls.currentTheme === "dark" ? "light" : "dark"
          } theme`}
          style={buttonStyle}
        >
          <span role="img" aria-label="theme-toggle">
            {controls.currentTheme === "dark" ? (
              <SunOutlined
                style={{ fontSize: "16px", color: currentTheme.color }}
              />
            ) : (
              <MoonOutlined
                style={{ fontSize: "16px", color: currentTheme.color }}
              />
            )}
          </span>
        </button>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
        <button
          onClick={controls.zoomOut}
          title="Zoom Out"
          style={buttonStyle}
          disabled={controls.zoom <= 0.5}
        >
          <span role="img" aria-label="zoom-out">
            <MinusOutlined
              style={{ fontSize: "16px", color: currentTheme.color }}
            />
          </span>
        </button>

        <span
          style={{
            minWidth: "40px",
            textAlign: "center",
            color: currentTheme.color,
          }}
        >
          {Math.round(controls.zoom * 100)}%
        </span>

        <button
          onClick={controls.zoomIn}
          title="Zoom In"
          style={buttonStyle}
          disabled={controls.zoom >= 3}
        >
          <span role="img" aria-label="zoom-in">
            <PlusOutlined
              style={{ fontSize: "16px", color: currentTheme.color }}
            />
          </span>
        </button>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:"3px", paddingRight:"5px"}}> 
        {allowDownload && (
          <button
            onClick={controls.download}
            title="Download"
            style={buttonStyle}
          >
            <span role="img" aria-label="download">
              <DownloadOutlined
                style={{ fontSize: "16px", color: currentTheme.color }}
              />
            </span>
          </button>
        )}

        {allowPrint && (
          <button onClick={controls.print} title="Print" style={buttonStyle}>
            <span role="img" aria-label="print">
              <PrinterOutlined
                style={{ fontSize: "16px", color: currentTheme.color }}
              />
            </span>
          </button>
        )}

        {allowRotate && (
          <>
            <button
              onClick={() => controls.rotateLeft(-90)}
              title="Rotate Left"
              style={buttonStyle}
            >
              <span role="img" aria-label="rotate-left">
                <RotateLeftOutlined
                  style={{ fontSize: "16px", color: currentTheme.color }}
                />
              </span>
            </button>
            <button
              onClick={() => controls.rotateRight(90)}
              title="Rotate Right"
              style={buttonStyle}
            >
              <span role="img" aria-label="rotate-right">
                <RotateRightOutlined
                  style={{ fontSize: "16px", color: currentTheme.color }}
                />
              </span>
            </button>
          </>
        )}
        {allowFullScreen && (
          <button
            onClick={
              controls.isFullscreen
                ? controls.exitFullscreen
                : controls.enterFullscreen
            }
            title={controls.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={buttonStyle}
          >
            <span role="img" aria-label="fullscreen">
              {controls.isFullscreen ? (
                <FullscreenExitOutlined
                  style={{ fontSize: "16px", color: currentTheme.color }}
                />
              ) : (
                <FullscreenOutlined
                  style={{ fontSize: "16px", color: currentTheme.color }}
                />
              )}
            </span>
          </button>
        )}
      </div>

      {/* {allowRotate && (
        <>
          <button
            onClick={() => controls.rotate(rotateValue-90)}
            title="Rotate Left"
            style={buttonStyle}
          >
            <span role="img" aria-label="rotate-left">↩️</span>
          </button>
          <button
            onClick={() => controls.rotate(rotateValue+90)}
            title="Rotate Right"
            style={buttonStyle}
          >
            <span role="img" aria-label="rotate-right">↪️</span>
          </button>
        </>
      )} */}

      {/* <button onClick={controls.reset} title="Reset" style={buttonStyle}>
        <span role="img" aria-label="reset">
          🔄
        </span>
      </button> */}
    </div>
  );
};
