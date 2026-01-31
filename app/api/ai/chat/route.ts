import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.8,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        )
      } else if (response.status >= 500) {
        return NextResponse.json(
          { error: "OpenAI service error. Please try again." },
          { status: 502 }
        )
      } else {
        return NextResponse.json(
          { error: `API error: ${response.status}` },
          { status: response.status }
        )
      }
    }

    const data = await response.json()
    const responseText = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    return NextResponse.json({ content: responseText })
  } catch (error: unknown) {
    console.error("Error in AI chat route:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
