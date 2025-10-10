import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "WellNourish AI - Personal AI-Powered Diet & Workout Planner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #16a34a 0%, #059669 50%, #065f46 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "60px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              background: "#16a34a",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                color: "white",
              }}
            >
              🥗
            </div>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#065f46",
              marginBottom: "20px",
              lineHeight: "1.1",
            }}
          >
            WellNourish AI
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "32px",
              color: "#374151",
              marginBottom: "30px",
              lineHeight: "1.3",
            }}
          >
            Personal AI-Powered Diet & Workout Planner
          </p>

          {/* Feature highlights */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              fontSize: "20px",
              color: "#16a34a",
              fontWeight: "600",
            }}
          >
            <span>🎯 Personalized Plans</span>
            <span>🤖 AI-Powered</span>
            <span>📊 Progress Tracking</span>
          </div>

          {/* Domain */}
          <div
            style={{
              marginTop: "40px",
              fontSize: "24px",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            wellnourishai.in
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
