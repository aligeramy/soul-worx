"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, TrendingDown, Smile, Frown } from "lucide-react"

interface RatingModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (enjoyment: number, difficulty: number) => void
}

const ENJOYMENT_EMOJIS = ["😞", "😕", "😐", "😊", "😄"]
const DIFFICULTY_LABELS = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"]

export function RatingModal({ open, onClose, onSubmit }: RatingModalProps) {
  const [enjoyment, setEnjoyment] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<number | null>(null)

  const handleSubmit = () => {
    if (enjoyment === null || difficulty === null) {
      return
    }
    onSubmit(enjoyment, difficulty)
    // Reset state
    setEnjoyment(null)
    setDifficulty(null)
  }

  const handleClose = () => {
    setEnjoyment(null)
    setDifficulty(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border border-white/10 bg-brand-bg-darker text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Rate Your Workout</DialogTitle>
          <DialogDescription className="text-white/60">
            Help us improve your training experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enjoyment Rating */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              How much did you enjoy it?
            </label>
            <div className="flex items-center justify-between gap-2">
              {ENJOYMENT_EMOJIS.map((emoji, index) => {
                const rating = index + 1
                const isSelected = enjoyment === rating
                return (
                  <button
                    key={rating}
                    onClick={() => setEnjoyment(rating)}
                    className={`
                      flex-1 p-4 rounded-lg border-2 transition-all text-3xl
                      ${
                        isSelected
                          ? "border-yellow-400 bg-yellow-400/10 scale-110"
                          : "border-white/20 hover:border-white/40 bg-white/5"
                      }
                    `}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
            {enjoyment && (
              <p className="text-xs text-white/60 mt-2 text-center">
                {enjoyment === 1 && "Not enjoyable"}
                {enjoyment === 2 && "A little"}
                {enjoyment === 3 && "Neutral"}
                {enjoyment === 4 && "Enjoyable"}
                {enjoyment === 5 && "Very enjoyable!"}
              </p>
            )}
          </div>

          {/* Difficulty Rating */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              How difficult was it?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {DIFFICULTY_LABELS.map((label, index) => {
                const rating = index + 1
                const isSelected = difficulty === rating
                return (
                  <button
                    key={rating}
                    onClick={() => setDifficulty(rating)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-xs font-medium
                      ${
                        isSelected
                          ? "border-blue-400 bg-blue-400/10 scale-105"
                          : "border-white/20 hover:border-white/40 bg-white/5 text-white/70"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {rating === 1 && <TrendingDown className="h-4 w-4" />}
                      {rating === 5 && <TrendingUp className="h-4 w-4" />}
                      {rating !== 1 && rating !== 5 && <div className="h-4 w-4" />}
                      <span className="text-[10px]">{label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={enjoyment === null || difficulty === null}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
