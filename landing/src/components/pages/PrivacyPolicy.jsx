import { motion } from "framer-motion";

export default function PrivacyPolicy({ setCurrentPage }) {
  const sections = [
    {
      title: "Introduction",
      content: "Paraline is committed to protecting your privacy while providing a high-performance desktop visualizer experience. This Privacy Policy explains how we handle data and sets out our commitment to transparency."
    },
    {
      title: "Data Collection",
      content: "We currently collect limited anonymous analytics to understand how users interact with our platform. This includes website visits, download interactions, approximate device/browser information, and regional usage trends. We do NOT collect sensitive personal information, files, passwords, or private user content."
    },
    {
      title: "Local Processing",
      content: "Paraline is designed as a local-first application. Most operations, including audio processing and visual rendering, occur entirely on your device. Your local settings and theme configurations are stored locally and are not transmitted to our servers."
    },
    {
      title: "Third-Party Services",
      content: "We use standard web services like Vercel Analytics and Google Analytics to monitor website performance. These services help us understand compatibility and performance needs across different platforms."
    },
    {
      title: "GitHub & External Links",
      content: "Our website contains links to external sites, including GitHub for source code and releases. We are not responsible for the privacy practices or content of these third-party platforms."
    },
    {
      title: "Future Analytics Notice",
      content: "As Paraline evolves, we may implement additional anonymous telemetry to help debug performance issues and improve theme stability. Any such changes will always prioritize user anonymity and data minimization."
    },
    {
      title: "Contact Information",
      content: "If you have questions regarding our privacy practices, please reach out via GitHub Issues or contact the project maintainers directly through the official repository."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-24 md:py-32 overflow-hidden bg-midnight text-white">
      {/* Dynamic ambient backdrop glowing layers */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl relative z-10 flex flex-col"
      >
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage("home")}
          className="group mb-12 self-start flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Header Block */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] tracking-[0.3em] uppercase font-bold text-white/60 mb-6"
          >
            Privacy & Trust
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
            Last updated: May 2026. This policy outlines our commitment to transparency and the limited ways we handle data.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="group"
            >
              <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-400/80 mb-4 font-bold transition-colors group-hover:text-cyan-300">
                {section.title}
              </h2>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">
            Paraline Visualizer Experience
          </p>
        </div>
      </motion.div>
    </div>
  );
}
