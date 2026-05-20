import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FAQPage({ setCurrentPage }) {
  const faqs = [
    {
      question: "What is Paraline?",
      answer: "Paraline is a modern audio visualizer for Windows that sits on the edges of your screen. It reacts to your system audio in real-time with beautiful themes and smooth animations."
    },
    {
      question: "Does it work on Windows 10 and 11?",
      answer: "Yes, Paraline is fully compatible with both Windows 10 and Windows 11. It's built specifically for the Windows desktop environment."
    },
    {
      question: "Will it impact my PC's performance?",
      answer: "Paraline is designed to be extremely lightweight. It uses efficient rendering techniques to ensure minimal CPU and GPU usage, so it won't impact your gaming or productivity."
    },
    {
      question: "How do I change themes?",
      answer: "Once Paraline is running, you can find its icon in the Windows system tray (bottom-right). Right-click the icon to see a list of available themes and switch between them instantly."
    },
    {
      question: "Can I customize the visualizer settings?",
      answer: "Absolutely. Through the system tray menu, you can access the Settings panel to adjust sensitivity, line thickness, opacity, and other theme-specific parameters."
    },
    {
      question: "Does Paraline record my audio?",
      answer: "No. Paraline only captures the output wave data from your system for visualization purposes. No audio is recorded, stored, or transmitted anywhere."
    },
    {
      question: "How do I update to the latest version?",
      answer: "You can download the latest installer from this website. Running the new installer will automatically update your existing Paraline installation while keeping your settings intact."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-24 md:py-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/25 bg-purple-500/5 text-[10px] tracking-[0.25em] uppercase font-bold text-purple-300 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Support Center
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-6">
            FAQ
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about Paraline. Can't find an answer? Reach out on GitHub.
          </p>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-4 mb-12">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} idx={idx} />
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setCurrentPage("home")}
            className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function FAQItem({ faq, idx }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }}
      className={`group rounded-2xl border transition-all duration-300 ${
        isOpen ? 'bg-white/[0.06] border-white/20' : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4"
      >
        <span className="text-sm md:text-base font-semibold text-white/90 group-hover:text-white transition-colors leading-snug">
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white/10' : ''}`}>
          <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 md:px-8 md:pb-8 text-sm md:text-base text-gray-400 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
