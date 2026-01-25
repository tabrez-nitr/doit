"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.2 
          }}
          className="flex items-center gap-3 mb-4"
        >
          <CheckCircle2 size={48} className="text-primary" strokeWidth={2.5} />
          <h1 className="text-5xl font-black tracking-tighter text-foreground">
            Do It
          </h1>
        </motion.div>
        
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
            className="h-1 bg-primary rounded-full"
        />
      </div>
    </motion.div>
  );
}
