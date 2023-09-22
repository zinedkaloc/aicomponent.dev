import { ImageResponse, NextRequest } from "next/server";
import { fetchProjectById } from "@/utils/auth";
export const runtime = "edge";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  },
) {
  const project = await fetchProjectById(params.id, "project");

  if (!project || !project?.content) {
    return new Response("Not found", {
      status: 404,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "flex-end",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to bottom, #000, #7149b6)",
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
            justifyContent: "flex-end",
            flexDirection: "column",
            flexWrap: "nowrap",
            backgroundColor: "transparent",
            padding: "0 5px 20px 5px",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#fff",
              fontSize: "3.6rem",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              WebkitBackgroundClip: "text",
            }}
          >
            <span
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                padding: "0.5rem 2rem",
                borderRadius: "20px",
              }}
            >
              {project.content}
            </span>
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
