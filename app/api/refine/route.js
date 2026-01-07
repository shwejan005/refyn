import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function runGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.2,          // ↓ less randomness
      maxOutputTokens: 250,      // ↓ short output
    },
    contents: prompt,
  })

  if (!response || !response.text) {
    throw new Error("Empty Gemini response")
  }

  return response.text
}

export async function POST(req) {
  try {
    const { mode, prompt, refinedPrompt } = await req.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is empty" }, { status: 400 })
    }

    // -------- REFINE (SHORT + STRUCTURED) --------
    if (mode === "refine") {
      const refined = await runGemini(
        `Rewrite the following prompt to be clear, concise, and well-structured.
Keep it SHORT.
Do NOT change intent.
Return ONLY the refined prompt.

Prompt:
${prompt}`
      )

      return NextResponse.json({ refinedPrompt: refined })
    }

    // -------- COMPARE (SHORT OUTPUTS) --------
    if (mode === "compare") {
      if (!refinedPrompt) {
        return NextResponse.json({ error: "Missing refined prompt" }, { status: 400 })
      }

      const originalOutput = await runGemini(
        `${prompt}
Respond briefly in under 6 bullet points or short paragraphs.`
      )

      const refinedOutput = await runGemini(
        `${refinedPrompt}
Respond briefly in under 6 bullet points or short paragraphs.`
      )

      return NextResponse.json({
        originalOutput,
        refinedOutput,
      })
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
  } catch (err) {
    console.error("GEMINI ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Gemini failed" },
      { status: 500 }
    )
  }
}