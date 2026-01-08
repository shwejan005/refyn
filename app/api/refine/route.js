import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runGemini(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 250,
        },
        contents: prompt,
      })

      if (!response || !response.text) {
        throw new Error("Empty Gemini response")
      }

      return response.text
    } catch (err) {
      if (err.status === 503 || err.message.includes("overloaded")) {
        console.warn(`Gemini 503 Overloaded. Retrying (${i + 1}/${retries})...`)
        await delay(1000 * (i + 1)) // 1s, 2s, 3s
        continue
      }
      throw err
    }
  }
  throw new Error("Gemini is overloaded. Please try again.")
}

async function generateContentWithRetry(config, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(config).then(res => res.text)
    } catch (err) {
      if (err.status === 503 || err.message.includes("overloaded")) {
        console.warn(`Gemini 503 Overloaded. Retrying (${i + 1}/${retries})...`)
        await delay(1000 * (i + 1))
        continue
      }
      throw err
    }
  }
  throw new Error("Gemini is overloaded. Please try again.")
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
        `Rewrite the following prompt into a clear, structured request.
Use this EXACT format:
[Original Task] clearly using:
- a one-line definition
- a simple real-world analogy
- a tiny code example

Keep instructions short.
Use bullet points.
Avoid unnecessary details.

Original Prompt:
${prompt}`
      )

      return NextResponse.json({ refinedPrompt: refined })
    }

    // -------- COMPARE (SHORT OUTPUTS) --------
    if (mode === "compare") {
      if (!refinedPrompt) {
        return NextResponse.json({ error: "Missing refined prompt" }, { status: 400 })
      }

      // Left Side: Intentionally vague/unstructured if the prompt allows it
      // We REMOVE "Respond briefly" to let it be "meh"
      const originalOutput = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600, // Allow more text to ramble
        },
        contents: prompt,
      })

      // Right Side: The prompt itself now imposes structure (def/analogy/code).
      // We keep tokens tight to force conciseness.
      const refinedOutput = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 400,
        },
        contents: refinedPrompt,
      })

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