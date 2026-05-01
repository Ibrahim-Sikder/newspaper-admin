import { NextResponse } from "next/server"

// API route to delete a subscriber

export async function DELETE() {
  try {


    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/subscribe`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers here
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete subscriber")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting subscriber:", error)
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
  }
}

