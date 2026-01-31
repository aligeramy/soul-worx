"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles, Trash2, ArrowRight } from "lucide-react"
import { CareerCard } from "./career-card"

interface AIAssistantProps {
  userId: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  careers?: CareerOption[]
}

interface CareerOption {
  title: string
  description: string
  category?: string
}

interface SelectedInfo {
  grade?: string
  interests: string[]
  skills: string[]
  weaknesses: string[]
  hobbies: string[]
}

const QUICK_OPTIONS = {
  grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12", "University", "Graduate", "Career Change"],
  interests: ["Science", "Math", "English", "Social Studies", "Arts", "Music", "Sports", "Technology", "Business", "Psychology", "Sociology", "History", "Literature", "Philosophy"],
  skills: ["Writing", "Communication", "Creative Thinking", "Problem Solving", "Leadership", "Teamwork", "Artistic", "Analytical", "Research", "Public Speaking", "Organization"],
  weaknesses: ["Math", "Science", "Public Speaking", "Writing", "Time Management", "Organization"],
  hobbies: ["Painting", "Drawing", "Reading", "Writing", "Music", "Sports", "Gaming", "Photography", "Cooking", "Volunteering", "Travel"],
}

// Storage key for conversation persistence
const CONVERSATION_STORAGE_KEY = "@soulworx_assistant_conversation"

// Token limits (approximate)
const MAX_TOKENS = 8000
const TARGET_TOKENS = 6000
const TOKENS_PER_MESSAGE = 50

// Estimate token count (rough approximation: ~4 characters per token)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4)
}

export function AIAssistant({ userId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your career coach at Soulworx. I'm here to help you explore career paths that align with your interests, skills, and goals.\n\nYou can tell me about yourself by typing, or use the quick-select buttons below to add information quickly!",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>({
    interests: [],
    skills: [],
    weaknesses: [],
    hobbies: [],
  })
  const [showQuickSelect, setShowQuickSelect] = useState(true)
  const scrollViewRef = useRef<HTMLDivElement>(null)
  const messageQueueRef = useRef<Promise<void>>(Promise.resolve())
  const conversationSummaryRef = useRef<string>("")
  const messagesRef = useRef<Message[]>(messages)

  // Load conversation from localStorage on mount
  useEffect(() => {
    loadConversation()
  }, [])

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      saveConversation()
    }
  }, [messages])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight
    }
  }, [messages])

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Load conversation from localStorage
  const loadConversation = () => {
    try {
      const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const loadedMessages: Message[] = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages)
          messagesRef.current = loadedMessages
          setShowQuickSelect(false)
        }
        if (parsed.summary) {
          conversationSummaryRef.current = parsed.summary
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  // Save conversation to localStorage
  const saveConversation = () => {
    try {
      localStorage.setItem(
        CONVERSATION_STORAGE_KEY,
        JSON.stringify({
          messages: messages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
          summary: conversationSummaryRef.current,
          lastUpdated: new Date().toISOString(),
        })
      )
    } catch (error) {
      console.error("Error saving conversation:", error)
    }
  }

  // Clear conversation from localStorage
  const clearConversation = () => {
    try {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY)
      conversationSummaryRef.current = ""
      const initialMessage: Message[] = [
        {
          id: "1",
          role: "assistant",
          content:
            "Hello! I'm your career coach at Soulworx. I'm here to help you explore career paths that align with your interests, skills, and goals.\n\nYou can tell me about yourself by typing, or use the quick-select buttons below to add information quickly!",
          timestamp: new Date(),
        },
      ]
      setMessages(initialMessage)
      messagesRef.current = initialMessage
      setShowQuickSelect(true)
    } catch (error) {
      console.error("Error clearing conversation:", error)
    }
  }

  const toggleSelection = (category: keyof SelectedInfo, value: string) => {
    setSelectedInfo((prev) => {
      if (category === "grade") {
        return { ...prev, grade: prev.grade === value ? undefined : value }
      }
      const currentArray = prev[category] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [category]: newArray }
    })
  }

  const buildSummaryMessage = (): string => {
    const parts: string[] = []

    if (selectedInfo.grade) {
      parts.push(`I'm a ${selectedInfo.grade.toLowerCase()} student`)
    }

    if (selectedInfo.interests.length > 0) {
      parts.push(`I'm interested in ${selectedInfo.interests.join(", ")}`)
    }

    if (selectedInfo.skills.length > 0) {
      parts.push(`I excel in ${selectedInfo.skills.join(", ")}`)
    }

    if (selectedInfo.weaknesses.length > 0) {
      parts.push(`I'm not particularly skilled in ${selectedInfo.weaknesses.join(", ")}`)
    }

    if (selectedInfo.hobbies.length > 0) {
      parts.push(`Outside of school, I enjoy ${selectedInfo.hobbies.join(", ")}`)
    }

    if (parts.length === 0) {
      return "I'm unsure about my career path and what I should major in."
    }

    return parts.join(". ") + ". I'm unsure about my career path and what I should major in."
  }

  const sendQuickSelect = async () => {
    const summary = buildSummaryMessage()
    if (summary && !isLoading) {
      await sendMessage(summary)
    }
  }

  // Prepare messages for API with token management
  const prepareMessagesForAPI = useCallback(
    (allMessages: Message[]): Array<{ role: string; content: string }> => {
      const systemPrompt = `You are a career coach at Soulworx, helping students and young professionals discover career paths that align with their interests, skills, and goals. 

Your approach:
1. Ask thoughtful follow-up questions to understand the person's interests, strengths, weaknesses, hobbies, and concerns
2. Be encouraging and supportive - help them see possibilities they might not have considered
3. When you have enough information (after 2-3 exchanges), provide 3-5 specific career recommendations

When providing career recommendations, format them as JSON in this exact structure:
{
  "text": "Your encouraging response text here",
  "careers": [
    {
      "title": "Career Name",
      "description": "Brief description of why this career fits them and what it involves",
      "category": "Category (e.g., Arts, Social Sciences, Education, etc.)"
    }
  ]
}

If you don't have enough information yet, just respond conversationally without JSON. Be warm, empathetic, and help guide the conversation.`

      const apiMessages: Array<{ role: string; content: string }> = [
        {
          role: "system",
          content: systemPrompt,
        },
      ]

      // Add conversation summary if we have one and messages are getting long
      if (conversationSummaryRef.current && allMessages.length > 10) {
        apiMessages.push({
          role: "system",
          content: `Previous conversation summary: ${conversationSummaryRef.current}`,
        })
      }

      // Calculate tokens used so far
      let tokensUsed = estimateTokens(systemPrompt)
      if (conversationSummaryRef.current) {
        tokensUsed += estimateTokens(conversationSummaryRef.current)
      }

      // Add messages from newest to oldest, keeping within token limits
      const messagesToInclude: Message[] = []
      for (let i = allMessages.length - 1; i >= 0; i--) {
        const msg = allMessages[i]
        const msgTokens = estimateTokens(msg.content)

        // Always include the most recent messages (last 5)
        if (allMessages.length - i <= 5) {
          messagesToInclude.unshift(msg)
          tokensUsed += msgTokens
          continue
        }

        // For older messages, check if we have room
        if (tokensUsed + msgTokens < TARGET_TOKENS) {
          messagesToInclude.unshift(msg)
          tokensUsed += msgTokens
        } else {
          // If we're running out of space, stop adding older messages
          break
        }
      }

      // Add messages to API payload
      messagesToInclude.forEach((msg) => {
        apiMessages.push({
          role: msg.role,
          content: msg.content,
        })
      })

      return apiMessages
    },
    []
  )

  const sendMessage = async (customText?: string) => {
    const messageText = customText || inputText.trim()
    if (!messageText || isLoading) return

    // Queue messages to prevent race conditions
    messageQueueRef.current = messageQueueRef.current
      .then(async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: messageText,
          timestamp: new Date(),
        }

        // Get current messages and add user message
        const currentMessages = [...messagesRef.current, userMessage]
        setMessages(currentMessages)
        messagesRef.current = currentMessages
        setInputText("")
        setShowQuickSelect(false)
        setIsLoading(true)

        let retryCount = 0
        let success = false

        while (!success && retryCount <= 2) {
          try {
            const apiMessages = prepareMessagesForAPI(currentMessages)

            const response = await fetch("/api/ai/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: apiMessages,
              }),
            })

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}))

              // Handle specific error cases
              if (response.status === 429) {
                // Rate limit - wait and retry
                await new Promise((resolve) => setTimeout(resolve, 2000 * (retryCount + 1)))
                retryCount++
                setIsRetrying(true)
                continue
              } else if (response.status === 401) {
                throw new Error("Invalid API key. Please check your configuration.")
              } else if (response.status >= 500) {
                // Server error - retry
                retryCount++
                setIsRetrying(true)
                await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)))
                continue
              } else {
                throw new Error(`API error: ${response.status}`)
              }
            }

            const data = await response.json()
            const responseText = data.content || "Sorry, I couldn't generate a response."

            // Try to parse JSON from the response
            let careers: CareerOption[] | undefined
            let content = responseText

            // Look for JSON in the response (could be wrapped in markdown code blocks or standalone)
            const jsonMatch = responseText.match(/\{[\s\S]*"careers"[\s\S]*\}/)
            if (jsonMatch) {
              try {
                const parsed = JSON.parse(jsonMatch[0])
                if (parsed.careers && Array.isArray(parsed.careers)) {
                  careers = parsed.careers
                  content = parsed.text || responseText.replace(jsonMatch[0], "").trim()
                }
              } catch (e) {
                console.log("Failed to parse careers JSON:", e)
              }
            }

            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: content,
              careers: careers,
              timestamp: new Date(),
            }

            const updatedMessages = [...currentMessages, assistantMessage]

            // Update conversation summary if conversation is getting long
            if (updatedMessages.length > 15 && !conversationSummaryRef.current) {
              // Generate a summary of older messages
              const olderMessages = updatedMessages.slice(0, Math.floor(updatedMessages.length / 2))
              conversationSummaryRef.current = `Previous conversation covered: ${olderMessages
                .filter((m) => m.role === "user")
                .slice(0, 5)
                .map((m) => m.content.substring(0, 50))
                .join("; ")}...`
            }

            setMessages(updatedMessages)
            messagesRef.current = updatedMessages

            success = true
            setIsRetrying(false)
          } catch (error: any) {
            console.error("Error sending message:", error)

            if (retryCount < 2) {
              retryCount++
              setIsRetrying(true)
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
              continue
            }

            // Final error handling
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content:
                error.message?.includes("API key")
                  ? "Configuration error: Please check your API settings."
                  : "Sorry, I encountered an error. Please check your connection and try again.",
              timestamp: new Date(),
            }
            const errorMessages = [...currentMessages, errorMessage]
            setMessages(errorMessages)
            messagesRef.current = errorMessages
            success = true // Stop retrying
            setIsRetrying(false)
          } finally {
            setIsLoading(false)
          }
        }
      })
      .catch((error) => {
        console.error("Message queue error:", error)
        setIsLoading(false)
        setIsRetrying(false)
      })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-100">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-crimson font-normal tracking-tight text-white">Soulworx Assistant</h1>
            <p className="text-white/60 -mt-1">Career Coach</p>
          </div>
        </div>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm("Are you sure you want to clear this conversation?")) {
                clearConversation()
              }
            }}
            className="text-white hover:bg-white/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6">
          <div
            ref={scrollViewRef}
            className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto mb-4"
          >
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                {/* Career Cards */}
                {message.careers && message.careers.length > 0 && (
                  <div className="mt-4 mb-6 space-y-3">
                    <h3 className="text-white font-semibold text-lg">Career Recommendations</h3>
                    {message.careers.map((career, index) => (
                      <CareerCard
                        key={index}
                        title={career.title}
                        description={career.description}
                        category={career.category}
                        href={`/dashboard/ai-assistant/career/${encodeURIComponent(career.title)}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <div className="bg-white/10 text-white border border-white/20 rounded-lg p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                {isRetrying && <span className="text-white/60 text-sm">Retrying...</span>}
              </div>
            )}
          </div>

          {/* Quick Select Section */}
          {showQuickSelect && (
            <div className="border-t border-white/10 pt-4 mt-4 space-y-4 max-h-[300px] overflow-y-auto">
              {/* Grade Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Grade:</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => toggleSelection("grade", grade)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedInfo.grade === grade
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Interests:</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleSelection("interests", interest)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedInfo.interests.includes(interest)
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">I Excel In:</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSelection("skills", skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedInfo.skills.includes(skill)
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Not Skilled In:</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.weaknesses.map((weakness) => (
                    <button
                      key={weakness}
                      onClick={() => toggleSelection("weaknesses", weakness)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedInfo.weaknesses.includes(weakness)
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {weakness}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Hobbies:</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_OPTIONS.hobbies.map((hobby) => (
                    <button
                      key={hobby}
                      onClick={() => toggleSelection("hobbies", hobby)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedInfo.hobbies.includes(hobby)
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>

              {/* Get Recommendations Button */}
              {(selectedInfo.grade ||
                selectedInfo.interests.length > 0 ||
                selectedInfo.skills.length > 0 ||
                selectedInfo.weaknesses.length > 0 ||
                selectedInfo.hobbies.length > 0) && (
                <Button
                  onClick={sendQuickSelect}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Career Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 mt-4">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              maxLength={500}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
