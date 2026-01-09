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
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
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
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {program.coverImage && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              <Image
                                src={program.coverImage}
                                alt={program.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-white">{program.title}</div>
                            <div className="text-sm text-white/50">/{program.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="border-white/20 text-white/70">
                          {program.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={program.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {format(new Date(program.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {program.createdBy?.name || program.createdBy?.email || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/programs/${program.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/admin/programs/${program.id}`}>
                            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
