import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function runGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  if (!response || !response.text) {
    throw new Error("Empty Gemini response")
  }

  return response.text
}

export async function POST(req) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      )
    }

    const { mode, prompt, refinedPrompt } = await req.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is empty" },
        { status: 400 }
      )
    }

    // -------- REFINE ONLY --------
    if (mode === "refine") {
      const refined = await runGemini(
        `Rewrite the following prompt to be clear, specific, and well-structured.
Do NOT change the intent.
Return ONLY the refined prompt.

Prompt:
${prompt}`
      )

      return NextResponse.json({ refinedPrompt: refined })
    }

    // -------- COMPARE --------
    if (mode === "compare") {
      if (!refinedPrompt || !refinedPrompt.trim()) {
        return NextResponse.json(
          { error: "Missing refinedPrompt" },
          { status: 400 }
        )
      }

      const originalOutput = await runGemini(prompt)
      const refinedOutput = await runGemini(refinedPrompt)

      return NextResponse.json({
        originalOutput,
        refinedOutput,
      })
    }

    return NextResponse.json(
      { error: "Invalid mode" },
      { status: 400 }
    )
  } catch (err) {
    console.error("GEMINI ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Gemini failed" },
      { status: 500 }
    )
  }
}