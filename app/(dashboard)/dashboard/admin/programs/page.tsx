import { getAllProgramsAdmin } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Pencil } from "lucide-react"

export default async function AdminProgramsPage() {
  const programs = await getAllProgramsAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Programs</h1>
          <p className="text-white/60 mt-1">Manage your programs and workshops</p>
        </div>
        <Link href="/dashboard/admin/programs/new">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Program
          </Button>
        </Link>
      </div>

      {programs.length === 0 ? (
        <Card className="bg-[#1c1c1e] border-white/10">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No programs yet</h3>
            <p className="text-white/60 mb-6">Create your first program to get started</p>
            <Link href="/dashboard/admin/programs/new">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {programs.map((program) => (
            <Card key={program.id} className="bg-[#1c1c1e] border-white/10 hover:bg-[#2c2c2e] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Image */}
                  {program.coverImage && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                      <Image
                        src={program.coverImage}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1">{program.title}</h3>
                        <p className="text-sm text-white/50">/{program.slug}</p>
                      </div>
                      <StatusBadge status={program.status} />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {program.category}
                      </Badge>
                      <span className="text-xs text-white/50">
                        Created {format(new Date(program.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/admin/programs/${program.id}`}>
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/programs/${program.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    draft: "bg-white/10 text-white/70 border-white/20",
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    archived: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
