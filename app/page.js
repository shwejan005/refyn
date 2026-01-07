export default function Home() {
  return (
    <main className="min-h-screen px-8 py-16 max-w-6xl mx-auto">
      
      {/* Hero */}
      <section className="mb-20">
        <h1 className="text-4xl font-semibold mb-4">
          PromptDiff
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl">
          A simple playground that shows how refining a prompt
          changes large language model outputs.
        </p>

        <p className="text-sm text-gray-500 mt-4">
          This project is submitted as compensation for late certificate
          submission for the subject <strong>Compiler Design</strong>.
        </p>
      </section>

      {/* Playground */}
      <section className="grid grid-cols-2 gap-8">
        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">
            Original Prompt
          </h2>
          <div className="h-48 bg-gray-50 rounded" />
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-2">
            Refined Prompt
          </h2>
          <div className="h-48 bg-gray-50 rounded" />
        </div>
      </section>

    </main>
  )
}
