import { motion } from "framer-motion";

export default function InstallationGuide({ setCurrentPage }) {
  const steps = [
    {
      num: "01",
      title: "Download",
      description: "Download the latest Paraline release setup executable directly to your Windows computer.",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Run Installer",
      description: "Launch the downloaded `.exe` setup file and follow the standard prompt to install.",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      num: "03",
      title: "Launch App",
      description: "Open the newly installed Paraline application from your desktop or start menu shortcut.",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      num: "04",
      title: "System Tray Controls",
      description: "Access the Windows system tray (bottom-right) to switch visualizer themes, pause flow, or open advanced settings.",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
      {/* Dynamic ambient backdrop glowing layers */}
      <div className="absolute top-[20%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl relative z-10 flex flex-col items-center"
      >
        {/* Header Block */}
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/25 bg-sky-500/5 text-[10px] tracking-[0.25em] uppercase font-bold text-sky-300 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            Quick Setup
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-6">
            Installation Guide
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
            Follow these simple steps to configure and run Paraline on your Windows system.
          </p>
        </div>

        {/* Step-by-Step Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: "rgba(125,211,252,0.2)" }}
              className="group relative rounded-2xl border border-white/[0.06] bg-[#050816]/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
            >
              {/* Inner glowing hover sheet */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/[0.01] to-violet-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:border-sky-500/20 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                    {step.icon}
                  </div>
                  {/* Step Index */}
                  <span className="font-display font-bold text-2xl md:text-3xl text-white/10 tracking-wider select-none group-hover:text-sky-500/20 transition-colors duration-300">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-white mb-2 tracking-wide group-hover:text-sky-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ambient Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full relative rounded-2xl border border-sky-500/15 bg-gradient-to-r from-sky-500/[0.03] to-violet-500/[0.03] backdrop-blur-xl p-6 md:p-8 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          {/* Subtle glow orb */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Visualizer reactive ring icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-sky-400/30 flex items-center justify-center bg-sky-500/5 animate-pulse">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
            </div>

            <p className="text-xs md:text-sm text-sky-200/90 leading-relaxed tracking-wide font-sans font-medium">
              Once started, <strong className="text-white">Paraline</strong> runs as a transparent desktop overlay and reacts in real time to the audio playing through your current output device.
            </p>
          </div>
        </motion.div>

        {/* Interactive Navigation Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentPage("home")}
          className="relative group overflow-hidden px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:border-sky-400/40 text-[10px] tracking-[0.22em] uppercase font-bold text-white/90 hover:text-white transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-2.5">
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
