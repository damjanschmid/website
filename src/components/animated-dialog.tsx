 "use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type AnimatedDialogProps = {
  trigger: React.ReactNode
}

export function AnimatedDialog({ trigger }: AnimatedDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <AnimatePresence>
        <DialogContent asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <DialogHeader>
              <DialogTitle>Placeholder title</DialogTitle>
              <DialogDescription>
                Placeholder description text for your widget popup. Replace this
                with your real content later.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  )
}

