import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #5a3a2a, #1a0a05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.6), inset 1px 1px 3px rgba(180,120,80,0.3)",
        }}
      >
        {/* Bean body */}
        <div
          style={{
            width: 18,
            height: 24,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "radial-gradient(ellipse at 35% 30%, #b07840, #6b3a1f 55%, #3d1a08)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 3px 5px rgba(0,0,0,0.5), inset -1px -2px 3px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(200,150,90,0.3)",
          }}
        >
          {/* Highlight */}
          <div
            style={{
              position: "absolute",
              top: 3,
              left: 3,
              width: 6,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(220,170,100,0.55), transparent 70%)",
            }}
          />
          {/* Crease — top curve */}
          <div
            style={{
              position: "absolute",
              top: 5,
              left: "50%",
              width: 10,
              height: 6,
              marginLeft: -5,
              borderRadius: "0 0 50% 50%",
              borderBottom: "1.5px solid rgba(30,10,0,0.7)",
              borderLeft: "none",
              borderRight: "none",
              borderTop: "none",
            }}
          />
          {/* Crease — bottom curve */}
          <div
            style={{
              position: "absolute",
              bottom: 5,
              left: "50%",
              width: 10,
              height: 6,
              marginLeft: -5,
              borderRadius: "50% 50% 0 0",
              borderTop: "1.5px solid rgba(30,10,0,0.7)",
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
