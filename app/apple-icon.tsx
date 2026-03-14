import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "22%",
          background: "radial-gradient(circle at 35% 30%, #3d2010, #150804)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Bean body */}
        <div
          style={{
            width: 108,
            height: 140,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "radial-gradient(ellipse at 35% 28%, #c48840, #7a4020 50%, #3d1a08)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "8px 12px 24px rgba(0,0,0,0.7), inset -4px -6px 12px rgba(0,0,0,0.45), inset 3px 3px 8px rgba(200,140,70,0.25)",
          }}
        >
          {/* Specular highlight */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 36,
              height: 44,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(240,190,120,0.5), transparent 70%)",
            }}
          />
          {/* Soft edge glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              boxShadow: "inset 0 0 20px rgba(100,40,10,0.5)",
            }}
          />
          {/* Crease — top arc */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: "50%",
              width: 60,
              height: 32,
              marginLeft: -30,
              borderRadius: "0 0 50% 50%",
              borderBottom: "3px solid rgba(20,5,0,0.65)",
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
            }}
          />
          {/* Crease — bottom arc */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              width: 60,
              height: 32,
              marginLeft: -30,
              borderRadius: "50% 50% 0 0",
              borderTop: "3px solid rgba(20,5,0,0.65)",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "none",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
