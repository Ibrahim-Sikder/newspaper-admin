import { NextResponse } from "next/server"

// API route to get all subscribers
export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscribe`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers here
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch subscribers")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

