import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number
  href: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
}

export function StatCard({ title, value, href, icon: Icon, trend }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-white/10">
              <Icon className="h-5 w-5 text-white" />
            </div>
            {trend && (
              <div className="text-xs text-emerald-300 font-medium">
                +{trend.value}% {trend.label}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-crimson font-normal text-white">{value.toLocaleString()}</p>
            <p className="text-sm text-white/60 font-medium">{title}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

