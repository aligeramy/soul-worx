import { getAllProgramsAdmin } from "@/lib/db/queries"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

export default async function AdminProgramsPage() {
  const programs = await getAllProgramsAdmin()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Programs</h1>
          <p className="text-neutral-600 mt-2">Manage your programs and workshops</p>
        </div>
        <Link
          href="/dashboard/admin/programs/new"
          className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-colors"
        >
          + New Program
        </Link>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Program</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Created</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    {program.coverImage && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={program.coverImage}
                          alt={program.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-neutral-900">{program.title}</div>
                      <div className="text-sm text-neutral-500">/{program.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {program.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={program.status} />
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {format(new Date(program.createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/dashboard/admin/programs/${program.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="text-sm text-neutral-600 hover:text-neutral-800 font-medium"
                    target="_blank"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No programs yet</p>
            <Link
              href="/dashboard/admin/programs/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first program →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: "bg-neutral-100 text-neutral-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  )
}

