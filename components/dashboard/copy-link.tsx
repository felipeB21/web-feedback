"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CopyLink({ shareLink }: { shareLink: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}/feedback-send/${shareLink}`,
      );
      setCopied(true);
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.log(err);

      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant={copied ? "outline" : "default"}
      className="min-w-30 relative overflow-hidden"
      onClick={handleCopy}
      disabled={copied}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-green-500" />
            <span>Copied</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            <span>Copy Link</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
