"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Calendar, Clock, CheckCircle2, Video } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { format, addDays, isBefore, startOfDay } from "date-fns"

interface BookCoachCallProps {
  userId: string
}

const TIME_SLOTS = [
  { label: "12:00 PM", value: 12 },
  { label: "1:00 PM", value: 13 },
  { label: "2:00 PM", value: 14 },
  { label: "3:00 PM", value: 15 },
  { label: "4:00 PM", value: 16 },
  { label: "5:00 PM", value: 17 },
]

export function BookCoachCall({ userId }: BookCoachCallProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [meetLink, setMeetLink] = useState<string | null>(null)

  // Generate available dates (next 30 days)
  const today = startOfDay(new Date())
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(today, i))

  useEffect(() => {
    // Fetch booked dates
    const fetchAvailability = async () => {
      try {
        const response = await fetch(
          `/api/coach-calls/availability?startDate=${today.toISOString()}&endDate=${addDays(today, 30).toISOString()}`
        )
        const data = await response.json()

        if (response.ok) {
          setBookedDates(new Set(data.bookedDates || []))
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
        toast.error("Failed to load availability")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  const handleBook = async () => {
    if (!selectedDate || selectedTime === null) {
      toast.error("Please select a date and time")
      return
    }

    setIsBooking(true)

    try {
      // Combine date and time
      const scheduledAt = new Date(selectedDate)
      scheduledAt.setHours(selectedTime, 0, 0, 0)

      const response = await fetch("/api/coach-calls/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: scheduledAt.toISOString(),
          duration: 60,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to book call")
      }

      setMeetLink(data.coachCall?.googleMeetLink)
      setBookingSuccess(true)
      toast.success("Coach call booked successfully!")
    } catch (error) {
      console.error("Error booking call:", error)
      toast.error(error instanceof Error ? error.message : "Failed to book call")
    } finally {
      setIsBooking(false)
    }
  }

  const isDateBooked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return bookedDates.has(dateStr)
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isDateBooked(date)
  }

  if (bookingSuccess) {
    return (
      <Card className="border-2 border-green-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl">Call Booked Successfully!</CardTitle>
          <CardDescription className="text-lg">
            Your coach call has been scheduled for{" "}
            {selectedDate && selectedTime !== null && (
              <>
                {format(selectedDate, "EEEE, MMMM d, yyyy")} at {TIME_SLOTS.find((s) => s.value === selectedTime)?.label}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {meetLink && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Google Meet Link</span>
              </div>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {meetLink}
              </a>
              <p className="text-sm text-blue-700 mt-2">
                Click the link above to join the meeting at the scheduled time.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBookingSuccess(false)
                setSelectedDate(null)
                setSelectedTime(null)
              }}
              className="flex-1"
            >
              Book Another Call
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-v2/w.png"
            alt="Soulworx Logo"
            width={60}
            height={90}
            className="h-15 w-auto border border-black/10 rounded-lg p-3 px-4 bg-brand-bg-darker"
          />
        </div>
        <h1 className="text-4xl font-medium font-crimson tracking-tight">
          Book Your Coach Call
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Schedule a one-on-one call with your coach to discuss your personalized program
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date
              </CardTitle>
              <CardDescription>Choose an available date (one appointment per day)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.getTime() === date.getTime()
                  const isBooked = isDateBooked(date)
                  const isDisabled = isDateDisabled(date)

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => !isDisabled && setSelectedDate(date)}
                      disabled={isDisabled}
                      className={`
                        p-3 rounded-lg text-sm font-medium transition-all
                        ${isSelected
                          ? "bg-neutral-900 text-white"
                          : isBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : isDisabled
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900"}
                      `}
                    >
                      <div className="text-xs mb-1">{format(date, "EEE")}</div>
                      <div className="text-lg">{format(date, "d")}</div>
                    </button>
                  )
                })}
              </div>
              {selectedDate && (
                <p className="mt-4 text-sm text-neutral-600">
                  Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Select Time
              </CardTitle>
              <CardDescription>Available times: 12pm - 5pm (1 hour sessions)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot.value

                  return (
                    <button
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      disabled={!selectedDate}
                      className={`
                        p-4 rounded-lg text-center font-medium transition-all
                        ${isSelected
                          ? "bg-neutral-900 text-white"
                          : !selectedDate
                          ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900"}
                      `}
                    >
                      {slot.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Book Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleBook}
          disabled={!selectedDate || selectedTime === null || isBooking}
          size="lg"
          className="min-w-[200px]"
        >
          {isBooking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Booking...
            </>
          ) : (
            "Book Coach Call"
          )}
        </Button>
      </div>
    </div>
  )
}
