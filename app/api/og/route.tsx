import { ImageResponse } from "next/server";
export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to bottom, #7149b6, #000)",
          fontSize: 40,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
            paddingLeft: "4rem",
            backgroundColor: "transparent",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: "5rem",
              fontWeight: "bold",
            }}
          >
            AIComponent.dev
          </div>

          <div
            style={{
              display: "flex",
              color: "#cbced0",
              fontSize: "3.6rem",
              textAlign: "center",
              WebkitBackgroundClip: "text",
            }}
          >
            No waitlist, just pure innovation.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
