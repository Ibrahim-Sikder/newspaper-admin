/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://localhost:5010/api/v1/visitor-tracker")
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch visitors")
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error:any) {
    console.error("Error fetching visitors:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch visitors" },
      { status: 500 }
    )
  }
}