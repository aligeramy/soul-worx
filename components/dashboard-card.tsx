import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  href: string
  icon: LucideIcon
  title: string
  subtitle: string
  value?: string | number
}

export function DashboardCard({ href, icon: Icon, title, subtitle, value }: DashboardCardProps) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
      <CardContent className="p-2 sm:p-4 h-full">
        <Link href={href} className="block h-full">
          <div className="flex flex-col items-center justify-center text-center h-full gap-1 sm:gap-2">
            <div className="p-2 sm:p-3 bg-white/10 rounded-lg mb-3">
              <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex gap-1 items-center justify-center">
            {value !== undefined && (
              <p className="text-md sm:text-3xl font-crimson font-bold text-white leading-none">
                {value}
              </p>
            )}
            <p className="text-md sm:text-base font-crimson font-normal text-white leading-none">
              {title}
            </p>
            </div>


            <p className="text-[10px] sm:text-xs text-white/60 font-medium">
              {subtitle}
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}

