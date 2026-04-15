import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Step5Finish() {
  return (
    <div className="animate-in fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <CheckCircle2 className="w-32 h-32 text-emerald-500 relative z-10" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2 leading-tight">
          You&apos;re all set!
        </h1>
        <p className="text-muted-foreground text-lg mt-4 max-w-sm mx-auto leading-relaxed">
          BiteSense has personalized your profile. We&apos;re ready to help you reach your goals.
        </p>
      </motion.div>
    </div>
  );
}
