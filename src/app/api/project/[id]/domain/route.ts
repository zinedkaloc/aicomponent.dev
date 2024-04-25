import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth";
import Agnost from "@/lib/agnost";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { endpoint } = Agnost.getServerClient();
  const { domain, isPrimary } = await req.json();

  try {
    const { data, errors } = await endpoint.post(
      "/add-domain",
      {
        domain,
        isPrimary,
        projectId: params.id,
      },
      undefined,
      {
        Session: getSessionCookie(),
      },
    );

    if (errors) {
      return NextResponse.json({ errors }, { status: errors.status });
    }

    const response = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains`,
      {
        body: JSON.stringify({ name: domain }),
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN_VERCEL}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );

    const domainData = await response.json();

    if (domainData.error?.code == "forbidden") {
      return NextResponse.json(
        {
          error: domainData.error,
        },
        { status: 403 },
      );
    } else if (domainData.error?.code == "domain_taken") {
      return NextResponse.json(
        {
          error: domainData.error,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
