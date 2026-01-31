"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronLeft, ChevronRight, Upload, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { put } from "@vercel/blob"

interface ProPlusQuestionnaireFormProps {
  userId: string
  fromDashboard?: boolean
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const SKILL_LEVELS = ["beginner", "advanced", "pro"] as const
const POSITIONS = ["PG", "SG", "SF", "PF", "C"] as const
const TEAMS = ["No Team", "Elementary", "Middle School", "Highschool", "College", "Pro"] as const
const OUTSIDE_TEAMS = ["AAU", "Prep", "No team"] as const
const EQUIPMENT = ["Full gym", "Half gym", "Driveway", "Park"] as const
const SESSION_LENGTHS = [30, 45, 60] as const
const MENTAL_CHALLENGES = ["Fear of failure", "Consistency", "Pressure", "Motivation", "Other"] as const
const COACHING_STYLES = ["Direct", "Encouraging", "Accountability", "Driven", "Mix", "Other"] as const
const BASKETBALL_WATCHING = ["Your own film", "NBA/Pro/College", "Both", "None"] as const

export function ProPlusQuestionnaireForm({ userId, fromDashboard = false }: ProPlusQuestionnaireFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userAge, setUserAge] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    // Section 1: Basic Info
    age: "",
    skillLevel: "" as "" | "beginner" | "advanced" | "pro",
    gameDescription: "",

    // Section 2: Position & Experience
    position: "" as "" | "PG" | "SG" | "SF" | "PF" | "C",
    yearsPlaying: "",

    // Section 3: Goals
    currentGoalsYearly: "",
    currentGoalsOverall: "",

    // Section 4: Improvement Rankings
    improvementRankings: {
      ballHandling: 3,
      defence: 3,
      finishing: 3,
      shooting: 3,
      passing: 3,
      other: { text: "", rank: 3 },
    },

    // Section 5: Physical Stats
    weight: "",
    height: "",
    currentInjuries: "",

    // Section 6: Training & Health
    seeingPhysiotherapy: false,
    weightTrains: false,
    stretches: false,

    // Section 7: Team & Competition
    currentTeam: "" as "" | "No Team" | "Elementary" | "Middle School" | "Highschool" | "College" | "Pro",
    outsideSchoolTeams: "" as "" | "AAU" | "Prep" | "No team",
    inSeason: false,

    // Section 8: Basketball Watching
    basketballWatching: "",

    // Section 9: Equipment & Availability
    equipmentAccess: "" as "" | "Full gym" | "Half gym" | "Driveway" | "Park",
    trainingDays: [] as string[],
    averageSessionLength: null as number | null,

    // Section 10: Mental & Coaching
    biggestStruggle: "",
    confidenceLevel: 3,
    mentalChallenge: "" as "" | "Fear of failure" | "Consistency" | "Pressure" | "Motivation" | "Other",
    mentalChallengeOther: "",
    coachability: 3,
    preferredCoachingStyle: "" as "" | "Direct" | "Encouraging" | "Accountability" | "Driven" | "Mix" | "Other",
    coachingStyleOther: "",

    // Section 11 & 12: Video Uploads
    gameFilmUrl: "",
    workoutVideos: [] as string[],
  })

  const totalSteps = 12

  useEffect(() => {
    // Load user's age from onboarding
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/onboarding/user-data")
        const data = await response.json()
        if (data.age) {
          setUserAge(data.age)
          setFormData((prev) => ({ ...prev, age: data.age.toString() }))
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleVideoUpload = async (file: File, type: "gameFilm" | "workout") => {
    if (!file) return

    setIsUploading(true)
    try {
      const blob = await put(
        `questionnaire/${userId}/${type}-${Date.now()}-${file.name}`,
        file,
        {
          access: "public",
          contentType: file.type,
        }
      )

      if (type === "gameFilm") {
        setFormData({ ...formData, gameFilmUrl: blob.url })
        toast.success("Game film uploaded successfully")
      } else {
        setFormData({
          ...formData,
          workoutVideos: [...formData.workoutVideos, blob.url],
        })
        toast.success("Workout video uploaded successfully")
      }
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error("Failed to upload video")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/pro-plus-questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          averageSessionLength: formData.averageSessionLength,
          confidenceLevel: formData.confidenceLevel,
          coachability: formData.coachability,
          improvementRankings: formData.improvementRankings,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save questionnaire")
      }

      toast.success("Questionnaire completed successfully!")
      // If coming from dashboard, go back to dashboard. Otherwise, continue onboarding flow.
      if (fromDashboard) {
        router.push("/dashboard")
      } else {
        router.push("/onboarding/book-call")
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save questionnaire")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
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
        <h1 className="text-3xl font-medium font-crimson tracking-tight">
          Pro+ Questionnaire
        </h1>
        <p className="text-neutral-600">
          Help us create your personalized training program
        </p>
        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-xs text-neutral-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-neutral-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
            
            <Field label="Age" htmlFor="age">
              <div className="relative">
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 120)) {
                      setFormData({ ...formData, age: value })
                    }
                  }}
                  placeholder="Enter your age"
                  className="pr-20 text-base"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">
                  years old
                </div>
              </div>
              {userAge !== null && (
                <p className="text-xs text-neutral-500 mt-1.5">
                  Pre-filled from your onboarding — you can change it above if needed.
                </p>
              )}
            </Field>

            <Field label="Skill Level" htmlFor="skillLevel">
              <div className="grid grid-cols-3 gap-3">
                {SKILL_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.skillLevel === level
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <span className="capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Describe what your game is like" htmlFor="gameDescription">
              <textarea
                id="gameDescription"
                value={formData.gameDescription}
                onChange={(e) => setFormData({ ...formData, gameDescription: e.target.value })}
                placeholder="Tell us about your playing style, strengths, and what makes your game unique..."
                rows={5}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </Field>
          </div>
        )}

        {/* Step 2: Position & Experience */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Position & Experience</h2>
            
            <Field label="Position" htmlFor="position">
              <div className="grid grid-cols-5 gap-3">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setFormData({ ...formData, position: pos })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.position === pos
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Years playing basketball or other sports" htmlFor="yearsPlaying">
              <Input
                id="yearsPlaying"
                value={formData.yearsPlaying}
                onChange={(e) => setFormData({ ...formData, yearsPlaying: e.target.value })}
                placeholder="e.g., 5 years"
              />
            </Field>
          </div>
        )}

        {/* Step 3: Goals */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Your Goals</h2>
            
            <Field label="Current goals - Yearly" htmlFor="goalsYearly">
              <textarea
                id="goalsYearly"
                value={formData.currentGoalsYearly}
                onChange={(e) => setFormData({ ...formData, currentGoalsYearly: e.target.value })}
                placeholder="What do you want to achieve this year?"
                rows={4}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </Field>

            <Field label="Current goals - Overall" htmlFor="goalsOverall">
              <textarea
                id="goalsOverall"
                value={formData.currentGoalsOverall}
                onChange={(e) => setFormData({ ...formData, currentGoalsOverall: e.target.value })}
                placeholder="What are your long-term basketball goals?"
                rows={4}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </Field>
          </div>
        )}

        {/* Step 4: Improvement Rankings */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Improvement Rankings</h2>
            <p className="text-neutral-600 mb-6">
              Rate each area from 1 (needs most improvement) to 5 (needs least improvement)
            </p>
            
            {(["ballHandling", "defence", "finishing", "shooting", "passing"] as const).map((skill) => (
              <Field key={skill} label={skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, " $1")}>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <button
                      key={rank}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          improvementRankings: {
                            ...formData.improvementRankings,
                            [skill]: rank,
                          },
                        })
                      }
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.improvementRankings[skill] === rank
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              </Field>
            ))}

            <Field label="Other (specify)" htmlFor="otherImprovement">
              <Input
                id="otherImprovement"
                value={formData.improvementRankings.other?.text || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    improvementRankings: {
                      ...formData.improvementRankings,
                      other: {
                        ...formData.improvementRankings.other,
                        text: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Other area to improve"
                className="mb-3"
              />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <button
                    key={rank}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        improvementRankings: {
                          ...formData.improvementRankings,
                          other: {
                            ...formData.improvementRankings.other,
                            rank,
                          },
                        },
                      })
                    }
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.improvementRankings.other?.rank === rank
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 5: Physical Stats */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Physical Stats</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Weight (lbs)" htmlFor="weight">
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 180"
                />
              </Field>

              <Field label="Height" htmlFor="height">
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="e.g., 6'2 or 188cm"
                />
              </Field>
            </div>

            <Field label="Current injuries (optional)" htmlFor="injuries">
              <textarea
                id="injuries"
                value={formData.currentInjuries}
                onChange={(e) => setFormData({ ...formData, currentInjuries: e.target.value })}
                placeholder="List any current injuries or limitations..."
                rows={3}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </Field>
          </div>
        )}

        {/* Step 6: Training & Health */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Training & Health</h2>
            
            <div className="space-y-4 pb-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-base">Are you seeing physiotherapy?</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, seeingPhysiotherapy: false })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      !formData.seeingPhysiotherapy
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, seeingPhysiotherapy: true })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      formData.seeingPhysiotherapy
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-base">Do you weight train?</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weightTrains: false })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      !formData.weightTrains
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, weightTrains: true })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      formData.weightTrains
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-base">Do you stretch?</span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stretches: false })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      !formData.stretches
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stretches: true })}
                    className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                      formData.stretches
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Team & Competition */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Team & Competition</h2>
            
            <Field label="Current Team" htmlFor="currentTeam">
              <div className="grid grid-cols-2 gap-3">
                {TEAMS.map((team) => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setFormData({ ...formData, currentTeam: team })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.currentTeam === team
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Outside of school teams" htmlFor="outsideTeams">
              <div className="grid grid-cols-3 gap-3">
                {OUTSIDE_TEAMS.map((team) => (
                  <button
                    key={team}
                    type="button"
                    onClick={() => setFormData({ ...formData, outsideSchoolTeams: team })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.outsideSchoolTeams === team
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex items-center justify-between gap-4">
              <span className="text-base">In season or off season?</span>
              <div className="flex gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inSeason: false })}
                  className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                    !formData.inSeason
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  Off season
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, inSeason: true })}
                  className={`py-1.5 px-3 rounded border text-xs font-medium transition-all ${
                    formData.inSeason
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  In season
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Basketball Watching */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Basketball Watching</h2>
            
            <Field label="How much basketball do you watch?" htmlFor="basketballWatching">
              <div className="grid grid-cols-2 gap-3">
                {BASKETBALL_WATCHING.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, basketballWatching: option })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.basketballWatching === option
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 9: Equipment & Availability */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Equipment & Availability</h2>
            
            <Field label="Access to equipment" htmlFor="equipmentAccess">
              <div className="grid grid-cols-2 gap-3">
                {EQUIPMENT.map((equip) => (
                  <button
                    key={equip}
                    type="button"
                    onClick={() => setFormData({ ...formData, equipmentAccess: equip })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.equipmentAccess === equip
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {equip}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Days you can train" htmlFor="trainingDays">
              <div className="grid grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const newDays = formData.trainingDays.includes(day)
                        ? formData.trainingDays.filter((d) => d !== day)
                        : [...formData.trainingDays, day]
                      setFormData({ ...formData, trainingDays: newDays })
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.trainingDays.includes(day)
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Average session length (minutes)" htmlFor="sessionLength">
              <div className="grid grid-cols-3 gap-3">
                {SESSION_LENGTHS.map((length) => (
                  <button
                    key={length}
                    type="button"
                    onClick={() => setFormData({ ...formData, averageSessionLength: length })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.averageSessionLength === length
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {length} min
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 10: Mental & Coaching */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Mental & Coaching</h2>
            
            <Field label="Biggest in-game struggle right now?" htmlFor="biggestStruggle">
              <textarea
                id="biggestStruggle"
                value={formData.biggestStruggle}
                onChange={(e) => setFormData({ ...formData, biggestStruggle: e.target.value })}
                placeholder="What's your biggest challenge during games?"
                rows={3}
                className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              />
            </Field>

            <Field label="Confidence Level (1-5)" htmlFor="confidenceLevel">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, confidenceLevel: level })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.confidenceLevel === level
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Biggest mental challenge" htmlFor="mentalChallenge">
              <div className="grid grid-cols-2 gap-3">
                {MENTAL_CHALLENGES.map((challenge) => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => setFormData({ ...formData, mentalChallenge: challenge })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.mentalChallenge === challenge
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
              {formData.mentalChallenge === "Other" && (
                <Input
                  value={formData.mentalChallengeOther}
                  onChange={(e) => setFormData({ ...formData, mentalChallengeOther: e.target.value })}
                  placeholder="Please specify"
                  className="mt-3"
                />
              )}
            </Field>

            <Field label="How coachable are you? (1-5)" htmlFor="coachability">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, coachability: level })}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.coachability === level
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Preferred coaching style" htmlFor="coachingStyle">
              <div className="grid grid-cols-2 gap-3">
                {COACHING_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredCoachingStyle: style })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.preferredCoachingStyle === style
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              {formData.preferredCoachingStyle === "Other" && (
                <Input
                  value={formData.coachingStyleOther}
                  onChange={(e) => setFormData({ ...formData, coachingStyleOther: e.target.value })}
                  placeholder="Please specify"
                  className="mt-3"
                />
              )}
            </Field>
          </div>
        )}

        {/* Step 11: Game Film Upload */}
        {currentStep === 11 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Game Film (Optional)</h2>
            <p className="text-neutral-600 mb-6">
              Upload a video of your game play to help us understand your style better
            </p>
            
            {formData.gameFilmUrl ? (
              <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Game film uploaded</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, gameFilmUrl: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                <span className="text-sm text-neutral-600">Click to upload game film</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleVideoUpload(file, "gameFilm")
                  }}
                  disabled={isUploading}
                />
              </label>
            )}
            
            {isUploading && (
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
                <p className="text-sm text-neutral-500 mt-2">Uploading...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 12: Workout Videos Upload */}
        {currentStep === 12 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Workout Videos (Optional)</h2>
            <p className="text-neutral-600 mb-6">
              Upload videos of your training sessions
            </p>
            
            {formData.workoutVideos.length > 0 && (
              <div className="space-y-2">
                {formData.workoutVideos.map((url, index) => (
                  <div
                    key={index}
                    className="p-3 border border-green-500 rounded-lg bg-green-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Workout video {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          workoutVideos: formData.workoutVideos.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              <Upload className="h-8 w-8 text-neutral-400 mb-2" />
              <span className="text-sm text-neutral-600">Click to upload workout video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleVideoUpload(file, "workout")
                }}
                disabled={isUploading}
              />
            </label>
            
            {isUploading && (
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
                <p className="text-sm text-neutral-500 mt-2">Uploading...</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="flex-1"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Complete Questionnaire"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
