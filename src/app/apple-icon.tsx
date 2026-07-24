import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 10,
          padding: "0 28px 26px",
          background: "linear-gradient(135deg, #5B5FEF, #8B5CF6)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 30,
            width: 0,
            height: 0,
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderBottom: "26px solid #E8B45C",
            transform: "rotate(45deg)",
          }}
        />
        <div style={{ width: 22, height: 54, borderRadius: 6, background: "rgba(255,255,255,0.5)", display: "flex" }} />
        <div style={{ width: 22, height: 80, borderRadius: 6, background: "rgba(255,255,255,0.8)", display: "flex" }} />
        <div style={{ width: 22, height: 108, borderRadius: 6, background: "#FFFFFF", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
