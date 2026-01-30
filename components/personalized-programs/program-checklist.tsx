"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, Star, Loader2 } from "lucide-react"
import { format, isPast, differenceInDays, isToday, startOfDay } from "date-fns"
import { toast } from "sonner"
import { RatingModal } from "./rating-modal"

interface ChecklistItem {
  id: string
  dueDate: Date
  completed: boolean
  completedAt: Date | null
  enjoymentRating: number | null
  difficultyRating: number | null
  daysLate: number | null
}

interface ProgramChecklistProps {
  programId: string
  checklistItems: ChecklistItem[]
}

export function ProgramChecklist({ programId, checklistItems }: ProgramChecklistProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleCheckOff = async (itemId: string) => {
    const item = checklistItems.find((i) => i.id === itemId)
    if (!item) return

    const dueDate = new Date(item.dueDate)
    const today = startOfDay(new Date())

    // Only allow checking off if due date has arrived
    if (startOfDay(dueDate) > today) {
      toast.error("This workout isn't due yet")
      return
    }

    // If already completed, uncheck it
    if (item.completed) {
      setIsSubmitting(itemId)
      try {
        const response = await fetch(`/api/personalized-programs/checklist/${itemId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to uncheck workout")
        }

        toast.success("Workout unchecked")
        router.refresh()
      } catch (error) {
        console.error("Error unchecking workout:", error)
        toast.error("Failed to uncheck workout")
      } finally {
        setIsSubmitting(null)
      }
      return
    }

    // Open rating modal for new completion
    setSelectedItemId(itemId)
    setRatingModalOpen(true)
  }

  const handleRatingSubmit = async (enjoyment: number, difficulty: number) => {
    if (!selectedItemId) return

    setIsSubmitting(selectedItemId)
    try {
      const response = await fetch(`/api/personalized-programs/checklist/${selectedItemId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enjoymentRating: enjoyment,
          difficultyRating: difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to check off workout")
      }

      toast.success("Workout completed! Great job!")
      setRatingModalOpen(false)
      setSelectedItemId(null)
      router.refresh()
    } catch (error) {
      console.error("Error checking off workout:", error)
      toast.error("Failed to check off workout")
    } finally {
      setIsSubmitting(null)
    }
  }

  return (
    <>
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Workout Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          {checklistItems.length > 0 ? (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {checklistItems.map((item) => {
                const dueDate = new Date(item.dueDate)
                const today = startOfDay(new Date())
                const dueDateStart = startOfDay(dueDate)
                const isOverdue = isPast(dueDateStart) && !item.completed && dueDateStart < today
                const isDueToday = isToday(dueDate)
                const canCheckOff = dueDateStart <= today

                return (
                  <div
                    key={item.id}
                    className={`
                      p-4 rounded-lg border transition-all
                      ${
                        item.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : isOverdue
                          ? "bg-red-500/10 border-red-500/30"
                          : isDueToday
                          ? "bg-blue-500/10 border-blue-500/30"
                          : "bg-white/5 border-white/10"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-white/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">
                              {format(dueDate, "EEEE, MMMM d, yyyy")}
                            </span>
                            {isDueToday && !item.completed && (
                              <Badge className="bg-blue-500 text-white">Due Today</Badge>
                            )}
                            {isOverdue && (
                              <Badge className="bg-red-500 text-white">
                                {differenceInDays(today, dueDateStart)} day
                                {differenceInDays(today, dueDateStart) !== 1 ? "s" : ""} late
                              </Badge>
                            )}
                            {item.completed && item.completedAt && (
                              <span className="text-xs text-white/60">
                                (Completed {format(new Date(item.completedAt), "MMM d")})
                              </span>
                            )}
                          </div>
                          {item.completed && (
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              {item.enjoymentRating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-white/80">
                                    Enjoyment: {item.enjoymentRating}/5
                                  </span>
                                </div>
                              )}
                              {item.difficultyRating && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-white/60" />
                                  <span className="text-white/80">
                                    Difficulty: {item.difficultyRating}/5
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCheckOff(item.id)}
                        disabled={isSubmitting === item.id || (!canCheckOff && !item.completed)}
                        variant={item.completed ? "outline" : "default"}
                        size="sm"
                        className={
                          item.completed
                            ? "border-white/20 text-white/70 hover:text-white"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }
                      >
                        {isSubmitting === item.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {item.completed ? "Unchecking..." : "Checking..."}
                          </>
                        ) : item.completed ? (
                          "Uncheck"
                        ) : canCheckOff ? (
                          "Check Off"
                        ) : (
                          "Not Due"
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60">No checklist items found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RatingModal
        open={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false)
          setSelectedItemId(null)
        }}
        onSubmit={handleRatingSubmit}
      />
    </>
  )
}
