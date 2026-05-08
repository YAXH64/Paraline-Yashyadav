import { motion } from "framer-motion";
import PreviewStage from "./PreviewStage";

export default function ThemeCard({ theme, index }) {
  return (
    <motion.article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur xl:p-6 ${
        index === 0 || index === 4 || index === 8 ? "md:col-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, borderColor: "rgba(125, 211, 252, 0.28)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-8">
        <div className="lg:w-64 lg:flex-none">
          <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-200/70">{theme.tag}</p>
          <h3 className="mt-3 font-display text-3xl leading-none text-white">{theme.name}</h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/62">{theme.blurb}</p>
        </div>

        <div className="flex-1">
          <PreviewStage theme={theme} />
        </div>
      </div>
    </motion.article>
  );
}
