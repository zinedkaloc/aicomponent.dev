import { ImageResponse } from "next/og";
import { getProjectById } from "@/lib/actions";
import { NextRequest } from "next/server";
import { badRequest, notFound } from "@/app/api";

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
  const projectGetter = await getProjectById(+params.id);

  if (!projectGetter.success) {
    return badRequest(projectGetter.errors);
  }

  const project = projectGetter.data;

  if (!project) {
    return notFound({ message: "Project not found" });
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
            paddingLeft: "4rem",
            paddingBottom: "4rem",
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
              {project.prompt}
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
