import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAllProductsForAdmin } from "@/lib/db/queries"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminShopPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin")
  }

  const products = await getAllProductsForAdmin()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Products</h1>
          <p className="text-neutral-600 mt-2">
            Manage your shop inventory and products
          </p>
        </div>
        <Link href="/dashboard/admin/shop/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-neutral-600 mb-1">Total Products</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-neutral-600 mb-1">Active</p>
          <p className="text-3xl font-bold">
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-neutral-600 mb-1">Drafts</p>
          <p className="text-3xl font-bold">
            {products.filter((p) => p.status === "draft").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-neutral-600 mb-1">Out of Stock</p>
          <p className="text-3xl font-bold">
            {products.filter((p) => p.status === "sold_out" || p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} />
    </div>
  )
}

