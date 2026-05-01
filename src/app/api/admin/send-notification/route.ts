import { NextResponse } from "next/server"

// API route to send notification to all subscribers
export async function POST(request: Request) {
  try {
    const payload = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscribe/send-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers here
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Failed to send notification")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}

