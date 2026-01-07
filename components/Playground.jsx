"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "./ui/button"

function FormattedText({ text }) {
  if (!text) return <span className="text-white/40">—</span>

  return text.split("\n").map((line, i) => {
    if (line.trim().startsWith("-")) {
      return (
        <li key={i} className="ml-4 list-disc">
          {line.replace("-", "").trim()}
        </li>
      )
    }

    return (
      <p key={i} className="mb-2 leading-relaxed">
        {line}
      </p>
    )
  })
}

export default function Playground() {
  const [prompt, setPrompt] = useState("")
  const [refined, setRefined] = useState("")
  const [originalOutput, setOriginalOutput] = useState("")
  const [refinedOutput, setRefinedOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function apiCall(payload) {
    const res = await fetch("/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Request failed")
    return data
  }

  async function handleRefine() {
    try {
      setLoading(true)
      setError("")
      setRefined("")
      setOriginalOutput("")
      setRefinedOutput("")

      const data = await apiCall({ mode: "refine", prompt })
      setRefined(data.refinedPrompt)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCompare() {
    try {
      setLoading(true)
      setError("")

      const data = await apiCall({
        mode: "compare",
        prompt,
        refinedPrompt: refined,
      })

      setOriginalOutput(data.originalOutput)
      setRefinedOutput(data.refinedOutput)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setPrompt("")
    setRefined("")
    setOriginalOutput("")
    setRefinedOutput("")
    setError("")
  }

  return (
    <section id="play" className="relative bg-black py-24">
      <div className="container mx-auto px-4 max-w-6xl">

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT — ORIGINAL */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h3 className="text-sm text-white/60 mb-2">
              Original Prompt
            </h3>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt in plain English..."
              className="w-full h-32 resize-none rounded-lg bg-black/40 border border-white/10 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />

            <div className="flex gap-3 mt-4 flex-wrap">
              <Button
                size="sm"
                onClick={handleRefine}
                disabled={loading}
                className="rounded-full px-4 py-2 text-xs font-medium text-black
                  bg-linear-to-b from-[#fb923c] to-[#f97316]"
              >
                {loading ? "Working..." : "Refine Prompt"}
              </Button>

              <Button
                size="sm"
                onClick={handleCompare}
                disabled={loading || !refined}
                className="rounded-full px-4 py-2 text-xs font-medium text-black
                  bg-linear-to-b from-[#fb923c] to-[#f97316]"
              >
                Compare Results
              </Button>

              <Button
                size="sm"
                onClick={handleClear}
                disabled={loading}
                className="rounded-full px-4 py-2 text-xs font-medium
                  border border-white/20 text-white/70 hover:bg-white/10"
              >
                Clear
              </Button>
            </div>

            {/* Output Original */}
            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 max-h-64 overflow-y-auto">
              <p className="text-xs text-white/40 mb-2">
                Output (Original)
              </p>
              <div className="text-sm text-white/80">
                <FormattedText text={originalOutput} />
              </div>
            </div>
          </div>

          {/* RIGHT — REFINED (HIGHLIGHTED) */}
          <div className="rounded-2xl border border-orange-500/40 bg-gradient-to-b from-orange-500/15 to-orange-600/5 backdrop-blur p-6">
            <h3 className="text-sm text-orange-300 mb-2">
              Refined Prompt
            </h3>

            {/* Refined Prompt Box */}
            <div className="h-32 overflow-y-auto rounded-lg bg-black/50 border border-orange-500/30 p-3 text-sm text-orange-200 whitespace-pre-wrap">
              {refined || "—"}
            </div>

            {/* Output Refined */}
            <div className="mt-6 rounded-lg border border-orange-500/30 bg-black/40 p-4 max-h-64 overflow-y-auto">
              <p className="text-xs text-orange-300 mb-2">
                Output (Refined)
              </p>
              <div className="text-sm text-orange-100">
                <FormattedText text={refinedOutput} />
              </div>
            </div>

            <div className="mt-4 text-xs text-orange-200/70">
              <ul className="list-disc list-inside space-y-1">
                <li>Clear constraints</li>
                <li>Structured instruction</li>
                <li>Reduced ambiguity</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}