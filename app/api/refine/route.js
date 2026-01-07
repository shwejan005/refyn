import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export async function POST(req) {
  try {
    const { prompt } = await req.json()

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Empty prompt" }, { status: 400 })
    }

    // ---------- REFINE PROMPT ----------
    const refineRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Rewrite the following prompt to be clear, specific, and well-structured.
Do NOT change the intent.
Do NOT add extra tasks.
Return ONLY the refined prompt.

Prompt:
${prompt}`,
              },
            ],
          },
        ],
      }),
    })

    const refineJson = await refineRes.json()
    const refinedPrompt =
      refineJson?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // ---------- RUN PROMPTS ----------
    async function runPrompt(text) {
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text }] }],
        }),
      })

      const json = await res.json()
      return json?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }

    const originalOutput = await runPrompt(prompt)
    const refinedOutput = await runPrompt(refinedPrompt)

    return NextResponse.json({
      refinedPrompt,
      originalOutput,
      refinedOutput,
    })
  } catch (err) {
    return NextResponse.json({ error: "Gemini request failed" }, { status: 500 })
  }
}
