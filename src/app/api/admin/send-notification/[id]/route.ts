import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,

) {
  try {
    const payload = await request.json();


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/subscribe/send-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send notification to subscriber");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending notification to subscriber:", error);
    return NextResponse.json(
      { error: "Failed to send notification to subscriber" },
      { status: 500 }
    );
  }
}
