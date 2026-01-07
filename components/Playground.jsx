"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "./ui/button"

export default function Playground() {
  const [prompt, setPrompt] = useState("")

  return (
    <section id="play" className="relative bg-black py-12">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >

          {/* LEFT — Original */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h3 className="mb-3 text-sm text-white/60">
              Original Prompt
            </h3>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write your prompt in plain English..."
              className="w-full h-32 resize-none rounded-lg bg-black/40 border border-white/10 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />

            <div className="mt-4">
              <Button
                size="sm"
                className="rounded-full px-4 py-2 text-xs font-medium text-black
                  bg-gradient-to-b from-[#fb923c] to-[#f97316]
                  shadow-md transition-transform hover:-translate-y-0.5"
              >
                Refine & Compare
              </Button>
            </div>

            {/* Output */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4"
            >
              <p className="mb-1 text-xs text-white/40">
                Output (Original)
              </p>
              <p className="text-sm text-white/80">
                —
              </p>
            </motion.div>
          </div>

          {/* RIGHT — Refined */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h3 className="mb-3 text-sm text-white/60">
              Refined Prompt
            </h3>

            <div className="h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm text-white/70">
              —
            </div>

            {/* Output */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4"
            >
              <p className="mb-1 text-xs text-white/40">
                Output (Refined)
              </p>
              <p className="text-sm text-white/80">
                —
              </p>
            </motion.div>

            {/* Why better */}
            <div className="mt-4 text-xs text-white/50">
              <ul className="list-disc list-inside space-y-1">
                <li>Clear constraints</li>
                <li>Structured instruction</li>
                <li>Reduced ambiguity</li>
              </ul>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}