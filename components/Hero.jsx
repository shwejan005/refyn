"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Orange glow */}
      <div className="absolute -top-30 left-1/2 h-72 w-130 -translate-x-1/2 rounded-full bg-[#f97316]/40 blur-[140px]" />

      <div className="container mx-auto px-4 sm:py-32 relative z-10 flex-1 flex flex-col">
        <div className="mx-auto max-w-4xl text-center flex-1 flex flex-col justify-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              Prompt Refinement Playground
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white"
          >
            Prompt Engineering
            <br />
            made{" "}
            <span className="bg-linear-to-b from-[#fb923c] to-[#f97316] bg-clip-text text-transparent italic">
              Observable
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-white/70"
          >
            See how refining a plain-English prompt changes large language model
            outputs — using the same model, the same settings, and nothing else.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mb-6"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-5 py-2 text-sm font-medium text-black
                bg-linear-to-b from-[#fb923c] to-[#f97316]
                shadow-md transition-transform hover:-translate-y-0.5 hover:cursor-pointer"
            >
              <a href="#play">Refine & Compare</a>
            </Button>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-auto text-center"
        >
          <p className="mb-6 text-sm text-white/40">
            Submitted as compensation for late certificate submission
            for the subject <strong>Compiler Design</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
