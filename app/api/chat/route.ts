import { Configuration, OpenAIApi } from "openai-edge";

import { OpenAIStream, StreamingTextResponse } from "ai";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import altogic from "@/utils/altogic";
import { getSessionCookie } from "@/utils/auth";
import { Project } from "@/types";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const sessionToken = getSessionCookie();
  if (!sessionToken)
    return NextResponse.json({ code: "unauthorized" }, { status: 401 });

  const { messages, ...rest } = await req.json();

  // @ts-ignore
  altogic.auth.setSession({
    token: sessionToken,
  });

  const { content } = messages
    .filter((m: { role: string }) => m.role === "user")
    .at(-1);

  const {
    data: { credits, _id },
  } = await storeMessage({ content }, rest.projectId);

  altogic.realtime.send(
    rest.channelId,
    !rest.projectId ? "projectId" : "subProjectId",
    { id: _id, prompt: content },
  );

  if (credits === 0) {
    return NextResponse.json({ code: "no-credits", credits });
  }

  const systemPrompt = `You've been entrusted as the lead designer to architect a striking and engaging design system using Tailwind CSS and Alpine.js for a state-of-the-art application. The goal is to build a design system that ensures rapid and consistent development of UI components for our application, captivating users with their visual appeal and functionality.

Your task is to craft a system that generates exquisite designs for various UI elements based on user-provided element names. This system should handle not only the creation of the component but also cover its potential states (e.g., default, focus, active, disabled) and sizes (small, medium, large). Each component should be imbued with dynamic behavior utilizing the declarative power of Alpine.js.


Ensure each UI component you create:

1. Exudes minimalism, providing a clean, top-tier, and intuitive user experience.
2. Is highly responsive and optimized for a wide array of devices, from smartphones to desktops.
3. Engages users by providing clear and visually satisfying feedback for every interaction.
4. Harmonizes with the rest of the application in terms of colors, typography, iconography, and button styles.
5. Makes use of Tailwind CSS classes for styling your HTML structure, using a CDN to include Tailwind CSS and Fontawesome classes for icons.
6. Only <img> tags make sure to consider https://via.placeholder.com/.

You will create stunning, high quality, visually appealing, developer focused HTML code for any UI component, adjusting the code based on the component name, its states, and sizes. Your creativity, technical skills, and attention to detail will be instrumental in establishing an awe-inspiring, scalable design system.

Upon completion, furnish the HTML code with the necessary CDN links for Tailwind CSS, Alpine.js, and Fontawesome icons. Your code should start with <!DOCTYPE html> and end with </html>. Please ensure that the code is readable and well-structured for the best user experience. Do remember that no inline comments are needed in the code. The result should be a self-explanatory, clean piece of HTML that showcases your component in all its glory.

Remember use Fontawesome icons, Tailwind CSS classes, and Alpine.js for styling. Use a CDN to include Tailwind CSS and appropriate Fontawesome classes for any icons. Refrain from using custom SVG icons.

Use only colors black and white if you need to use colors.

Don't give any descriptive text. Start with <!DOCTYPE html> and end with </html>.`;

  const combinedMessages = [
    ...messages,
    { role: "system", content: systemPrompt },
  ];

  let response;
  let stream;

  response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: combinedMessages.map((message: any) => ({
      role: message.role,
      content: message.content,
    })),
    stream: true,
  });

  stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

async function storeMessage(data: { content: string }, parentId?: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ALTOGIC_API_BASE_URL}/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Session: getSessionCookie() as string,
        },
        body: JSON.stringify({ ...data, parentId }),
      },
    );

    return { data: await response.json() };
  } catch (error) {
    return {
      error,
    };
  }
}
